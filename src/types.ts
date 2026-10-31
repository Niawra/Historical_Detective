export type GameScreen = 'MENU_UTAMA' | 'PILIH_MISI' | 'GAMEPLAY' | 'HASIL_INVESTIGASI';

export type MissionLocationId = 
  | 'LOC_1_BRIEFING'
  | 'LOC_2_RENGASDENGKLOK'
  | 'LOC_3_DOKUMEN'
  | 'LOC_4_TIMELINE'
  | 'LOC_5_DEDUKSI';

export interface DetectiveClue {
  id: string;
  title: string;
  icon: string; // emoji or icon name
  shortSummary: string;
  fullDetail: string;
  sourceStatus: 'SUMBER SEJARAH ASLI' | 'REKONSTRUKSI FAKTA';
  dateFound?: string;
}

export interface PlayerPosition {
  x: number;
  y: number;
  direction: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';
  isMoving: boolean;
}

export interface MapObject {
  id: string;
  name: string;
  x: number; // coordinate in world percentage or grid (0-100)
  y: number;
  width: number;
  height: number;
  type: 'CLUE' | 'NPC' | 'DOOR' | 'CHEST' | 'PROP';
  spriteType: string;
  dialogue?: string[];
  clueReward?: DetectiveClue;
  isExamined: boolean;
  requiredCluesCount?: number; // for doors
  targetLocation?: MissionLocationId;
}

export interface DetectiveBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface MissionData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  year: number;
  isUnlocked: boolean;
  description: string;
  tagline: string;
  coverImageTheme: string;
}

export interface MissionProgress {
  currentLocation: MissionLocationId;
  clues: DetectiveClue[];
  examinedObjectIds: string[];
  roleMatchingSolved: boolean;
  timelineSolved: boolean;
  deductionAnswerId: string | null;
  deductionClueIds: string[];
  badges: DetectiveBadge[];
  xp: number;
  stars: number;
  isCompleted: boolean;
}
