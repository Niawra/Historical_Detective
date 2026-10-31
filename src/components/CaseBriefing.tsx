import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  ShieldAlert, 
  UserCheck, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Target, 
  Calendar, 
  MapPin,
  HelpCircle
} from 'lucide-react';

export const CaseBriefing: React.FC = () => {
  const { currentCase, setActiveView } = useGame();
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  const messages = currentCase.briefing.coordinatorMessage;

  const handleNextDialogue = () => {
    sound.playTypewriter();
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      sound.playStamp();
      setActiveView('INVESTIGATION');
    }
  };

  const handleSkipToInvestigate = () => {
    sound.playStamp();
    setActiveView('INVESTIGATION');
  };

  return (
    <div className="min-h-screen bg-detective-950 text-parchment-100 p-4 sm:p-8 flex flex-col justify-between">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-parchment-800/60 pb-3">
        <button
          onClick={() => {
            sound.playPaper();
            setActiveView('CASE_SELECT');
          }}
          className="flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-parchment-100 px-3 py-1.5 rounded border border-parchment-800 bg-detective-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE DAFTAR KASUS</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs text-seal-red font-bold uppercase tracking-wider bg-seal-red/10 border border-seal-red/40 px-2.5 py-1 rounded">
            BERKAS NO: {currentCase.briefing.caseFileNumber}
          </span>
        </div>
      </div>

      {/* Main Content: Coordinator Desk & File */}
      <div className="w-full max-w-5xl mx-auto my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left: Coordinator Avatar & Identity (4 cols) */}
        <div className="md:col-span-4 bg-detective-900 border border-parchment-800/60 rounded-lg p-6 flex flex-col justify-between shadow-paper">
          <div>
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-seal-gold bg-detective-850 flex items-center justify-center text-seal-gold shadow-paper relative">
              <UserCheck className="w-10 h-10" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full border-2 border-detective-900 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
            </div>

            <div className="text-center mt-3">
              <h3 className="font-serif font-bold text-base text-parchment-100">
                {currentCase.briefing.coordinatorName}
              </h3>
              <p className="text-xs font-mono text-seal-gold uppercase tracking-wider mt-0.5">
                {currentCase.briefing.coordinatorRole}
              </p>
              <div className="mt-2 inline-flex items-center space-x-1.5 text-[10px] font-mono text-parchment-400 bg-detective-950 px-2 py-0.5 rounded border border-parchment-800">
                <Compass className="w-3 h-3 text-seal-red" />
                <span>Unit Sejarah Kemerdekaan RI</span>
              </div>
            </div>

            {/* Quick Case Metadata */}
            <div className="mt-6 pt-4 border-t border-parchment-800/40 space-y-2.5 text-xs font-mono text-parchment-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-parchment-500">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-seal-gold" /> Tahun:
                </span>
                <span className="text-parchment-200">{currentCase.year}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-parchment-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-seal-gold" /> Lokasi:
                </span>
                <span className="text-parchment-200">Batavia & Rengasdengklok</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-parchment-500">
                  <Target className="w-3.5 h-3.5 mr-1.5 text-seal-gold" /> Target Bukti:
                </span>
                <span className="text-parchment-200">{currentCase.evidences.length} Berkas Arsip</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-parchment-800/40 text-[11px] font-serif text-parchment-500 italic text-center">
            “Kebenaran sejarah tersimpan di antara baris-baris arsip yang belum terungkap.”
          </div>
        </div>

        {/* Right: Briefing Transcript & Case Objectives (8 cols) */}
        <div className="md:col-span-8 bg-parchment-100 text-detective-900 rounded-lg p-6 sm:p-8 shadow-dossier border-4 border-parchment-300 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute right-4 top-4 text-parchment-300/40 font-mono text-6xl font-black pointer-events-none select-none">
            RAHASIA
          </div>

          <div>
            <div className="border-b-2 border-detective-900/20 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-seal-red flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>INSTRUKSI BRIEFING LAPANGAN</span>
                </span>
                <span className="font-mono text-xs text-detective-600">
                  Langkah {currentMessageIndex + 1} dari {messages.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-detective-950 mt-1">
                {currentCase.title}
              </h2>
            </div>

            {/* Historical context snippet */}
            <div className="mb-4 p-3 bg-parchment-200/60 rounded border border-parchment-300 text-xs font-serif text-detective-800 leading-relaxed italic">
              <strong>Konteks Awal:</strong> {currentCase.briefing.historicalContext}
            </div>

            {/* Coordinator Dialogue Bubble */}
            <div className="p-4 sm:p-5 bg-white/90 rounded border-2 border-detective-900/30 shadow-sm relative my-4">
              <span className="font-mono text-[10px] font-bold uppercase text-seal-red tracking-wider block mb-1">
                NARA LARASATI:
              </span>
              <p className="font-serif text-sm sm:text-base text-detective-950 leading-relaxed min-h-[70px]">
                {messages[currentMessageIndex]}
              </p>
            </div>

            {/* Main Question Highlight */}
            <div className="mt-4 p-3 bg-seal-red/10 border-l-4 border-seal-red rounded-r text-xs font-serif text-detective-900">
              <span className="font-mono font-bold uppercase text-seal-red block text-[11px] mb-0.5 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pertanyaan Pokok yang Wajib Terjawab:</span>
              </span>
              <p className="font-bold">{currentCase.mainQuestion}</p>
            </div>
          </div>

          {/* Navigation Controls inside dossier */}
          <div className="mt-6 pt-4 border-t-2 border-detective-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleSkipToInvestigate}
              className="text-xs font-mono text-detective-600 hover:text-detective-950 underline underline-offset-2"
            >
              Lewati pengantar (Langsung ke Ruang Investigasi)
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {currentMessageIndex < messages.length - 1 ? (
                <button
                  onClick={handleNextDialogue}
                  className="w-full sm:w-auto px-5 py-2.5 rounded bg-detective-900 hover:bg-detective-850 text-parchment-100 font-mono text-xs font-bold tracking-wider transition flex items-center justify-center space-x-2 shadow-paper"
                >
                  <span>LANJUTKAN ARAHAN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNextDialogue}
                  className="w-full sm:w-auto px-6 py-3 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition flex items-center justify-center space-x-2 shadow-paper animate-bounce"
                >
                  <FileText className="w-4 h-4" />
                  <span>MASUK KE RUANG INVESTIGASI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-5xl mx-auto border-t border-parchment-800/40 pt-3 text-center text-xs font-mono text-parchment-500">
        Unit Investigasi Arsip Jejak Nusantara • Dokumen Arahan Rahasia
      </div>
    </div>
  );
};
