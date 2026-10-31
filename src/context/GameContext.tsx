import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HISTORICAL_CASES } from '../data/cases';
import { HistoricalCase, PlayerProgress, EvidenceItem, DetectiveNote } from '../types';
import { sound } from '../utils/audio';

interface FinalScoreBreakdown {
  total: number;
  evidenceScore: number;
  puzzleScore: number;
  timelineScore: number;
  connectionScore: number;
  deductionScore: number;
  hintsPenalty: number;
  rankTitle: string;
}

interface GameContextType {
  activeView: 'TITLE' | 'CASE_SELECT' | 'BRIEFING' | 'INVESTIGATION' | 'EVIDENCE_BOARD' | 'CASE_REPORT';
  setActiveView: (view: 'TITLE' | 'CASE_SELECT' | 'BRIEFING' | 'INVESTIGATION' | 'EVIDENCE_BOARD' | 'CASE_REPORT') => void;
  activeModal: 'ARCHIVE' | 'TIMELINE' | 'MATCHING' | 'CIPHER' | 'NOTES' | 'DEDUCTION' | 'HINTS' | 'SETTINGS' | 'EVIDENCE_DETAIL' | null;
  setActiveModal: (modal: 'ARCHIVE' | 'TIMELINE' | 'MATCHING' | 'CIPHER' | 'NOTES' | 'DEDUCTION' | 'HINTS' | 'SETTINGS' | 'EVIDENCE_DETAIL' | null) => void;
  currentCase: HistoricalCase;
  allCases: HistoricalCase[];
  activeSceneIndex: number;
  setActiveSceneIndex: (idx: number) => void;
  progress: PlayerProgress;
  selectedEvidenceForDetail: EvidenceItem | null;
  inspectEvidence: (evidence: EvidenceItem) => void;
  evidenceNotification: EvidenceItem | null;
  dismissEvidenceNotification: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  isAmbientActive: boolean;
  toggleAmbient: () => void;
  
  // Game Actions
  startNewCase: (caseId: string) => void;
  continueSavedCase: () => void;
  hasSavedCase: boolean;
  examineObject: (objectId: string) => void;
  addEvidenceToArchive: (evidenceId: string) => void;
  connectEvidenceOnBoard: (fromId: string, toId: string, relationLabel: string) => { success: boolean; explanation: string };
  removeEvidenceConnection: (fromId: string, toId: string) => void;
  updateTimelineOrder: (newOrder: string[]) => void;
  verifyTimelineOrder: () => { isCorrect: boolean; feedback: string; correctCount: number };
  updateMatchingAnswer: (figureId: string, roleKey: string) => void;
  verifyMatchingPuzzle: () => { isComplete: boolean; correctCount: number; total: number; feedback: string };
  submitCipher: (code: string) => { isCorrect: boolean; feedback: string };
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  requestHint: () => { level: number; hintText: string; canUseMore: boolean };
  submitDeduction: (answerId: string, evidenceIds: string[]) => { score: FinalScoreBreakdown; isSuccess: boolean };
  resetCurrentCase: () => void;
}

const STORAGE_KEY = 'jejak_nusantara_save_v1';

