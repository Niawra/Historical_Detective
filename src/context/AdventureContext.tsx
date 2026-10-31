import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  GameScreen, 
  MissionLocationId, 
  DetectiveClue, 
  DetectiveBadge, 
  MissionData,
  PlayerPosition 
} from '../types';
import { MISSIONS_LIST, INITIAL_BADGES, MISSION_1_CLUES } from '../data/adventureData';
import { sound } from '../utils/audio';

interface DialogueData {
  speaker: string;
  avatarText?: string;
  lines: string[];
  currentLineIndex: number;
  onFinish?: () => void;
}

interface InspectItemData {
  title: string;
  category: string;
  description: string;
  historicalNote?: string;
  rewardClue?: DetectiveClue;
}

interface AdventureContextType {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  selectedMission: MissionData;
  setSelectedMission: (mission: MissionData) => void;
  currentLocation: MissionLocationId;
  setCurrentLocation: (loc: MissionLocationId) => void;
  playerPos: PlayerPosition;
  setPlayerPos: React.Dispatch<React.SetStateAction<PlayerPosition>>;
  
  // Clues & Inventory
  clues: DetectiveClue[];
  addClue: (clue: DetectiveClue) => void;
  examinedObjectIds: string[];
  markObjectExamined: (id: string) => void;
  isNotebookOpen: boolean;
  toggleNotebook: () => void;

  // Rewards & Progress
  badges: DetectiveBadge[];
  unlockBadge: (badgeId: string) => void;
  xp: number;
  addXP: (amount: number) => void;
  stars: number;
  
  // Interactive UI Overlays
  activeDialogue: DialogueData | null;
  startDialogue: (speaker: string, lines: string[], onFinish?: () => void) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
  
  inspectData: InspectItemData | null;
  openInspect: (data: InspectItemData) => void;
  closeInspect: () => void;

  // Toasts
  toastClue: DetectiveClue | null;
  dismissToastClue: () => void;
  toastBadge: DetectiveBadge | null;
  dismissToastBadge: () => void;

  // Puzzle States
  roleMatchingSolved: boolean;
  setRoleMatchingSolved: (solved: boolean) => void;
  timelineSolved: boolean;
  setTimelineSolved: (solved: boolean) => void;
  deductionResult: {
    answerId: string;
    isCorrect: boolean;
    explanation: string;
    supportingCluesCount: number;
  } | null;
  submitDeduction: (answerId: string, clueIds: string[]) => boolean;

  // Audio Controls
  isMuted: boolean;
  toggleMute: () => void;
  isAmbientActive: boolean;
  toggleAmbient: () => void;

  // Navigation flow
  startMission1: () => void;
  continueGame: () => void;
  hasSavedGame: boolean;
  advanceToLocation: (loc: MissionLocationId) => void;
  restartMission: () => void;
  returnToMainMenu: () => void;
}

const SAVE_KEY = 'jejak_nusantara_adventure_v2';

const AdventureContext = createContext<AdventureContextType | undefined>(undefined);

