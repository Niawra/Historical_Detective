import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  FolderLock, 
  Compass, 
  BookOpen, 
  FileCheck, 
  Calendar, 
  Star,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const CaseReportModal: React.FC = () => {
  const { currentCase, progress, resetCurrentCase, setActiveView } = useGame();

  const finalScore = progress.finalScore || {
    total: 85,
    evidenceScore: 25,
    puzzleScore: 20,
    timelineScore: 15,
    connectionScore: 12,
    deductionScore: 25,
    hintsPenalty: 0,
    rankTitle: 'Penyelidik Utama Arsip Nasional'
  };

  const debrief = currentCase.historicalDebrief;

  // Trigger celebration on mount if solved well
  useEffect(() => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-detective-950 text-parchment-100 p-4 sm:p-8 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-parchment-800/60 pb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-seal-gold" />
          <span className="font-mono text-xs text-parchment-300 uppercase tracking-widest">
            Laporan Resmi Hasil Penyelidikan • Arsip Jejak Nusantara
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded">
            STATUS: KASUS TERPECAHKAN ✓
          </span>
        </div>
      </div>

      {/* Main Dossier Container */}
      <div className="w-full max-w-5xl mx-auto my-6 bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-parchment-300 p-6 sm:p-10 relative overflow-hidden flex-1">
        {/* Top Official Seal Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-detective-900/20 pb-6 mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-seal-red">
                Arsip Terdekalsifikasi • {currentCase.code}
              </span>
              <span className="text-xs font-mono text-detective-500">• 1945</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-detective-950 mt-1">
              {currentCase.title}
            </h1>
            <p className="text-sm font-serif italic text-detective-700 mt-0.5">
              {currentCase.subtitle}
            </p>
          </div>

          {/* Big Stamp Box */}
          <div className="border-4 border-emerald-700 text-emerald-800 p-3 rounded-md font-mono text-center transform sm:rotate-2 shadow-sm bg-emerald-50">
            <span className="text-[10px] uppercase tracking-widest font-bold block">
              EVALUASI AKHIR DETEKTIF
            </span>
            <span className="text-2xl sm:text-3xl font-black block">
              {finalScore.total} <span className="text-sm font-normal">/ 100</span>
            </span>
            <span className="text-[11px] font-bold block mt-0.5 text-emerald-900">
              {finalScore.rankTitle}
            </span>
          </div>
        </div>

        {/* Score Breakdown Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-parchment-200/80 rounded-lg border border-parchment-400 text-xs font-mono mb-8">
          <div className="text-center p-2 bg-white/70 rounded">
            <span className="text-detective-500 block text-[10px] uppercase">Arsip Bukti</span>
            <strong className="text-sm text-detective-900">{finalScore.evidenceScore} / 25</strong>
          </div>
          <div className="text-center p-2 bg-white/70 rounded">
            <span className="text-detective-500 block text-[10px] uppercase">Teka-Teki & Sandi</span>
            <strong className="text-sm text-detective-900">{finalScore.puzzleScore} / 20</strong>
          </div>
          <div className="text-center p-2 bg-white/70 rounded">
            <span className="text-detective-500 block text-[10px] uppercase">Kronologi Waktu</span>
            <strong className="text-sm text-detective-900">{finalScore.timelineScore} / 15</strong>
          </div>
          <div className="text-center p-2 bg-white/70 rounded">
            <span className="text-detective-500 block text-[10px] uppercase">Papan Hubungan</span>
            <strong className="text-sm text-detective-900">{finalScore.connectionScore} / 15</strong>
          </div>
          <div className="text-center p-2 bg-white/70 rounded col-span-2 sm:col-span-1">
            <span className="text-detective-500 block text-[10px] uppercase">Deduksi Akhir</span>
            <strong className="text-sm text-seal-red">{finalScore.deductionScore} / 30</strong>
          </div>
        </div>

        {/* Historical Explanation & Narrative Synthesis */}
        <div className="space-y-6 font-serif text-sm sm:text-base text-detective-900 leading-relaxed mb-8">
          <div>
            <h3 className="font-serif font-bold text-lg text-detective-950 flex items-center space-x-2 border-b border-detective-900/20 pb-2 mb-3">
              <BookOpen className="w-5 h-5 text-seal-red" />
              <span>{debrief.title}</span>
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-detective-800">
              {debrief.whatActuallyHappened.map((fact, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-seal-red font-bold font-mono">0{idx + 1}.</span>
                  <p>{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          <div className="p-4 bg-white/90 rounded-lg border-2 border-detective-900/15">
            <h4 className="font-mono text-xs font-bold uppercase text-seal-red tracking-wider mb-1 flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-seal-gold fill-current" />
              <span>Makna Filosofis Bagi Bangsa Indonesia:</span>
            </h4>
            <p className="text-xs sm:text-sm text-detective-900 leading-relaxed">
              {debrief.whyItMatters}
            </p>
          </div>

          {/* Historiographical Debates */}
          <div className="p-4 bg-amber-50/80 rounded-lg border border-amber-300">
            <h4 className="font-mono text-xs font-bold uppercase text-amber-900 tracking-wider mb-1">
              Kajian Kritis Sejarawan:
            </h4>
            <p className="text-xs sm:text-sm text-detective-800 leading-relaxed">
              {debrief.historicalDebates}
            </p>
          </div>

          {/* Academic References */}
          <div className="p-4 bg-detective-900 text-parchment-200 rounded-lg border border-parchment-800">
            <h4 className="font-mono text-xs font-bold uppercase text-seal-gold tracking-wider mb-2 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4" />
              <span>Sumber Rujukan Akademik & Arsip Sejarah Terverifikasi:</span>
            </h4>
            <ul className="space-y-1.5 text-xs font-serif text-parchment-300">
              {debrief.sources.map((src, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-seal-gold">•</span>
                  <span>
                    <strong>{src.title}</strong> — {src.authorOrInstitution} ({src.year})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t-2 border-detective-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              if (confirm('Ulangi investigasi Kasus 01 dari awal? Catatan dan progres akan disetel ulang.')) {
                resetCurrentCase();
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded border border-detective-400 font-mono text-xs text-detective-700 hover:bg-parchment-200 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ULANGI INVESTIGASI</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playPaper();
                setActiveView('CASE_SELECT');
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded bg-detective-900 hover:bg-detective-850 text-parchment-100 font-mono text-xs font-bold tracking-wider transition flex items-center justify-center space-x-2 shadow-paper"
            >
              <FolderLock className="w-3.5 h-3.5 text-seal-gold" />
              <span>ARSIP KASUS LAIN</span>
            </button>

            <button
              onClick={() => {
                sound.playPaper();
                setActiveView('TITLE');
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition flex items-center justify-center space-x-2 shadow-paper"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>BERANDA UTAMA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-5xl mx-auto border-t border-parchment-800/40 pt-3 text-center text-xs font-mono text-parchment-500">
        Unit Investigasi Arsip Jejak Nusantara • Laporan Deklasifikasi Sah
      </div>
    </div>
  );
};
