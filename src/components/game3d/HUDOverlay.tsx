import React, { useState, useEffect } from 'react';
import { Quest } from '../../types';
import { 
  Compass, 
  BookOpen, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle,
  X
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
  const [showControlsHint, setShowControlsHint] = useState<boolean>(true);
  const currentStep = activeQuest?.steps[activeQuest.currentStepIndex];

  // Auto-dismiss control guide after 12 seconds to keep screen clean
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControlsHint(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* Left: Minimalist Mission Tracker Panel */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg max-w-xs sm:max-w-sm text-white transition-all">
          <div className="flex items-center space-x-2 text-amber-400 text-[10px] font-mono uppercase font-semibold tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>Misi Aktif</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 font-normal truncate">
              {activeQuest ? activeQuest.title : 'Eksplorasi Desa'}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] font-medium text-white/95 leading-snug">
            {currentStep ? currentStep.description : 'Jelajahi desa Rengasdengklok dan temui para tokoh sejarah.'}
          </p>

          {activeQuest && (
            <div className="mt-2 flex items-center justify-between text-[10px] text-white/50 pt-1.5 border-t border-white/10 font-mono">
              <span>Langkah {activeQuest.currentStepIndex + 1} / {activeQuest.steps.length}</span>
              <span className="text-emerald-400 font-semibold">+{activeQuest.rewardXP} XP</span>
            </div>
          )}
        </div>

        {/* Right: Streamlined Player Stats & Quick Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Level & XP Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-md text-xs font-mono">
            <div className="w-5 h-5 rounded-md bg-amber-500 text-black font-black flex items-center justify-center text-[10px]">
              {level}
            </div>
            <div className="hidden sm:block">
              <span className="text-emerald-400 font-bold">{xp} XP</span>
            </div>
          </div>

          {/* Collectible Badge */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition shadow-md text-xs font-mono"
            title="Buka Jurnal Petualang (Tab)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{collectiblesFoundCount}/{totalCollectiblesCount}</span>
          </button>

          {/* Journal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournal();
            }}
            className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition shadow-md"
            title="Jurnal Catatan (Tab)"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* World Selection Map */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWorldSelect();
            }}
            className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition shadow-md"
            title="Pilih Dunia Sejarah"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition shadow-md"
            title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause & Settings */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition shadow-md"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Bottom: Minimalist Interaction Prompt */}
      <div className="self-center pointer-events-auto mb-6 transition-all duration-300">
        {nearbyPrompt && (
          <button
            onClick={() => {
              sound.playClick();
              onInteract();
            }}
            className="px-4 py-2 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md text-white border border-amber-400/50 shadow-2xl flex items-center gap-2.5 text-xs font-sans tracking-wide transition-all transform hover:scale-105 active:scale-95 animate-fade-in"
          >
            <span className="w-5 h-5 rounded-md bg-amber-400 text-black font-mono font-black flex items-center justify-center text-[10px] shadow-sm">
              E
            </span>
            <span className="font-medium text-white/95">{nearbyPrompt}</span>
          </button>
        )}
      </div>

      {/* Bottom Center: Minimalist Control Guide (Collapsible) */}
      <div className="self-center pointer-events-auto">
        {showControlsHint ? (
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/70 bg-black/50 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-sm transition">
            <span><strong>WASD</strong> Gerak</span>
            <span className="text-white/20">•</span>
            <span><strong>Mouse</strong> Kamera</span>
            <span className="text-white/20">•</span>
            <span><strong>Spasi</strong> Lompat</span>
            <span className="text-white/20">•</span>
            <span><strong>Shift</strong> Lari</span>
            <span className="text-white/20">•</span>
            <span><strong>[E]</strong> Interaksi</span>
            <button
              onClick={() => setShowControlsHint(false)}
              className="text-white/40 hover:text-white ml-1 p-0.5"
              title="Tutup Petunjuk"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowControlsHint(true)}
            className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-white/50 hover:text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/5 transition"
            title="Buka Petunjuk Kontrol"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Kontrol</span>
          </button>
        )}
      </div>
    </div>
  );
};
