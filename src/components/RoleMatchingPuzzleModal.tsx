import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  Users, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Shield, 
  HelpCircle 
} from 'lucide-react';

export const RoleMatchingPuzzleModal: React.FC = () => {
  const { currentCase, progress, updateMatchingAnswer, verifyMatchingPuzzle, setActiveModal } = useGame();

  const [feedback, setFeedback] = useState<{ isComplete: boolean; message: string; correctCount: number } | null>(null);

  const roles = [
    { key: 'role-tua', label: 'Golongan Tua (Menolak didikte & mengutamakan kalkulasi matang demi keselamatan rakyat)' },
    { key: 'role-muda-desak', label: 'Golongan Muda (Memimpin rapat radikal Menteng 31 & menuntut proklamasi mandiri)' },
    { key: 'role-lapangan', label: 'Pelaksana Pengamanan Lapangan (Perwira PETA yang mengawal ke Karawang)' },
    { key: 'role-penengah', label: 'Tokoh Penengah Diplomatik (Menjaminkan nyawanya untuk kepastian proklamasi)' },
    { key: 'role-tuan-rumah', label: 'Tuan Rumah Perlindungan (Warga Tionghoa penyedia rumah aman tepi Citarum)' },
  ];

  const handleSelectRole = (figureId: string, roleKey: string) => {
    updateMatchingAnswer(figureId, roleKey);
    setFeedback(null);
  };

  const handleVerify = () => {
    const result = verifyMatchingPuzzle();
    setFeedback({
      isComplete: result.isComplete,
      message: result.feedback,
      correctCount: result.correctCount
    });
  };

  const isSolved = progress.solvedPuzzleIds.includes('matching-puzzle');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-parchment-300 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-4 border-b-2 border-detective-900/20 bg-parchment-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-detective-900 text-purple-400 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-red tracking-wider">
                Analisis Profil Tokoh • {currentCase.code}
              </span>
              <h2 className="text-xl font-serif font-black text-detective-950 flex items-center space-x-2">
                <span>Pencocokan Peran Sejarah Para Tokoh</span>
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

        {/* Instructions */}
        <div className="px-6 py-2.5 bg-purple-50/80 border-b border-purple-200 text-xs font-serif text-purple-950 flex items-center justify-between">
          <span>
            <strong>Instruksi:</strong> Pasangkan setiap tokoh sejarah dengan peran dan posisi ideologis mereka yang sesungguhnya pada peristiwa 15–16 Agustus 1945.
          </span>
          <span className="font-mono font-bold text-purple-900 text-[11px] whitespace-nowrap ml-2">
            {currentCase.matchingPairs.length} Tokoh Kunci
          </span>
        </div>

        {/* List of figures */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentCase.matchingPairs.map((pair, idx) => {
            const currentSelected = progress.matchingAnswers[pair.id] || '';
            const isCorrect = isSolved || (feedback && currentSelected === pair.correctRoleKey);

            return (
              <div
                key={pair.id}
                className={`p-4 rounded-lg border-2 transition ${
                  isSolved
                    ? 'bg-emerald-50/80 border-emerald-400'
                    : 'bg-white/90 border-parchment-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-200 pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-seal-red bg-seal-red/10 px-2 py-0.5 rounded">
                      Tokoh #{idx + 1}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-detective-950">
                      {pair.figureName}
                    </h4>
                  </div>

                  <span className="text-[11px] font-serif italic text-detective-600">
                    {pair.context}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5 text-xs font-serif text-detective-700 leading-relaxed">
                    {pair.roleDescription}
                  </div>

                  <div className="md:col-span-7">
                    <label className="block font-mono text-[10px] uppercase font-bold text-detective-600 mb-1">
                      Pilih Peran Historis:
                    </label>
                    <select
                      disabled={isSolved}
                      value={currentSelected}
                      onChange={(e) => handleSelectRole(pair.id, e.target.value)}
                      className={`w-full p-2 rounded border text-xs font-serif outline-none ${
                        isSolved
                          ? 'bg-emerald-100/50 border-emerald-400 font-bold text-emerald-950'
                          : 'bg-parchment-50 border-parchment-400 text-detective-950 focus:border-seal-gold'
                      }`}
                    >
                      <option value="">-- Tentukan Peran Tokoh Ini --</option>
                      {roles.map(r => (
                        <option key={r.key} value={r.key}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`px-6 py-3 border-t-2 text-xs font-serif leading-relaxed flex items-center space-x-2 ${
            feedback.isComplete 
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950' 
              : 'bg-amber-100 border-amber-400 text-amber-950'
          }`}>
            {feedback.isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <p className="flex-1">{feedback.message}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="px-6 py-3 border-t-2 border-detective-900/20 bg-parchment-200/60 flex items-center justify-between">
          <span className="text-xs font-mono text-detective-600">
            {isSolved ? 'Semua peran tokoh telah terverifikasi.' : 'Pastikan setiap tokoh dipasangkan dengan perannya.'}
          </span>

          <div className="flex items-center space-x-3">
            {!isSolved && (
              <button
                onClick={handleVerify}
                className="px-5 py-2 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition shadow-paper flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>VERIFIKASI PERAN</span>
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
