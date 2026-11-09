import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine3D, NearbyTarget, ActionKeyType } from '../../game3d/Engine3D';
import { WorldBuilder } from '../../game3d/WorldBuilder';
import { HUDOverlay } from './HUDOverlay';
import { DialogueOverlay } from './DialogueOverlay';
import { MiniGameModal } from './MiniGameModal';
import { JournalModal } from './JournalModal';
import { WorldSelectModal } from './WorldSelectModal';
import { PauseSettingsModal } from './PauseSettingsModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { TouchControls } from './TouchControls';
import { MovementDebugHUD, DebugTelemetryData } from './MovementDebugHUD';
import { 
  HistoricalWorldId, 
  Quest, 
  CollectibleItem, 
  DetectiveBadge, 
  NPCEntity, 
  MiniGameData 
} from '../../types';
import { 
  WORLD_01_QUESTS, 
  WORLD_01_COLLECTIBLES, 
  WORLD_01_NPCS, 
  GAME_BADGES 
} from '../../data/worldData';
import { sound } from '../../utils/audio';

interface GameCanvas3DProps {
  onReturnToTitle: () => void;
  initialWorldId?: HistoricalWorldId;
}

const SAVE_STORAGE_KEY = 'JEJAK_NUSANTARA_SAVE_V1';

interface SavedGameState {
  quests: Quest[];
  activeQuestIndex: number;
  collectibles: CollectibleItem[];
  badges: DetectiveBadge[];
  xp: number;
  level: number;
  savedAt: string;
}

const loadGameSave = (): SavedGameState | null => {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.quests) && parsed.quests.length > 0) {
      return parsed as SavedGameState;
    }
  } catch (err) {
    console.warn('Could not parse saved game data:', err);
  }
  return null;
};

