import React from 'react';
import { Quest, CollectibleItem } from '../../types';
import { 
  Compass, 
  BookOpen, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award,
  Radio,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface HUDOverlayProps {
  activeQuest: Quest | null;
  collectiblesFoundCount: number;
  totalCollectiblesCount: number;
  xp: number;
  level: number;
  nearbyPrompt: string | null;
  onInteract: () => void;
  onOpenJournal: () => void;
  onOpenSettings: () => void;
  onOpenWorldSelect: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  activeQuest,
  collectiblesFoundCount,
  totalCollectiblesCount,
  xp,
  level,
  nearbyPrompt,
  onInteract,
  onOpenJournal,
  onOpenSettings,
  onOpenWorldSelect,
  isMuted,
  onToggleMute
}) => {
  const currentStep = activeQuest?.steps[activeQuest.currentStepIndex];

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 z-20">
      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: Active Quest Tracker HUD */}
        <div className="pointer-events-auto bg-[#1b1510]/85 backdrop-blur-md border-2 border-amber-600/70 rounded-2xl p-4 shadow-xl max-w-sm sm:max-w-md text-parchment-100">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Misi Aktif • {activeQuest ? activeQuest.title : 'Eksplorasi Desa'}</span>
          </div>

          <h3 className="font-serif font-black text-xs sm:text-sm text-parchment-100 leading-snug">
            {currentStep ? currentStep.description : 'Jelajahi desa Rengasdengklok dan temui para tokoh sejarah.'}
          </h3>

          {activeQuest && (
            <div className="mt-2.5 pt-2 border-t border-parchment-800/60 flex items-center justify-between text-[10px] font-mono text-parchment-400">
              <span className="text-amber-300">
                Langkah {activeQuest.currentStepIndex + 1} dari {activeQuest.steps.length}
              </span>
              <span className="text-emerald-400 font-bold">
                +{activeQuest.rewardXP} XP
              </span>
            </div>
          )}
        </div>

        {/* Center: Chronicle Compass Miniature Indicator */}
        <div className="hidden lg:flex pointer-events-auto items-center space-x-2 px-4 py-2 rounded-full bg-[#1b1510]/80 backdrop-blur-md border border-amber-500/50 shadow-lg text-amber-300 font-mono text-xs">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="font-serif font-bold text-parchment-100">Rengasdengklok 1945</span>
          <span className="text-amber-500">•</span>
          <span>Desa Bojong</span>
        </div>

        {/* Right: Player Stats & Action Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* XP & Level Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1b1510]/85 backdrop-blur-md border border-amber-600/60 shadow-lg text-xs font-mono text-parchment-200">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center text-xs">
              {level}
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Tingkat {level}</span>
              <span className="text-emerald-400 font-bold">{xp} XP</span>
            </div>
          </div>

          {/* Collectibles Counter Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournal();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1b1510]/85 hover:bg-amber-950/80 border border-amber-600/60 shadow-lg text-xs font-mono text-amber-300 transition"
            title="Buka Jurnal Petualang (Tab)"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{collectiblesFoundCount}/{totalCollectiblesCount}</span>
          </button>

          {/* Journal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournal();
            }}
            className="p-2.5 rounded-xl bg-[#1b1510]/85 hover:bg-[#281f18] border border-parchment-800 text-amber-300 transition shadow-lg"
            title="Buku Saku Chronicle Compass"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* World Map Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWorldSelect();
            }}
            className="p-2.5 rounded-xl bg-[#1b1510]/85 hover:bg-[#281f18] border border-parchment-800 text-amber-300 transition shadow-lg"
            title="Pilih Periode Dunia Sejarah"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-[#1b1510]/85 hover:bg-[#281f18] border border-parchment-800 text-parchment-400 hover:text-white transition shadow-lg"
            title={isMuted ? "Bunyikan Suara" : "Bisukan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause / Settings */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2.5 rounded-xl bg-[#1b1510]/85 hover:bg-[#281f18] border border-parchment-800 text-parchment-400 hover:text-white transition shadow-lg"
            title="Pengaturan Permainan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Screen: Floating Interaction Prompt when player is near a target */}
      {nearbyPrompt && (
        <div className="self-center pointer-events-auto animate-bounce mb-8">
          <button
            onClick={() => {
              sound.playClick();
              onInteract();
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-black text-sm tracking-wider shadow-2xl flex items-center space-x-3 border-2 border-white/60 transform hover:scale-105 transition active:scale-95"
          >
            <span className="w-7 h-7 rounded-full bg-black text-amber-300 flex items-center justify-center text-xs font-black">
              E
            </span>
            <span>{nearbyPrompt}</span>
          </button>
        </div>
      )}

      {/* Bottom Hint on Desktop */}
      <div className="hidden sm:flex items-center justify-between text-[11px] font-mono text-parchment-400/80 bg-black/40 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/10 w-fit mx-auto">
        <span>Kontrol: <strong>WASD / Panah</strong> Gerak • <strong>Mouse</strong> Kamera • <strong>Spasi</strong> Lompat • <strong>Shift</strong> Lari • <strong>[E]</strong> Interaksi</span>
      </div>
    </div>
  );
};
