import React from 'react';
import { sound } from '../../utils/audio';
import { Settings, Volume2, VolumeX, Music, RotateCcw, X, Compass, Keyboard } from 'lucide-react';

interface PauseSettingsModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onRestartWorld: () => void;
  onReturnToMenu: () => void;
  onClose: () => void;
}

export const PauseSettingsModal: React.FC<PauseSettingsModalProps> = ({
  isMuted,
  onToggleMute,
  onRestartWorld,
  onReturnToMenu,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#1b1510] border-2 border-amber-600 rounded-2xl p-6 sm:p-7 shadow-2xl text-parchment-100 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-5">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <Settings className="w-5 h-5" />
            <h3 className="font-serif font-black text-lg text-parchment-100">
              Pengaturan Permainan & Jeda
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 font-mono text-xs">
          {/* Audio FX Toggle */}
          <div className="p-3.5 bg-[#231b14] rounded-xl border border-parchment-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-parchment-100 block">Efek Suara 3D & Langkah Kaki</span>
              <span className="text-[10px] text-parchment-400">Langkah rumput, lonceng kompas, dan atmosfer</span>
            </div>
            <button
              onClick={onToggleMute}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                !isMuted 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'bg-black/50 text-parchment-500 border border-parchment-700'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{!isMuted ? 'Aktif' : 'Bisu'}</span>
            </button>
          </div>

          {/* Controls Guide */}
          <div className="p-4 bg-[#231b14] rounded-xl border border-parchment-800 space-y-2 text-xs font-serif text-parchment-300">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block flex items-center space-x-1 mb-1">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Panduan Kontrol PC:</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-parchment-300">
              <div><strong className="text-amber-300">W, A, S, D</strong> : Berjalan</div>
              <div><strong className="text-amber-300">Mouse Drag</strong> : Putar Kamera</div>
              <div><strong className="text-amber-300">Spasi</strong> : Melompat</div>
              <div><strong className="text-amber-300">Shift</strong> : Berlari Cepat</div>
              <div><strong className="text-amber-300">E / Enter</strong> : Interaksi / Bicara</div>
              <div><strong className="text-amber-300">Tab</strong> : Buka Jurnal & Kompas</div>
            </div>
          </div>

          {/* Restart World */}
          <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/40 flex items-center justify-between">
            <div>
              <span className="font-bold text-red-300 block">Ulangi Eksplorasi Dunia 01</span>
              <span className="text-[10px] text-red-400/70">Mulai kembali dari awal desa</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Ulangi eksplorasi dunia ini dari awal?')) {
                  onRestartWorld();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-700 font-bold text-[11px] transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-parchment-800 flex items-center justify-between">
          <button
            onClick={onReturnToMenu}
            className="px-4 py-2 rounded-xl bg-[#281f18] hover:bg-[#342920] border border-parchment-700 font-mono text-xs text-parchment-300 hover:text-white transition"
          >
            Menu Utama
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs tracking-wider transition shadow-md"
          >
            LANJUTKAN PETUALANGAN
          </button>
        </div>
      </div>
    </div>
  );
};
