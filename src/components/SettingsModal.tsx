import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  Settings, 
  X, 
  Volume2, 
  VolumeX, 
  Radio, 
  RotateCcw, 
  ShieldCheck, 
  Heart,
  Compass
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    isMuted, 
    toggleMute, 
    isAmbientActive, 
    toggleAmbient, 
    resetCurrentCase, 
    setActiveModal 
  } = useGame();

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh progres penyelidikan yang tersimpan?')) {
      resetCurrentCase();
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-detective-900 text-parchment-100 rounded-lg shadow-dossier border-2 border-parchment-700 p-6 flex flex-col justify-between">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-5">
          <div className="flex items-center space-x-2 text-seal-gold">
            <Settings className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-parchment-100">
              Pengaturan Investigasi
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="p-1 rounded hover:bg-detective-800 text-parchment-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings options */}
        <div className="space-y-4 font-mono text-xs">
          {/* Sound FX Toggle */}
          <div className="p-3 bg-detective-950 rounded border border-parchment-800 flex items-center justify-between">
            <div>
              <span className="text-parchment-200 font-bold block">Efek Suara Forensik</span>
              <span className="text-[11px] text-parchment-500">Ketik mesin, stempel berkas, dan gembok sandi</span>
            </div>
            <button
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded font-bold transition flex items-center space-x-1.5 ${
                !isMuted 
                  ? 'bg-seal-red text-white' 
                  : 'bg-detective-800 text-parchment-400 border border-parchment-700'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{!isMuted ? 'Aktif' : 'Mati'}</span>
            </button>
          </div>

          {/* Atmospheric Audio Toggle */}
          <div className="p-3 bg-detective-950 rounded border border-parchment-800 flex items-center justify-between">
            <div>
              <span className="text-parchment-200 font-bold block">Suasana Ruang Arsip Vintage</span>
              <span className="text-[11px] text-parchment-500">Derau piringan hitam lembut & hening misterius</span>
            </div>
            <button
              onClick={toggleAmbient}
              className={`px-3 py-1.5 rounded font-bold transition flex items-center space-x-1.5 ${
                isAmbientActive 
                  ? 'bg-seal-gold text-detective-950 font-bold' 
                  : 'bg-detective-800 text-parchment-400 border border-parchment-700'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{isAmbientActive ? 'Aktif' : 'Mati'}</span>
            </button>
          </div>

          {/* Reset Save Data */}
          <div className="p-3 bg-red-950/30 rounded border border-red-900/40 flex items-center justify-between">
            <div>
              <span className="text-red-300 font-bold block">Atur Ulang Progres Kasus</span>
              <span className="text-[11px] text-red-400/80">Hapus arsip bukti dan mulai dari awal</span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 font-bold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Credits */}
          <div className="p-4 bg-detective-850 rounded border border-parchment-800/60 font-serif text-xs text-parchment-400 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-seal-gold block flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Jejak Nusantara v2.0</span>
            </span>
            <p>
              Dikembangkan sebagai game edukasi sejarah interaktif berbasis riset fakta. Menghargai dedikasi para pendiri bangsa yang memperjuangkan kemerdekaan Indonesia.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-parchment-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="px-4 py-2 rounded bg-detective-800 hover:bg-detective-700 text-parchment-200 font-mono text-xs font-bold"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
