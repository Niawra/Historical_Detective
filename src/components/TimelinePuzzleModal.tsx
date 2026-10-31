import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  Clock, 
  X, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TimelinePuzzleModal: React.FC = () => {
  const { currentCase, progress, updateTimelineOrder, verifyTimelineOrder, setActiveModal } = useGame();

  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; correctCount: number } | null>(null);

  // Cards in current player order
  const orderedCards = progress.timelineOrder
    .map(id => currentCase.timelineCards.find(c => c.id === id))
    .filter(Boolean) as typeof currentCase.timelineCards;

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    sound.playClick();
    const newIdx = direction === 'UP' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= orderedCards.length) return;

    const newOrder = [...progress.timelineOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[newIdx];
    newOrder[newIdx] = temp;

    updateTimelineOrder(newOrder);
    setFeedback(null);
  };

  const handleVerify = () => {
    const result = verifyTimelineOrder();
    setFeedback({
      isCorrect: result.isCorrect,
      message: result.feedback,
      correctCount: result.correctCount
    });
  };

  const isSolved = progress.solvedPuzzleIds.includes('timeline-puzzle');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-parchment-300 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-4 border-b-2 border-detective-900/20 bg-parchment-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-detective-900 text-blue-400 flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-red tracking-wider">
                Tantangan Kronologi Sejarah • {currentCase.code}
              </span>
              <h2 className="text-xl font-serif font-black text-detective-950 flex items-center space-x-2">
                <span>Susun Garis Waktu Peristiwa Rengasdengklok</span>
                {isSolved && <span className="text-emerald-700 text-xs font-mono font-bold">(SELESAI ✓)</span>}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="p-1.5 rounded hover:bg-detective-900 hover:text-white transition text-detective-700"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Instructions banner */}
        <div className="px-6 py-2.5 bg-blue-50/80 border-b border-blue-200 text-xs font-serif text-blue-950 flex items-center justify-between">
          <span>
            <strong>Instruksi:</strong> Urutkan kartu peristiwa dari waktu yang paling awal (paling atas) hingga peristiwa penutup (paling bawah) menggunakan tombol panah Naik / Turun.
          </span>
          <span className="font-mono font-bold text-blue-900 text-[11px] whitespace-nowrap ml-2">
            Target: {currentCase.timelineCards.length} Kartu
          </span>
        </div>

        {/* Content Body: Timeline cards list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {orderedCards.map((card, idx) => {
            const isCorrectPosition = isSolved || (feedback && feedback.correctCount > 0 && card.correctOrder === idx + 1);

            return (
              <div
                key={card.id}
                className={`p-4 rounded-lg border-2 transition flex items-center justify-between gap-4 ${
                  isSolved
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                    : 'bg-white/90 border-parchment-300 hover:border-seal-gold shadow-sm'
                }`}
              >
                {/* Step number badge */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold ${
                    isSolved
                      ? 'bg-emerald-700 text-white border-emerald-900'
                      : 'bg-detective-900 text-parchment-100 border-detective-950'
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-seal-red bg-seal-red/10 px-2 py-0.5 rounded flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{card.timestamp}</span>
                    </span>
                    <span className="font-mono text-[10px] text-detective-500 italic">
                      {card.evidenceHint}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-detective-950 mt-1">
                    {card.title}
                  </h4>
                  <p className="font-serif text-xs text-detective-700 mt-0.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Move buttons */}
                {!isSolved && (
                  <div className="flex flex-col space-y-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'UP')}
                      className={`p-1.5 rounded border text-xs ${
                        idx === 0 
                          ? 'opacity-30 cursor-not-allowed bg-parchment-200 border-parchment-300 text-detective-400' 
                          : 'bg-detective-900 text-white hover:bg-detective-800'
                      }`}
                      title="Geser ke Atas (Waktu Lebih Awal)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === orderedCards.length - 1}
                      onClick={() => handleMove(idx, 'DOWN')}
                      className={`p-1.5 rounded border text-xs ${
                        idx === orderedCards.length - 1 
                          ? 'opacity-30 cursor-not-allowed bg-parchment-200 border-parchment-300 text-detective-400' 
                          : 'bg-detective-900 text-white hover:bg-detective-800'
                      }`}
                      title="Geser ke Bawah (Waktu Lebih Akhir)"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Validation Feedback Banner */}
        {feedback && (
          <div className={`px-6 py-3 border-t-2 text-xs font-serif leading-relaxed flex items-center space-x-2 ${
            feedback.isCorrect 
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950' 
              : 'bg-amber-100 border-amber-400 text-amber-950'
          }`}>
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <p className="flex-1">{feedback.message}</p>
          </div>
        )}

        {/* Bottom Action Footer */}
        <footer className="px-6 py-3 border-t-2 border-detective-900/20 bg-parchment-200/60 flex items-center justify-between">
          <span className="text-xs font-mono text-detective-600">
            {isSolved 
              ? 'Status: Kronologi terverifikasi lengkap.' 
              : 'Klik tombol di samping setelah selesai mengatur urutan kartu.'}
          </span>

          <div className="flex items-center space-x-3">
            {!isSolved && (
              <button
                onClick={handleVerify}
                className="px-5 py-2 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition shadow-paper flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>PERIKSA URUTAN KRONOLOGI</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="px-4 py-2 rounded bg-detective-900 text-white font-mono text-xs font-bold hover:bg-detective-850"
            >
              KEMBALI KE MEJA
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
