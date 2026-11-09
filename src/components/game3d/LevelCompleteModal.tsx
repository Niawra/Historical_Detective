import React, { useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Star, Compass, RotateCcw, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface LevelCompleteModalProps {
  xp: number;
  stars: number;
  onContinueExplore: () => void;
  onOpenWorldSelect: () => void;
  onReturnToTitle: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  xp,
  stars,
  onContinueExplore,
  onOpenWorldSelect,
  onReturnToTitle
}) => {
  useEffect(() => {
    sound.playQuestComplete();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#1b1510] border-4 border-amber-500 rounded-2xl p-6 sm:p-10 shadow-2xl text-parchment-100 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Banner Title & Stars */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-parchment-800 pb-5 mb-5 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>DUNIA 01 • RENGASDENGKLOK 1945</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-parchment-100">
              Misi Selesai: Before the Independence!
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-parchment-300 mt-1">
              Kamu berhasil menyingkap takdir di balik peristiwa penjemputan para proklamator bangsa.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center space-x-1 text-amber-400 mb-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${i < stars ? 'fill-current text-amber-400' : 'text-parchment-700'}`}
                />
              ))}
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              +{xp} XP DIPEROLEH
            </span>
          </div>
        </div>

        {/* Historical Epilogue Box */}
        <div className="space-y-4 font-serif text-xs sm:text-sm text-parchment-200 leading-relaxed mb-6">
          <div className="p-4 bg-[#251d16] rounded-xl border border-amber-600/50">
            <h4 className="font-mono text-xs font-bold uppercase text-amber-400 flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kesimpulan Sejarah yang Terungkap:</span>
            </h4>
            <p>
              Peristiwa Rengasdengklok pada 16 Agustus 1945 bukanlah penculikan kriminal yang menyakiti para pemimpin, melainkan sebuah <strong>tindakan pengamanan politik (evakuasi preventif)</strong> oleh para pemuda pejuang untuk melepaskan Bung Karno dan Bung Hatta dari pengaruh intimidasi militer Jepang di Jakarta.
            </p>
            <p className="mt-2 text-parchment-300">
              Jaminan taruhan leher dari Mr. Achmad Soebardjo membuahkan kesepakatan bahwa Proklamasi Kemerdekaan Indonesia akan dikumandangkan pada 17 Agustus 1945, yang membuka jalan menuju perumusan teks sakral kemerdekaan di kediaman Laksamana Tadashi Maeda di Meiji Dori, Batavia.
            </p>
          </div>

          {/* Academic References */}
          <div className="p-3 bg-[#130f0c] rounded-xl border border-parchment-800 text-xs font-mono text-parchment-400">
            <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
              Rujukan Sejarah Terverifikasi:
            </span>
            <span>ANRI • Drs. Mohammad Hatta (Memoir 1970) • Mr. Achmad Soebardjo (1978) • Prof. Nugroho Notosusanto (2008) • Prof. M.C. Ricklefs (2008)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-parchment-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onContinueExplore();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-parchment-700 font-mono text-xs text-parchment-300 hover:bg-parchment-800 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>JELAJAHI BEBAS DUNIA 3D</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onReturnToTitle();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#281f18] hover:bg-[#342920] border border-parchment-700 font-mono text-xs text-parchment-200 transition"
            >
              MENU UTAMA
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenWorldSelect();
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs tracking-wider transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>DUNIA BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