const defaultProgress: PlayerProgress = {
  currentCaseId: 'case-01',
  foundEvidenceIds: [],
  examinedObjectIds: [],
  solvedPuzzleIds: [],
  boardConnections: [],
  timelineOrder: ['tc-03', 'tc-01', 'tc-05', 'tc-02', 'tc-06', 'tc-04'], // shuffled initial order
  matchingAnswers: {},
  cipherSolved: false,
  deductionEvidenceIds: [],
  hintsUsedCount: 0,
  notes: [
    {
      id: 'init-note-1',
      timestamp: '16 Agu 1945 - 06:00',
      title: 'Perintah Awal Investigasi',
      content: 'Cari tahu alasan sebenarnya di balik keberadaan Soekarno dan Hatta di Rengasdengklok. Kumpulkan bukti dari markas pemuda hingga rumah persembunyian.',
      isUserAdded: false,
    }
  ],
  isCompleted: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'TITLE' | 'CASE_SELECT' | 'BRIEFING' | 'INVESTIGATION' | 'EVIDENCE_BOARD' | 'CASE_REPORT'>('TITLE');
  const [activeModal, setActiveModal] = useState<'ARCHIVE' | 'TIMELINE' | 'MATCHING' | 'CIPHER' | 'NOTES' | 'DEDUCTION' | 'HINTS' | 'SETTINGS' | 'EVIDENCE_DETAIL' | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string>('case-01');
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress);
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<EvidenceItem | null>(null);
  const [evidenceNotification, setEvidenceNotification] = useState<EvidenceItem | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAmbientActive, setIsAmbientActive] = useState<boolean>(false);
  const [hasSavedCase, setHasSavedCase] = useState<boolean>(false);

  // Load saved progress on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.currentCaseId) {
          setHasSavedCase(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress on state change
  useEffect(() => {
    try {
      if (progress.foundEvidenceIds.length > 0 || progress.examinedObjectIds.length > 0 || progress.isCompleted) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        setHasSavedCase(true);
      }
    } catch {
      // ignore
    }
  }, [progress]);

  const currentCase = HISTORICAL_CASES.find(c => c.id === currentCaseId) || HISTORICAL_CASES[0];

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const toggleAmbient = () => {
    const next = !isAmbientActive;
    setIsAmbientActive(next);
    sound.toggleAtmosphere(next);
    sound.playClick();
  };

  const inspectEvidence = (evidence: EvidenceItem) => {
    sound.playPaper();
    setSelectedEvidenceForDetail(evidence);
    setActiveModal('EVIDENCE_DETAIL');
  };

  const dismissEvidenceNotification = () => {
    setEvidenceNotification(null);
  };

  const startNewCase = (caseId: string) => {
    sound.playPaper();
    setCurrentCaseId(caseId);
    // Shuffle timeline cards initially
    const caseObj = HISTORICAL_CASES.find(c => c.id === caseId) || HISTORICAL_CASES[0];
    const shuffledCards = [...caseObj.timelineCards].sort(() => Math.random() - 0.5).map(c => c.id);

    const freshProgress: PlayerProgress = {
      ...defaultProgress,
      currentCaseId: caseId,
      timelineOrder: shuffledCards.length > 0 ? shuffledCards : defaultProgress.timelineOrder,
      notes: [
        {
          id: 'note-' + Date.now(),
          timestamp: '16 Agu 1945 - Catatan Kasus',
          title: `Penyelidikan ${caseObj.title}`,
          content: `Tujuan: ${caseObj.mainQuestion}`,
          isUserAdded: false
        }
      ]
    };
    setProgress(freshProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshProgress));
    setHasSavedCase(true);
    setActiveSceneIndex(0);
    setActiveView('BRIEFING');
  };

  const continueSavedCase = () => {
    sound.playPaper();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
        setCurrentCaseId(parsed.currentCaseId || 'case-01');
        if (parsed.isCompleted) {
          setActiveView('CASE_REPORT');
        } else {
          setActiveView('INVESTIGATION');
        }
        return;
      }
    } catch {
      // fallback
    }
    startNewCase('case-01');
  };

  const examineObject = (objectId: string) => {
    sound.playClick();
    setProgress(prev => {
      const examined = prev.examinedObjectIds.includes(objectId)
        ? prev.examinedObjectIds
        : [...prev.examinedObjectIds, objectId];
      return { ...prev, examinedObjectIds: examined };
    });

    // Check if this object gives evidence
    const scene = currentCase.scenes[activeSceneIndex];
    const obj = scene?.objects.find(o => o.id === objectId);
    if (obj?.givesEvidenceId) {
      addEvidenceToArchive(obj.givesEvidenceId);
    }
    if (obj?.triggersPuzzleId === 'cipher-rengasdengklok') {
      setActiveModal('CIPHER');
    }
  };

  const addEvidenceToArchive = (evidenceId: string) => {
    const evItem = currentCase.evidences.find(e => e.id === evidenceId);
    if (!evItem) return;

    if (!progress.foundEvidenceIds.includes(evidenceId)) {
      sound.playClueFound();
      sound.playStamp();
      setEvidenceNotification(evItem);

      setProgress(prev => ({
        ...prev,
        foundEvidenceIds: [...prev.foundEvidenceIds, evidenceId],
        notes: [
          ...prev.notes,
          {
            id: 'note-ev-' + Date.now(),
            timestamp: 'Bukti Terkumpul',
            title: `Arsip: ${evItem.title}`,
            content: `${evItem.shortDesc} (${evItem.sourceStatus})`,
            isUserAdded: false,
          }
        ]
      }));
    }
  };

  const connectEvidenceOnBoard = (fromId: string, toId: string, relationLabel: string) => {
    sound.playPin();
    // Check if this connection matches a valid connection rule in the case
    const match = currentCase.validConnections.find(
      c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );

    const exists = progress.boardConnections.some(
      c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );

    if (!exists) {
      setProgress(prev => ({
        ...prev,
        boardConnections: [...prev.boardConnections, { fromId, toId, relationLabel }]
      }));
    }

    if (match) {
      sound.playSuccess();
      return {
        success: true,
        explanation: match.explanation
      };
    } else {
      return {
        success: false,
        explanation: 'Kedua bukti belum menunjukkan korelasi kausal langsung yang kuat menurut data arsip. Coba telaah kembali alur peristiwa dan motif tokoh.'
      };
    }
  };

  const removeEvidenceConnection = (fromId: string, toId: string) => {
    sound.playClick();
    setProgress(prev => ({
      ...prev,
      boardConnections: prev.boardConnections.filter(
        c => !( (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId) )
      )
    }));
  };

  const updateTimelineOrder = (newOrder: string[]) => {
    setProgress(prev => ({ ...prev, timelineOrder: newOrder }));
  };

  const verifyTimelineOrder = () => {
    const currentOrder = progress.timelineOrder;
    const cards = currentCase.timelineCards;
    let correctCount = 0;

    cards.forEach(card => {
      const actualIdx = currentOrder.indexOf(card.id);
      if (actualIdx === card.correctOrder - 1) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === cards.length;
    if (isCorrect) {
      sound.playSuccess();
      setProgress(prev => {
        const solved = prev.solvedPuzzleIds.includes('timeline-puzzle')
          ? prev.solvedPuzzleIds
          : [...prev.solvedPuzzleIds, 'timeline-puzzle'];
        return { ...prev, solvedPuzzleIds: solved };
      });
      return {
        isCorrect: true,
        feedback: 'Kronologi Sempurna! Anda berhasil menyusun kembali rangkaian peristiwa dari siaran kekalahan Jepang hingga penyusunan naskah di rumah Maeda secara tepat waktu.',
        correctCount
      };
    } else {
      sound.playClick();
      return {
        isCorrect: false,
        feedback: `${correctCount} dari ${cards.length} kartu berada di posisi urutan yang tepat. Perhatikan tanggal dan jam yang tertera pada dokumen untuk menentukan peristiwa yang terjadi lebih dahulu.`,
        correctCount
      };
    }
  };

  const updateMatchingAnswer = (figureId: string, roleKey: string) => {
    sound.playClick();
    setProgress(prev => ({
      ...prev,
      matchingAnswers: {
        ...prev.matchingAnswers,
        [figureId]: roleKey
      }
    }));
  };

  const verifyMatchingPuzzle = () => {
    const pairs = currentCase.matchingPairs;
    let correctCount = 0;
    pairs.forEach(pair => {
      if (progress.matchingAnswers[pair.id] === pair.correctRoleKey) {
        correctCount++;
      }
    });

    const isComplete = correctCount === pairs.length;
    if (isComplete) {
      sound.playSuccess();
      setProgress(prev => {
        const solved = prev.solvedPuzzleIds.includes('matching-puzzle')
          ? prev.solvedPuzzleIds
          : [...prev.solvedPuzzleIds, 'matching-puzzle'];
        return { ...prev, solvedPuzzleIds: solved };
      });
      return {
        isComplete: true,
        correctCount,
        total: pairs.length,
        feedback: 'Analisis Profil Tuntas! Semua tokoh telah dipasangkan dengan tepat sesuai peran historis mereka dalam peristiwa Rengasdengklok.'
      };
    } else {
      sound.playClick();
      return {
        isComplete: false,
        correctCount,
        total: pairs.length,
        feedback: `${correctCount} dari ${pairs.length} tokoh terpasang dengan benar. Periksa kembali siapa yang bertindak sebagai pemuda penuntut, tokoh senior, komandan militer lapangan, dan pemilik rumah penampung.`
      };
    }
  };

  const submitCipher = (code: string) => {
    if (!currentCase.cipherPuzzle) {
      return { isCorrect: false, feedback: 'Tidak ada teka-teki sandi pada berkas ini.' };
    }
    const clean = code.trim();
    if (clean === currentCase.cipherPuzzle.correctCode) {
      sound.playSuccess();
      setProgress(prev => {
        const solved = prev.solvedPuzzleIds.includes(currentCase.cipherPuzzle!.id)
          ? prev.solvedPuzzleIds
          : [...prev.solvedPuzzleIds, currentCase.cipherPuzzle!.id];
        return {
          ...prev,
          cipherSolved: true,
          solvedPuzzleIds: solved
        };
      });
      // Also reward with a key evidence if not already found
      addEvidenceToArchive('ev-06');
      return {
        isCorrect: true,
        feedback: `KODE TERVERIFIKASI: ${clean}! Peti komando terbuka. Anda menemukan catatan rahasia Shodanco Singgih di Rengasdengklok.`
      };
    } else {
      sound.playClick();
      return {
        isCorrect: false,
        feedback: 'Kombinasi sandi salah. Gembok tetap terkunci. Baca kembali petunjuk format tanggal dan bulan kedatangan di Rengasdengklok.'
      };
    }
  };

  const addNote = (title: string, content: string) => {
    sound.playTypewriter();
    const newNote: DetectiveNote = {
      id: 'usr-note-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      title: title || 'Catatan Detektif',
      content,
      isUserAdded: true,
    };
    setProgress(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
  };

  const deleteNote = (id: string) => {
    sound.playClick();
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const requestHint = () => {
    sound.playPaper();
    const currentCount = progress.hintsUsedCount;
    let text = '';
    let level = 1;

    if (currentCount === 0) {
      level = 1;
      text = 'Petunjuk Tingkat 1 (Arahan Umum): Periksa semua objek di ketiga ruangan. Jangan lewatkan radio penerima gelombang pendek di markas pemuda dan peta militer di Rengasdengklok.';
    } else if (currentCount === 1) {
      level = 2;
      text = 'Petunjuk Tingkat 2 (Bukti Kunci): Anda memerlukan minimal 5 bukti arsip. Perhatikan dokumen PPKI (ev-02), kesaksian Bung Karno (ev-04), dan kawat jaminan Achmad Soebardjo (ev-07) untuk memahami mengapa proklamasi dipercepat.';
    } else {
      level = 3;
      text = 'Petunjuk Tingkat 3 (Langkah Penyelesaian): Sandi peti PETA adalah 1608 (16 Agustus). Di Evidence Board, hubungkan Berita Kekalahan Jepang -> Risalah Pemuda Menteng 31 -> Pengamanan Rengasdengklok. Selesaikan Timeline dari kartu tahun 14-15 Agustus hingga kembali ke rumah Maeda.';
    }

    setProgress(prev => ({
      ...prev,
      hintsUsedCount: prev.hintsUsedCount + 1
    }));

    return {
      level,
      hintText: text,
      canUseMore: currentCount < 2
    };
  };

  const submitDeduction = (answerId: string, evidenceIds: string[]) => {
    sound.playStamp();
    const opt = currentCase.deductionOptions.find(o => o.id === answerId);
    const isCorrectChoice = !!opt?.isCorrect;

    // Calculate score breakdown
    const totalEvidenceCount = currentCase.evidences.length;
    const foundEvidenceCount = progress.foundEvidenceIds.length;
    const evidenceScore = Math.round((foundEvidenceCount / totalEvidenceCount) * 25);

    const puzzleScore = (progress.cipherSolved ? 10 : 0) +
      (progress.solvedPuzzleIds.includes('matching-puzzle') ? 10 : 0);

    const timelineScore = progress.solvedPuzzleIds.includes('timeline-puzzle') ? 15 : 5;

    // Check board connections: count how many valid connections made
    const validCount = progress.boardConnections.filter(c =>
      currentCase.validConnections.some(vc =>
        (vc.fromId === c.fromId && vc.toId === c.toId) || (vc.fromId === c.toId && vc.toId === c.fromId)
      )
    ).length;
    const connectionScore = Math.min(15, validCount * 3);

    // Deduction score: 25 for right answer + 5 bonus for supporting evidence
    let deductionScore = isCorrectChoice ? 25 : 5;
    // Check if player selected good evidence
    const keyEvidenceCount = evidenceIds.filter(id => currentCase.requiredEvidenceForDeduction.includes(id)).length;
    if (isCorrectChoice && keyEvidenceCount >= 3) {
      deductionScore += 5;
    }

    // Penalty for hints: 2 pts each
    const hintsPenalty = progress.hintsUsedCount * 2;

    const rawTotal = evidenceScore + puzzleScore + timelineScore + connectionScore + deductionScore - hintsPenalty;
    const total = Math.max(10, Math.min(100, rawTotal));

    let rankTitle = 'Penyelidik Sejarah Pratama';
    if (total >= 90) rankTitle = 'Detektif Sejarah Ulung (Master Historian)';
    else if (total >= 75) rankTitle = 'Penyelidik Utama Arsip Nasional';
    else if (total >= 60) rankTitle = 'Penyelidik Madya Sejarah';

    const scoreResult: FinalScoreBreakdown = {
      total,
      evidenceScore,
      puzzleScore,
      timelineScore,
      connectionScore,
      deductionScore,
      hintsPenalty,
      rankTitle,
    };

    setProgress(prev => ({
      ...prev,
      deductionAnswerId: answerId,
      deductionEvidenceIds: evidenceIds,
      isCompleted: true,
      finalScore: scoreResult
    }));

    if (isCorrectChoice) {
      sound.playSuccess();
    }

    return {
      score: scoreResult,
      isSuccess: isCorrectChoice
    };
  };

  const resetCurrentCase = () => {
    sound.playClick();
    localStorage.removeItem(STORAGE_KEY);
    startNewCase(currentCaseId);
  };

  return (
    <GameContext.Provider
      value={{
        activeView,
        setActiveView,
        activeModal,
        setActiveModal,
        currentCase,
        allCases: HISTORICAL_CASES,
        activeSceneIndex,
        setActiveSceneIndex,
        progress,
        selectedEvidenceForDetail,
        inspectEvidence,
        evidenceNotification,
        dismissEvidenceNotification,
        isMuted,
        toggleMute,
        isAmbientActive,
        toggleAmbient,
        startNewCase,
        continueSavedCase,
        hasSavedCase,
        examineObject,
        addEvidenceToArchive,
        connectEvidenceOnBoard,
        removeEvidenceConnection,
        updateTimelineOrder,
        verifyTimelineOrder,
        updateMatchingAnswer,
        verifyMatchingPuzzle,
        submitCipher,
        addNote,
        deleteNote,
        requestHint,
        submitDeduction,
        resetCurrentCase
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