export const GameCanvas3D: React.FC<GameCanvas3DProps> = ({ 
  onReturnToTitle,
  initialWorldId = 'WORLD_01_RENGASDENGKLOK'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine3D | null>(null);

  // Load persistent save if available
  const savedStateRef = useRef<SavedGameState | null>(loadGameSave());
  const initialSave = savedStateRef.current;

  // Game States
  const [currentWorldId, setCurrentWorldId] = useState<HistoricalWorldId>(initialWorldId);
  const [quests, setQuests] = useState<Quest[]>(() => {
    if (initialSave?.quests && initialSave.quests.length === WORLD_01_QUESTS.length) {
      return initialSave.quests;
    }
    return WORLD_01_QUESTS;
  });
  const [activeQuestIndex, setActiveQuestIndex] = useState<number>(() => {
    if (typeof initialSave?.activeQuestIndex === 'number') {
      return Math.min(Math.max(0, initialSave.activeQuestIndex), WORLD_01_QUESTS.length - 1);
    }
    return 0;
  });
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(() => {
    if (initialSave?.collectibles) {
      return initialSave.collectibles;
    }
    return WORLD_01_COLLECTIBLES;
  });
  const [badges, setBadges] = useState<DetectiveBadge[]>(() => {
    if (initialSave?.badges) {
      return initialSave.badges;
    }
    return GAME_BADGES;
  });
  const [xp, setXp] = useState<number>(() => initialSave?.xp ?? 50);
  const [level, setLevel] = useState<number>(() => initialSave?.level ?? 1);
  const [stars, setStars] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [completedQuestToast, setCompletedQuestToast] = useState<{ title: string; rewardXP: number } | null>(null);

  // Overlays state
  const [nearbyTarget, setNearbyTarget] = useState<NearbyTarget | null>(null);
  const [activeDialogueNPC, setActiveDialogueNPC] = useState<NPCEntity | null>(null);
  const [dialogueLines, setDialogueLines] = useState<string[]>([]);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameData | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isWorldSelectOpen, setIsWorldSelectOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLevelCompleteOpen, setIsLevelCompleteOpen] = useState<boolean>(false);

  // Real-time Movement Debugging HUD state
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);
  const [debugTelemetry, setDebugTelemetry] = useState<DebugTelemetryData | null>(null);

  // Active quest (Single Source of Truth)
  const activeQuest = quests[activeQuestIndex] || quests[0];

  // Helper to award XP and check Level Up
  const addXP = useCallback((amount: number) => {
    setXp(prev => {
      const next = prev + amount;
      const newLevel = Math.floor(next / 200) + 1;
      setLevel(newLevel);
      return next;
    });
  }, []);

  // Helper to unlock badges
  const unlockBadge = useCallback((badgeId: string) => {
    setBadges(prev => {
      const found = prev.find(b => b.id === badgeId);
      if (found && !found.isUnlocked) {
        sound.playCompassChime();
        addXP(100);
        return prev.map(b => b.id === badgeId ? { ...b, isUnlocked: true } : b);
      }
      return prev;
    });
  }, [addXP]);

  // Auto-persist game progress to LocalStorage
  useEffect(() => {
    try {
      const payload: SavedGameState = {
        quests,
        activeQuestIndex,
        collectibles,
        badges,
        xp,
        level,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save game state to LocalStorage:', err);
    }
  }, [quests, activeQuestIndex, collectibles, badges, xp, level]);

  // Auto-dismiss completed quest toast banner after 3.5s
  useEffect(() => {
    if (completedQuestToast) {
      const timer = setTimeout(() => {
        setCompletedQuestToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [completedQuestToast]);

  // Reset movement input on any overlay state change to prevent stuck keys
  useEffect(() => {
    engineRef.current?.resetMovementInput();
  }, [
    isJournalOpen,
    isWorldSelectOpen,
    isSettingsOpen,
    isLevelCompleteOpen,
    activeDialogueNPC,
    activeMiniGame
  ]);

  // Advance single step within current quest
  const advanceActiveQuestStep = useCallback(() => {
    setQuests(prev => {
      const copy = prev.map(q => ({
        ...q,
        steps: q.steps.map(s => ({ ...s }))
      }));
      const q = copy[activeQuestIndex];
      if (!q || q.status === 'COMPLETED') return prev;

      if (q.currentStepIndex < q.steps.length - 1) {
        q.steps[q.currentStepIndex].isCompleted = true;
        q.currentStepIndex += 1;
        sound.playCompassChime();
        return copy;
      } else {
        // Complete the quest
        q.steps[q.currentStepIndex].isCompleted = true;
        q.isCompleted = true;
        q.status = 'COMPLETED';
        sound.playQuestComplete();
        addXP(q.rewardXP);

        setCompletedQuestToast({
          title: q.title,
          rewardXP: q.rewardXP
        });

        if (activeQuestIndex < copy.length - 1) {
          copy[activeQuestIndex + 1].status = 'ACTIVE';
          setActiveQuestIndex(prevIdx => prevIdx + 1);
        } else {
          unlockBadge('badge-master-adventurer');
          unlockBadge('badge-nusantara-explorer');
          setTimeout(() => setIsLevelCompleteOpen(true), 1200);
        }
        return copy;
      }
    });
  }, [activeQuestIndex, addXP, unlockBadge]);

  // Complete entire current quest (e.g. after full dialogue or mini-game)
  const completeActiveQuest = useCallback(() => {
    setQuests(prev => {
      const copy = prev.map(q => ({
        ...q,
        steps: q.steps.map(s => ({ ...s }))
      }));
      const q = copy[activeQuestIndex];
      if (!q || q.status === 'COMPLETED') return prev;

      q.steps.forEach(s => { s.isCompleted = true; });
      q.currentStepIndex = q.steps.length - 1;
      q.isCompleted = true;
      q.status = 'COMPLETED';
      sound.playQuestComplete();
      addXP(q.rewardXP);

      setCompletedQuestToast({
        title: q.title,
        rewardXP: q.rewardXP
      });

      if (activeQuestIndex < copy.length - 1) {
        copy[activeQuestIndex + 1].status = 'ACTIVE';
        setActiveQuestIndex(prevIdx => prevIdx + 1);
      } else {
        unlockBadge('badge-master-adventurer');
        unlockBadge('badge-nusantara-explorer');
        setTimeout(() => setIsLevelCompleteOpen(true), 1200);
      }
      return copy;
    });
  }, [activeQuestIndex, addXP, unlockBadge]);

  // Handle Player Interaction
  const handleInteract = useCallback(() => {
    const target = engineRef.current?.nearbyTarget;
    if (!target) return;
    sound.playClick();

    if (target.type === 'NPC') {
      const npc = target.entityData as NPCEntity;
      setActiveDialogueNPC(npc);

      let lines = npc.dialogueTree.greeting;
      if (npc.id === 'npc-singgih') {
        if (activeQuest.id === 'quest-01-singgih') {
          lines = npc.dialogueTree.greeting;
        } else {
          lines = npc.dialogueTree.completedDialogue || npc.dialogueTree.greeting;
        }
      } else if (npc.id === 'npc-djiaw') {
        const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
        if (activeQuest.id === 'quest-02-dispatch') {
          lines = hasPouch 
            ? (npc.dialogueTree.completedDialogue || npc.dialogueTree.greeting)
            : (npc.dialogueTree.questDialogue || npc.dialogueTree.greeting);
        } else {
          lines = npc.dialogueTree.greeting;
        }
      } else if (npc.id === 'npc-soekarno' || npc.id === 'npc-hatta') {
        lines = npc.dialogueTree.greeting;
      } else if (npc.id === 'npc-soebardjo') {
        lines = npc.dialogueTree.greeting;
      }

      setDialogueLines(lines);
    } else if (target.type === 'COLLECTIBLE') {
      const item = target.entityData as CollectibleItem;
      collectItem(item);
    } else if (target.type === 'CHEST') {
      if (activeQuest.id === 'quest-03-cipher') {
        setActiveMiniGame({
          type: 'CIPHER',
          title: 'Peti Sandi Telegraf Komando PETA',
          instructions: 'Gembok komando ini disegel dengan sandi 4 digit. Petunjuk: Hari dan Bulan tibanya Bung Karno dan Bung Hatta di Rengasdengklok (Format DDMM = 1608).',
          isOpen: true
        });
      } else {
        const isOpenAlready = activeQuestIndex > 2;
        setActiveDialogueNPC({
          id: 'npc-chest-info',
          name: 'Peti Sandi Komando',
          role: 'Perangkat Militer',
          position: { x: -23, y: 0, z: -0.2 },
          rotationY: 0,
          modelStyle: 'peta',
          dialogueTree: {
            greeting: [
              isOpenAlready
                ? 'Peti sandi komando sudah terbuka. Kode 1608 telah diverifikasi.'
                : 'Peti terkunci dengan sandi gembok 4 digit. Selesaikan misi sebelumnya untuk membuka.'
            ]
          }
        });
        setDialogueLines([
          isOpenAlready
            ? 'Peti sandi komando sudah terbuka. Kode 1608 telah diverifikasi.'
            : 'Peti terkunci dengan sandi gembok 4 digit. Selesaikan misi sebelumnya untuk membuka.'
        ]);
      }
    }
  }, [activeQuest.id, activeQuestIndex, collectibles]);

  // Collect artifact handler
  const collectItem = useCallback((item: CollectibleItem) => {
    sound.playCollectible();
    addXP(75);
    unlockBadge('badge-first-explorer');

    setCollectibles(prev => {
      const updated = prev.map(c => c.id === item.id ? { ...c, isFound: true } : c);
      if (updated.filter(c => c.isFound).length === updated.length) {
        unlockBadge('badge-history-hunter');
      }
      return updated;
    });

    if (engineRef.current) {
      engineRef.current.removeCollectibleMesh(item.id);
    }

    if (item.id === 'col-dispatch-pouch' && activeQuest.id === 'quest-02-dispatch') {
      advanceActiveQuestStep();
    }
  }, [addXP, advanceActiveQuestStep, unlockBadge, activeQuest.id]);

  // Action key dispatch from engine
  const handleActionKey = useCallback((action: ActionKeyType) => {
    switch (action) {
      case 'INTERACT':
        handleInteract();
        break;
      case 'JOURNAL':
        setIsJournalOpen(prev => !prev);
        break;
      case 'MAP':
        setIsWorldSelectOpen(prev => !prev);
        break;
      case 'SETTINGS':
        setIsSettingsOpen(prev => !prev);
        break;
      case 'TOGGLE_DEBUG':
        setIsDebugOpen(prev => !prev);
        break;
    }
  }, [handleInteract]);

  // Active quest target synchronization with Engine3D
  useEffect(() => {
    if (!engineRef.current) return;
    let targetId: string | null = null;
    if (activeQuest.id === 'quest-01-singgih') {
      targetId = 'npc-singgih';
    } else if (activeQuest.id === 'quest-02-dispatch') {
      const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
      targetId = hasPouch ? 'npc-djiaw' : 'col-dispatch-pouch';
    } else if (activeQuest.id === 'quest-03-cipher') {
      targetId = 'chest-peta';
    } else if (activeQuest.id === 'quest-04-veranda') {
      targetId = 'npc-soekarno';
    } else if (activeQuest.id === 'quest-05-timeline') {
      targetId = 'npc-soebardjo';
    }
    engineRef.current.setActiveQuestTarget(targetId);
  }, [activeQuest.id, collectibles]);

  // Instantiate Engine3D
  useEffect(() => {
    if (!containerRef.current) return;

    // Create fresh instance of engine
    const engine = new Engine3D(containerRef.current);
    engineRef.current = engine;

    // Attach action key callback
    engine.onActionKey = handleActionKey;

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      engine.handleResize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Poll nearby target and debug telemetry periodically (every 50ms)
    const pollInterval = setInterval(() => {
      if (engine.nearbyTarget?.id !== nearbyTarget?.id) {
        setNearbyTarget(engine.nearbyTarget);
      }
      setDebugTelemetry(engine.getDebugTelemetry());
    }, 50);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleActionKey]);

  // Dialogue finish handler
  const handleDialogueFinish = () => {
    const speakerId = activeDialogueNPC?.id;
    setActiveDialogueNPC(null);
    setDialogueLines([]);
    engineRef.current?.resetMovementInput();

    if (speakerId === 'npc-singgih' && activeQuest.id === 'quest-01-singgih') {
      completeActiveQuest();
    } else if (speakerId === 'npc-djiaw' && activeQuest.id === 'quest-02-dispatch') {
      const hasPouch = collectibles.find(c => c.id === 'col-dispatch-pouch')?.isFound;
      if (hasPouch) {
        completeActiveQuest();
      } else if (activeQuest.currentStepIndex === 0) {
        advanceActiveQuestStep();
      }
    } else if ((speakerId === 'npc-soekarno' || speakerId === 'npc-hatta') && activeQuest.id === 'quest-04-veranda') {
      completeActiveQuest();
    } else if (speakerId === 'npc-soebardjo' && activeQuest.id === 'quest-05-timeline') {
      setActiveMiniGame({
        type: 'TIMELINE',
        title: 'Kronologi Detik-Detik Menuju Proklamasi',
        instructions: 'Susun urutan peristiwa bersejarah 14-16 Agustus 1945 secara runtut untuk mengawal kepulangan rombongan proklamator ke Jakarta!',
        isOpen: true
      });
    }
  };

  // Mini-game success handler
  const handleMiniGameSuccess = () => {
    const gameType = activeMiniGame?.type;
    setActiveMiniGame(null);
    engineRef.current?.resetMovementInput();

    if (gameType === 'CIPHER' && activeQuest.id === 'quest-03-cipher') {
      completeActiveQuest();
    } else if (gameType === 'TIMELINE' && activeQuest.id === 'quest-05-timeline') {
      completeActiveQuest();
    } else if (gameType === 'ROLE_MATCH') {
      addXP(150);
    }
  };

  // Touch Direction input for Mobile
  const handleTouchDirection = (dx: number, dy: number) => {
    if (!engineRef.current) return;
    engineRef.current.setVirtualMovement(
      dy < -0.3, // forward
      dy > 0.3,  // backward
      dx < -0.3, // left
      dx > 0.3   // right
    );
  };

  const handleTouchJump = () => {
    if (!engineRef.current) return;
    engineRef.current.setVirtualJump(true);
    setTimeout(() => {
      if (engineRef.current) engineRef.current.setVirtualJump(false);
    }, 180);
  };

  const handleTouchSprint = (sprint: boolean) => {
    if (engineRef.current) engineRef.current.setVirtualSprint(sprint);
  };

  // Manual direction buttons from MovementDebugger
  const handleManualDirection = (dir: 'W' | 'A' | 'S' | 'D' | 'SPACE' | 'SHIFT', active: boolean) => {
    if (!engineRef.current) return;
    switch (dir) {
      case 'W': engineRef.current.controls.forward = active; break;
      case 'S': engineRef.current.controls.backward = active; break;
      case 'A': engineRef.current.controls.left = active; break;
      case 'D': engineRef.current.controls.right = active; break;
      case 'SPACE': engineRef.current.controls.jump = active; break;
      case 'SHIFT': engineRef.current.controls.sprint = active; break;
    }
  };

  // Toggle collision in WorldBuilder
  const handleToggleCollision = () => {
    WorldBuilder.enableCollision = !WorldBuilder.enableCollision;
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const restartWorld = () => {
    try {
      localStorage.removeItem(SAVE_STORAGE_KEY);
    } catch { /* ignore */ }

    if (engineRef.current) {
      engineRef.current.player.mesh.position.set(0, 0, 24);
      engineRef.current.playerVelocity.set(0, 0, 0);
      engineRef.current.resetMovementInput();
    }
    setQuests(WORLD_01_QUESTS.map(q => ({
      ...q,
      steps: q.steps.map(s => ({ ...s }))
    })));
    setActiveQuestIndex(0);
    setCollectibles(WORLD_01_COLLECTIBLES.map(c => ({ ...c })));
    setBadges(GAME_BADGES.map(b => ({ ...b })));
    setXp(50);
    setLevel(1);
    setCompletedQuestToast(null);
    sound.playClick();
  };

  const collectiblesFoundCount = collectibles.filter(c => c.isFound).length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* 3D WebGL Canvas Container with auto-focus */}
      <div 
        ref={containerRef} 
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing outline-none" 
      />

      {/* Modern Adventure HUD Overlay */}
      <HUDOverlay
        activeQuest={activeQuest}
        collectiblesFoundCount={collectiblesFoundCount}
        totalCollectiblesCount={collectibles.length}
        xp={xp}
        level={level}
        nearbyPrompt={nearbyTarget ? nearbyTarget.prompt : null}
        completedQuestToast={completedQuestToast}
        onInteract={handleInteract}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWorldSelect={() => setIsWorldSelectOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Movement Debugger HUD (Shows live keys, coordinates, velocities, and manual buttons) */}
      <MovementDebugHUD
        telemetry={debugTelemetry}
        isOpen={isDebugOpen}
        onToggle={() => setIsDebugOpen(prev => !prev)}
        onPressDirection={handleManualDirection}
        onToggleCollision={handleToggleCollision}
      />

      {/* NPC Dialogue Overlay */}
      <DialogueOverlay
        npc={activeDialogueNPC}
        dialogueLines={dialogueLines}
        onFinish={handleDialogueFinish}
        onClose={() => setActiveDialogueNPC(null)}
      />

      {/* Mini-Games Modal (Cipher, Timeline, Role Match) */}
      {activeMiniGame && activeMiniGame.isOpen && (
        <MiniGameModal
          gameData={activeMiniGame}
          onSuccess={handleMiniGameSuccess}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

      {/* Adventurer's Journal & Chronicle Compass */}
      {isJournalOpen && (
        <JournalModal
          quests={quests}
          collectibles={collectibles}
          badges={badges}
          xp={xp}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {/* World Selection Map Modal */}
      {isWorldSelectOpen && (
        <WorldSelectModal
          currentWorldId={currentWorldId}
          onSelectWorld={(worldId) => {
            setCurrentWorldId(worldId);
            setIsWorldSelectOpen(false);
          }}
          onClose={() => setIsWorldSelectOpen(false)}
        />
      )}

      {/* Settings / Pause Modal */}
      {isSettingsOpen && (
        <PauseSettingsModal
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onRestartWorld={restartWorld}
          onReturnToMenu={onReturnToTitle}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Grand Finale Level Complete Modal */}
      {isLevelCompleteOpen && (
        <LevelCompleteModal
          xp={xp}
          stars={stars}
          onContinueExplore={() => setIsLevelCompleteOpen(false)}
          onOpenWorldSelect={() => {
            setIsLevelCompleteOpen(false);
            setIsWorldSelectOpen(true);
          }}
          onReturnToTitle={onReturnToTitle}
        />
      )}

      {/* Responsive Touch Controls for Mobile/Tablet */}
      <TouchControls
        onDirectionChange={handleTouchDirection}
        onJump={handleTouchJump}
        onSprintToggle={handleTouchSprint}
        onInteract={handleInteract}
        hasNearbyTarget={!!nearbyTarget}
      />
    </div>
  );
};
