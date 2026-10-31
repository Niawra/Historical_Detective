export type SourceStatus = 'SUMBER SEJARAH RESMI' | 'REKONSTRUKSI UNTUK GAME' | 'CATATAN INVESTIGASI';

export type EvidenceCategory = 'DOKUMEN' | 'FOTO SEJARAH' | 'PETA' | 'KORAN & TELEGRAM' | 'PROFIL TOKOH' | 'KESAKSIAN';

export interface EvidenceItem {
  id: string;
  title: string;
  category: EvidenceCategory;
  shortDesc: string;
  fullDesc: string;
  sourceStatus: SourceStatus;
  sourceReference: string;
  dateOrEra: string;
  location: string;
  relatedEntities: string[];
  imageUrl?: string;
  isKeyClue?: boolean;
  unlockedAt?: number;
  highlightDetails?: string[];
}

export interface InteractiveObject {
  id: string;
  name: string;
  area: string;
  x: number; // percentage coordinates 0 - 100
  y: number;
  iconType: 'document' | 'magnifier' | 'safe' | 'photo' | 'map' | 'person' | 'radio';
  description: string;
  detailedInspection: string;
  givesEvidenceId?: string;
  triggersPuzzleId?: string;
  requiredEvidenceId?: string; // locked until player finds another evidence
  isExamined: boolean;
}

export interface InvestigationScene {
  id: string;
  title: string;
  subtitle: string;
  backdropTheme: string;
  description: string;
  objects: InteractiveObject[];
}

export interface BoardNode {
  id: string;
  evidenceId: string;
  x: number; // position on cork board (px or %)
  y: number;
}

export interface BoardConnection {
  id: string;
  fromEvidenceId: string;
  toEvidenceId: string;
  relationLabel: string;
  isValid: boolean;
  explanation: string;
}

export interface TimelineCard {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  evidenceHint: string;
  correctOrder: number;
}

export interface MatchingPair {
  id: string;
  figureName: string;
  roleDescription: string;
  correctRoleKey: string;
  context: string;
}

export interface CipherPuzzle {
  id: string;
  title: string;
  scenario: string;
  clueReference: string;
  codeLength: number;
  correctCode: string;
  explanation: string;
  hint1: string;
  hint2: string;
}

export interface DeductionOption {
  id: string;
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

export interface HistoricalCase {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  year: number;
  difficulty: 'Mudah' | 'Menengah' | 'Tantangan Tinggi';
  summary: string;
  learningGoals: string[];
  mainQuestion: string;
  briefing: {
    coordinatorName: string;
    coordinatorRole: string;
    coordinatorMessage: string[];
    historicalContext: string;
    caseFileNumber: string;
  };
  scenes: InvestigationScene[];
  evidences: EvidenceItem[];
  validConnections: {
    fromId: string;
    toId: string;
    relationLabel: string;
    explanation: string;
  }[];
  timelineCards: TimelineCard[];
  matchingPairs: MatchingPair[];
  cipherPuzzle?: CipherPuzzle;
  deductionQuestion: string;
  deductionOptions: DeductionOption[];
  requiredEvidenceForDeduction: string[];
  historicalDebrief: {
    title: string;
    whatActuallyHappened: string[];
    whyItMatters: string;
    historicalDebates: string;
    sources: { title: string; authorOrInstitution: string; year: string }[];
  };
  isLocked: boolean;
}

export interface DetectiveNote {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  isUserAdded?: boolean;
}

export interface PlayerProgress {
  currentCaseId: string;
  foundEvidenceIds: string[];
  examinedObjectIds: string[];
  solvedPuzzleIds: string[];
  boardConnections: { fromId: string; toId: string; relationLabel: string }[];
  timelineOrder: string[]; // card ids in order
  matchingAnswers: Record<string, string>; // figureId -> roleKey
  cipherSolved: boolean;
  deductionAnswerId?: string;
  deductionEvidenceIds: string[];
  hintsUsedCount: number;
  notes: DetectiveNote[];
  isCompleted: boolean;
  finalScore?: {
    total: number;
    evidenceScore: number;
    puzzleScore: number;
    timelineScore: number;
    connectionScore: number;
    deductionScore: number;
    hintsPenalty: number;
    rankTitle: string;
  };
}