export const AdventureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<GameScreen>('MENU_UTAMA');
  const [selectedMission, setSelectedMission] = useState<MissionData>(MISSIONS_LIST[0]);
  const [currentLocation, setCurrentLocation] = useState<MissionLocationId>('LOC_1_BRIEFING');
  
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({
    x: 48,
    y: 72,
    direction: 'UP',
    isMoving: false
  });

  const [clues, setClues] = useState<DetectiveClue[]>([]);
  const [examinedObjectIds, setExaminedObjectIds] = useState<string[]>([]);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [badges, setBadges] = useState<DetectiveBadge[]>(INITIAL_BADGES);
  const [xp, setXp] = useState(0);
  const [stars, setStars] = useState(0);

  const [activeDialogue, setActiveDialogue] = useState<DialogueData | null>(null);
  const [inspectData, setInspectData] = useState<InspectItemData | null>(null);

  const [toastClue, setToastClue] = useState<DetectiveClue | null>(null);
  const [toastBadge, setToastBadge] = useState<DetectiveBadge | null>(null);

  const [roleMatchingSolved, setRoleMatchingSolved] = useState(false);
  const [timelineSolved, setTimelineSolved] = useState(false);
  const [deductionResult, setDeductionResult] = useState<{
    answerId: string;
    isCorrect: boolean;
    explanation: string;
    supportingCluesCount: number;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Check saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setHasSavedGame(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const found = prev.find(b => b.id === badgeId);
      if (found && !found.isUnlocked) {
        sound.playBadge();
        setToastBadge(found);
        addXP(100);
        return prev.map(b => b.id === badgeId ? { ...b, isUnlocked: true } : b);
      }
      return prev;
    });
  };

  const addClue = (clue: DetectiveClue) => {
    setClues(prev => {
      if (prev.some(c => c.id === clue.id)) return prev;
      sound.playClueFound();
      sound.playStamp();
      setToastClue(clue);
      addXP(50);
      
      // Check first discovery badge
      if (prev.length === 0) {
        setTimeout(() => unlockBadge('badge-first-discovery'), 800);
      }
      return [...prev, clue];
    });
  };

  const markObjectExamined = (id: string) => {
    setExaminedObjectIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      // Check sharp observer if examined objects >= 3 in Rengasdengklok
      if (next.filter(o => o.startsWith('obj-rengas-')).length >= 3) {
        setTimeout(() => unlockBadge('badge-sharp-observer'), 800);
      }
      return next;
    });
  };

  const toggleNotebook = () => {
    sound.playPaper();
    setIsNotebookOpen(prev => !prev);
  };

  const startDialogue = (speaker: string, lines: string[], onFinish?: () => void) => {
    sound.playDialogue();
    setActiveDialogue({
      speaker,
      lines,
      currentLineIndex: 0,
      onFinish
    });
  };

  const advanceDialogue = () => {
    if (!activeDialogue) return;
    sound.playDialogue();
    if (activeDialogue.currentLineIndex < activeDialogue.lines.length - 1) {
      setActiveDialogue({
        ...activeDialogue,
        currentLineIndex: activeDialogue.currentLineIndex + 1
      });
    } else {
      const finishCb = activeDialogue.onFinish;
      setActiveDialogue(null);
      if (finishCb) finishCb();
    }
  };

  const closeDialogue = () => {
    setActiveDialogue(null);
  };

  const openInspect = (data: InspectItemData) => {
    sound.playPaper();
    setInspectData(data);
    if (data.rewardClue) {
      addClue(data.rewardClue);
    }
  };

  const closeInspect = () => {
    sound.playClick();
    setInspectData(null);
  };

  const dismissToastClue = () => setToastClue(null);
  const dismissToastBadge = () => setToastBadge(null);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const toggleAmbient = () => {
    const next = !isAmbientActive;
    setIsAmbientActive(next);
    sound.toggleAtmosphere(next);
  };

  const startMission1 = () => {
    sound.playPaper();
    setSelectedMission(MISSIONS_LIST[0]);
    setCurrentLocation('LOC_1_BRIEFING');
    setPlayerPos({ x: 48, y: 72, direction: 'UP', isMoving: false });
    setClues([]);
    setExaminedObjectIds([]);
    setRoleMatchingSolved(false);
    setTimelineSolved(false);
    setDeductionResult(null);
    setXp(50);
    setStars(0);
    setScreen('GAMEPLAY');
  };

  const continueGame = () => {
    sound.playPaper();
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentLocation) setCurrentLocation(parsed.currentLocation);
        if (parsed.clues) setClues(parsed.clues);
        if (parsed.examinedObjectIds) setExaminedObjectIds(parsed.examinedObjectIds);
        if (parsed.xp) setXp(parsed.xp);
        if (parsed.badges) setBadges(parsed.badges);
        if (parsed.roleMatchingSolved) setRoleMatchingSolved(parsed.roleMatchingSolved);
        if (parsed.timelineSolved) setTimelineSolved(parsed.timelineSolved);
        setScreen('GAMEPLAY');
        return;
      }
    } catch {
      // fallback
    }
    startMission1();
  };

  const advanceToLocation = (loc: MissionLocationId) => {
    sound.playPaper();
    setCurrentLocation(loc);
    // Reset player position for new room
    setPlayerPos({ x: 50, y: 80, direction: 'UP', isMoving: false });
  };

  const submitDeduction = (answerId: string, clueIds: string[]) => {
    sound.playStamp();
    const isCorrect = answerId === 'opt-b';
    const explanation = isCorrect
      ? 'Tepat sekali! Dokumen membuktikan pemuda mengamankan Soekarno-Hatta ke Rengasdengklok bukan untuk menyakiti, melainkan menjauhkan mereka dari pengaruh militer Jepang agar proklamasi dapat dipercepat atas nama bangsa Indonesia sendiri.'
      : 'Kesimpulan ini kurang tepat berdasarkan arsip sejarah. Pemuda tidak memberontak, melainkan mendesak proklamasi mandiri terbebas dari intervensi tentara Dai Nippon.';

    const calculatedStars = isCorrect ? (clueIds.length >= 2 ? 3 : 2) : 1;
    setStars(calculatedStars);

    if (isCorrect) {
      sound.playSuccess();
      addXP(250);
      unlockBadge('badge-master-detective');
    } else {
      addXP(100);
    }

    setDeductionResult({
      answerId,
      isCorrect,
      explanation,
      supportingCluesCount: clueIds.length
    });

    setScreen('HASIL_INVESTIGASI');
    return isCorrect;
  };

  const restartMission = () => {
    startMission1();
  };

  const returnToMainMenu = () => {
    sound.playClick();
    setScreen('MENU_UTAMA');
  };

  return (
    <AdventureContext.Provider
      value={{
        screen,
        setScreen,
        selectedMission,
        setSelectedMission,
        currentLocation,
        setCurrentLocation,
        playerPos,
        setPlayerPos,
        clues,
        addClue,
        examinedObjectIds,
        markObjectExamined,
        isNotebookOpen,
        toggleNotebook,
        badges,
        unlockBadge,
        xp,
        addXP,
        stars,
        activeDialogue,
        startDialogue,
        advanceDialogue,
        closeDialogue,
        inspectData,
        openInspect,
        closeInspect,
        toastClue,
        dismissToastClue,
        toastBadge,
        dismissToastBadge,
        roleMatchingSolved,
        setRoleMatchingSolved,
        timelineSolved,
        setTimelineSolved,
        deductionResult,
        submitDeduction,
        isMuted,
        toggleMute,
        isAmbientActive,
        toggleAmbient,
        startMission1,
        continueGame,
        hasSavedGame,
        advanceToLocation,
        restartMission,
        returnToMainMenu
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

export const useAdventure = () => {
  const context = useContext(AdventureContext);
  if (!context) throw new Error('useAdventure must be used within AdventureProvider');
  return context;
};
