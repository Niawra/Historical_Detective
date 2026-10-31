import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const CipherPuzzleModal: React.FC = () => {
  const { currentCase, progress, submitCipher, setActiveModal } = useGame();
  const [digits, setDigits] = useState<string[]>(['1', '6', '0', '0']); // near hint default
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const cipher = currentCase.cipherPuzzle;
  const isSolved = progress.cipherSolved;

  const handleDigitChange = (index: number, delta: number) => {
    sound.playClick();
    setDigits(prev => {
      const next = [...prev];
      const val = (parseInt(next[index] || '0', 10) + delta + 10) % 10;
      next[index] = val.toString();
      return next;
    });
    setFeedback(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    const res = submitCipher(code);
    setFeedback({
      isCorrect: res.isCorrect,
      message: res.feedback
    });
  };

  if (!cipher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-detective-900 text-parchment-100 rounded-lg shadow-dossier border-4 border-parchment-700/80 p-6 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${isSolved ? 'bg-emerald-600 text-white' : 'bg-seal-red text-white'}`}>
              {isSolved ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-gold tracking-wider">
                Mekanisme Gembok Sandi • Markas PETA
              </span>
              <h3 className="font-serif font-bold text-base text-parchment-100">
                {cipher.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="p-1.5 rounded hover:bg-detective-800 text-parchment-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clue and Scenario */}
        <div className="space-y-3 font-serif text-xs text-parchment-300 leading-relaxed mb-6">
          <p className="bg-detective-950 p-3 rounded border border-parchment-800 text-parchment-300 italic">
            “{cipher.scenario}”
          </p>

          <div className="p-2.5 bg-amber-950/40 rounded border border-amber-700/50 text-amber-200">
            <span className="font-mono text-[10px] font-bold uppercase text-amber-300 block mb-0.5">
              Petunjuk Ukiran Gembok:
            </span>
            <p>{cipher.hint2}</p>
          </div>
        </div>

        {/* 4 Digit Interactive Dial */}
        <div className="bg-detective-950 p-6 rounded-lg border-2 border-parchment-800/80 flex flex-col items-center justify-center my-2 shadow-inner">
          <span className="font-mono text-xs text-parchment-400 mb-3 uppercase tracking-wider">
            Kombinasi Empat Digit (DDMM):
          </span>

          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            {digits.map((digit, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <button
                  disabled={isSolved}
                  onClick={() => handleDigitChange(idx, 1)}
                  className="w-10 h-7 rounded bg-detective-800 hover:bg-detective-700 border border-parchment-700 text-parchment-200 text-xs font-mono font-bold flex items-center justify-center transition disabled:opacity-40"
                >
                  ▲
                </button>

                <div className={`w-12 h-14 rounded-md border-2 flex items-center justify-center font-mono text-2xl font-black shadow-paper ${
                  isSolved
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-detective-900 border-seal-gold text-seal-gold'
                }`}>
                  {digit}
                </div>

                <button
                  disabled={isSolved}
                  onClick={() => handleDigitChange(idx, -1)}
                  className="w-10 h-7 rounded bg-detective-800 hover:bg-detective-700 border border-parchment-700 text-parchment-200 text-xs font-mono font-bold flex items-center justify-center transition disabled:opacity-40"
                >
                  ▼
                </button>
              </div>
            ))}
          </div>

          {/* Format label */}
          <div className="flex items-center justify-center space-x-8 mt-2 text-[10px] font-mono text-parchment-500">
            <span>[ HARI ]</span>
            <span>[ BULAN ]</span>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className={`mt-4 p-3 rounded text-xs font-serif leading-relaxed flex items-start space-x-2 border ${
            feedback.isCorrect 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' 
              : 'bg-red-950/80 border-red-700 text-red-200'
          }`}>
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <p className="flex-1">{feedback.message}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-3 border-t border-parchment-800 flex items-center justify-between">
          <span className="font-mono text-[10px] text-parchment-500">
            {isSolved ? 'Gembok komando terbuka.' : 'Format 4 digit angka.'}
          </span>

          <div className="flex items-center space-x-2">
            {!isSolved ? (
              <button
                onClick={() => handleSubmit()}
                className="px-5 py-2 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition shadow-paper flex items-center space-x-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>COCOKKAN SANDI</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded bg-emerald-700 text-white font-mono text-xs font-bold hover:bg-emerald-800"
              >
                KEMBALI KE MEJA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
