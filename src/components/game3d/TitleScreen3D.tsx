import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { 
  Compass, 
  Play, 
  MapPin, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award,
  X,
  Keyboard
} from 'lucide-react';

interface TitleScreen3DProps {
  onStartGame: () => void;
  onOpenWorldSelect: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen3D: React.FC<TitleScreen3DProps> = ({
  onStartGame,
  onOpenWorldSelect,
  isMuted,
  onToggleMute
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#0d0b09] text-parchment-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Dynamic 3D ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(78,54,34,0.6)_0%,_rgba(13,11,9,0.95)_70%)] pointer-events-none" />

      {/* Decorative Rotating Compass Watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-amber-600/10 pointer-events-none flex items-center justify-center">
        <div className="w-[480px] h-[480px] rounded-full border border-dashed border-amber-500/15 animate-spin" style={{ animationDuration: '90s' }} />
        <div className="w-[320px] h-[320px] rounded-full border border-amber-500/20" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-md">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold block">
              CHRONICLE COMPASS
            </span>
            <span className="text-[10px] text-parchment-400 font-mono">
              Petualangan Sejarah Nusantara
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-[#1b1510] border border-parchment-800 text-parchment-400 hover:text-white transition shadow-md"
            title={isMuted ? "Bunyikan Suara" : "Bisukan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowGuide(true);
            }}
            className="p-2.5 rounded-xl bg-[#1b1510] border border-parchment-800 text-amber-400 hover:text-white transition shadow-md"
            title="Panduan Kontrol Petualang"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Center Title */}
      <main className="relative z-10 w-full max-w-3xl mx-auto text-center my-auto py-8">
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Stylized Historical Adventure</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-wider text-parchment-100 drop-shadow-2xl">
          JEJAK NUSANTARA
        </h1>

        {/* Tagline */}
        <p className="mt-3 font-serif italic text-base sm:text-lg text-amber-200/90 tracking-wide max-w-xl mx-auto">
          “Don't make history feel like homework. Make history feel like an adventure.”
        </p>

        <p className="mt-4 text-xs sm:text-sm text-parchment-300 max-w-md mx-auto leading-relaxed">
          Pegang Kompas Hikayat, jelajahi desa Rengasdengklok 1945 dalam dunia 3D yang hidup, temukan artefak tersembunyi, dan temui para pendiri bangsa!
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={() => {
              sound.playCompassChime();
              onStartGame();
            }}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-black text-sm tracking-wider shadow-2xl transition-all transform hover:-translate-y-1 border border-white/40 flex items-center justify-center space-x-2.5 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI PETUALANGAN 3D</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenWorldSelect();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1d1712] hover:bg-[#28211a] text-parchment-200 border border-amber-600/50 font-mono text-sm tracking-wider transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>PILIH DUNIA SEJARAH</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-parchment-500 pt-4 border-t border-parchment-800/40">
        <div>
          <span>Dunia 01: <strong>Rengasdengklok 1945</strong> • Third-Person 3D WebGL</span>
        </div>
        <div className="mt-2 sm:mt-0">
          <span>Jejak Nusantara 3D • Historical Adventure</span>
        </div>
      </footer>

      {/* Tutorial / Controls Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-[#1b1510] border-2 border-amber-500 rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-200">
            <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <Keyboard className="w-5 h-5" />
                <h3 className="font-serif font-black text-lg text-parchment-100">
                  Panduan Kontrol Petualang 3D
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-serif text-xs sm:text-sm text-parchment-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#231b14] border border-parchment-800">
                <strong className="text-amber-400 font-mono text-xs block mb-1">Eksplorasi Karakter:</strong>
                Gunakan tombol <strong>W, A, S, D</strong> atau tombol panah untuk menggerakkan petualang. Tekan <strong>Shift</strong> untuk berlari dan <strong>Spasi</strong> untuk melompat.
              </div>

              <div className="p-3 rounded-xl bg-[#231b14] border border-parchment-800">
                <strong className="text-amber-400 font-mono text-xs block mb-1">Kamera Third-Person:</strong>
                Tahan dan geser klik <strong>Mouse</strong> (atau usap layar di smartphone) untuk memutar sudut pandang kamera 360 derajat. Gunakan scroll mouse untuk zoom.
              </div>

              <div className="p-3 rounded-xl bg-[#231b14] border border-parchment-800">
                <strong className="text-amber-400 font-mono text-xs block mb-1">Interaksi & Quest:</strong>
                Dekati tokoh sejarah atau benda bersejarah, lalu tekan tombol <strong>[ E ]</strong> untuk berbicara, memeriksa artefak, atau membuka peti sandi.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-parchment-800 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono text-xs font-bold transition shadow-md"
              >
                MENGERTI & SIAP BERPETUALANG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
