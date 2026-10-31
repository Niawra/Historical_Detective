import React, { useState } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { 
  Compass, 
  Play, 
  History, 
  FolderLock, 
  Volume2, 
  VolumeX, 
  Radio, 
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { 
    setScreen, 
    startMission1, 
    continueGame, 
    hasSavedGame, 
    isMuted, 
    toggleMute, 
    isAmbientActive, 
    toggleAmbient 
  } = useAdventure();

  const [showTutorial, setShowTutorial] = useState(false);

  const handleStart = () => {
    sound.playClick();
    startMission1();
  };

  const handleOpenMissions = () => {
    sound.playPaper();
    setScreen('PILIH_MISI');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d0b09] text-parchment-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Cinematic ambient background glow and vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,35,25,0.85)_0%,_rgba(13,11,9,0.98)_70%)] pointer-events-none" />
      
      {/* Vintage watermark compass circle */}
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full border border-parchment-700/10 pointer-events-none flex items-center justify-center">
        <div className="w-[340px] h-[340px] rounded-full border border-dashed border-parchment-700/15 animate-spin" style={{ animationDuration: '120s' }} />
      </div>

      {/* Top Bar: Settings & Audio */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#1c1712] border border-amber-600/30 flex items-center justify-center text-amber-500 shadow-md">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-mono text-xs text-parchment-400 tracking-widest uppercase">
            Unit Penyelidikan Sejarah
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleAmbient}
            title={isAmbientActive ? "Matikan Suasana Ruang Vintage" : "Nyalakan Suasana Ruang Vintage"}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-1.5 border transition ${
              isAmbientActive 
                ? 'bg-seal-red/20 border-seal-red text-parchment-200 shadow-sm' 
                : 'bg-[#181410] border-parchment-800 text-parchment-400 hover:text-parchment-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAmbientActive ? 'text-amber-400 animate-spin' : ''}`} />
            <span className="hidden sm:inline">Suasana Vintage</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-[#181410] border border-parchment-800 text-parchment-400 hover:text-parchment-200 transition"
            title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowTutorial(true);
            }}
            className="p-2 rounded-full bg-[#181410] border border-parchment-800 text-parchment-400 hover:text-amber-400 transition"
            title="Cara Bermain"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Centerpiece */}
      <main className="relative z-10 w-full max-w-3xl mx-auto text-center my-auto py-8">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Historical Mystery</span>
        </div>

        {/* Big Game Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-wider text-parchment-100 drop-shadow-lg">
          JEJAK NUSANTARA
        </h1>

        {/* Tagline */}
        <p className="mt-3 font-serif italic text-base sm:text-lg text-parchment-300 tracking-wide max-w-xl mx-auto">
          “Sejarah Menyimpan Misteri. Temukan Kebenarannya.”
        </p>

        <p className="mt-4 text-xs sm:text-sm text-parchment-400 max-w-md mx-auto leading-relaxed">
          Kendalikan detektif di lokasi bersejarah, temukan benda tersembunyi, ajak bicara saksi, dan pecahkan teka-teki nyata kemerdekaan bangsa.
        </p>

        {/* Big Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-red-800 to-seal-red hover:from-red-700 hover:to-red-600 text-white font-mono font-bold text-sm tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5 border border-red-500/40 flex items-center justify-center space-x-2.5"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI PETUALANGAN</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={() => {
                sound.playClick();
                continueGame();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1d1712] hover:bg-[#28211a] text-parchment-200 border border-parchment-700/60 font-mono text-sm tracking-wider transition flex items-center justify-center space-x-2"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>LANJUTKAN</span>
            </button>
          )}

          <button
            onClick={handleOpenMissions}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1d1712] hover:bg-[#28211a] text-parchment-300 hover:text-white border border-parchment-700/60 font-mono text-sm tracking-wider transition flex items-center justify-center space-x-2"
          >
            <FolderLock className="w-4 h-4 text-amber-400" />
            <span>PILIH MISI</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-parchment-500 pt-4 border-t border-parchment-800/40">
        <div>
          <span>Kontrol: <strong>WASD / Tombol Panah</strong> untuk berjalan • <strong>[E]</strong> untuk memeriksa objek</span>
        </div>
        <div className="mt-2 sm:mt-0">
          <span>Jejak Nusantara • Historical Detective Mystery</span>
        </div>
      </footer>

      {/* How to Play Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#181410] border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-200">
            <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-parchment-100">
                  Cara Bermain Detektif Sejarah
                </h3>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-1 rounded hover:bg-parchment-800 text-parchment-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm font-serif text-parchment-300 leading-relaxed">
              <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-[#221c16] border border-parchment-800">
                <div className="w-7 h-7 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <strong className="text-parchment-100 block font-mono text-xs uppercase mb-0.5">Jelajahi Lokasi:</strong>
                  Gunakan tombol <strong>W, A, S, D</strong> atau tombol panah keyboard (atau Joystick di smartphone) untuk menggerakkan detektif di dalam peta 2D.
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-[#221c16] border border-parchment-800">
                <div className="w-7 h-7 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <strong className="text-parchment-100 block font-mono text-xs uppercase mb-0.5">Periksa Objek & Bicara:</strong>
                  Dekati objek yang mencurigakan atau karakter, lalu tekan tombol <strong>[E]</strong> atau tombol Interaksi di layar untuk memeriksa dan mengumpulkan petunjuk.
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-[#221c16] border border-parchment-800">
                <div className="w-7 h-7 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <strong className="text-parchment-100 block font-mono text-xs uppercase mb-0.5">Pecahkan Misteri & Deduksi:</strong>
                  Selesaikan mini game singkat (susun peristiwa, cocokkan tokoh), buka buku catatan, dan buat kesimpulan akhir untuk mengungkap sejarah!
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-parchment-800 flex justify-end">
              <button
                onClick={() => setShowTutorial(false)}
                className="px-5 py-2 rounded-lg bg-seal-red text-white font-mono text-xs font-bold hover:bg-red-600 transition"
              >
                MENGERTI & MULAI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
