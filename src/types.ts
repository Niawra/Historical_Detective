export type GameScreen = 'TITLE' | 'WORLD_SELECT' | 'GAMEPLAY' | 'LEVEL_COMPLETE';

export type HistoricalWorldId = 
  | 'WORLD_01_RENGASDENGKLOK'
  | 'WORLD_02_PROKLAMASI'
  | 'WORLD_03_SURABAYA'
  | 'WORLD_04_BANDUNG'
  | 'WORLD_05_SUMPAH_PEMUDA';

export interface HistoricalWorld {
  id: HistoricalWorldId;
  name: string;
  year: number;
  location: string;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string;
  isUnlocked: boolean;
  completionPercent: number;
  totalCollectibles: number;
  totalQuests: number;
}

export interface CharacterControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  interact: boolean;
}

export type AnimationState = 'IDLE' | 'WALK' | 'RUN' | 'JUMP' | 'INTERACT';

export type QuestStatus = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED';

export interface QuestStep {
  id: string;
  description: string;
  targetEntityId?: string;
  targetLocation?: { x: number; z: number };
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  worldId: HistoricalWorldId;
  title: string;
  npcName: string;
  npcRole: string;
  description: string;
  isMainQuest: boolean;
  status: QuestStatus;
  steps: QuestStep[];
  currentStepIndex: number;
  isCompleted: boolean;
  rewardXP: number;
  historicalContext: string;
}

export interface CollectibleItem {
  id: string;
  worldId: HistoricalWorldId;
  name: string;
  category: 'DOKUMEN' | 'ARTEFAK' | 'FOTO' | 'KOIN' | 'CATATAN';
  description: string;
  historicalFact: string;
  sourceReference: string;
  position: { x: number; y: number; z: number };
  isFound: boolean;
  icon: string;
}

export interface DetectiveBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface NPCEntity {
  id: string;
  name: string;
  role: string;
  position: { x: number; y: number; z: number };
  rotationY: number;
  modelStyle: 'peta' | 'elder' | 'farmer' | 'diplomat' | 'youth' | 'soekarno' | 'hatta';
  dialogueTree: {
    greeting: string[];
    questDialogue?: string[];
    completedDialogue?: string[];
  };
}

export interface MiniGameData {
  type: 'TIMELINE' | 'CIPHER' | 'ROLE_MATCH';
  title: string;
  instructions: string;
  isOpen: boolean;
}
