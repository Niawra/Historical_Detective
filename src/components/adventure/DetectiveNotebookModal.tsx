import React from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { BookOpen, X, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const DetectiveNotebookModal: React.FC = () => {
  const { clues, badges, isNotebookOpen, toggleNotebook, xp } = useAdventure();

  if (!isNotebookOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#1b1510] text-parchment-100 rounded-2xl border-2 border-amber-600/70 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 bg-[#231c15] border-b border-parchment-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                Buku Saku Detektif
              </span>
              <h3 className="font-serif font-black text-lg text-parchment-100">
                Catatan Petunjuk & Bukti Sejarah
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50">
              +{xp} XP
            </span>
            <button
              onClick={toggleNotebook}
              className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Tabs / Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Clues Section */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-parchment-800/60 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-parchment-300 font-bold flex items-center space-x-1.5">
                <span>Petunjuk Ditemukan:</span>
                <span className="text-amber-400 font-bold">({clues.length})</span>
              </span>
              <span className="font-mono text-[11px] text-parchment-500">
                Tersimpan Otomatis
              </span>
            </div>

            {clues.length === 0 ? (
              <div className="text-center py-8 bg-[#14100c] rounded-xl border border-dashed border-parchment-800">
                <p className="font-serif italic text-sm text-parchment-400">
                  Belum ada petunjuk yang dikumpulkan.
                </p>
                <p className="text-xs font-mono text-parchment-500 mt-1">
                  Jelajahi lokasi dan periksa benda-benda mencurigakan dengan menekan [E].
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clues.map((clue, idx) => (
                  <div
                    key={clue.id}
                    className="p-4 rounded-xl bg-[#221b14] border border-parchment-800 hover:border-amber-600/50 transition flex items-start space-x-3"
                  >
                    <div className="text-2xl shrink-0 pt-0.5">
                      {clue.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-amber-200">
                          {clue.title}
                        </h4>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-black/40 text-emerald-400 border border-emerald-900 font-bold">
                          {clue.sourceStatus}
                        </span>
                      </div>

                      <p className="font-serif text-xs text-parchment-200 mt-1 leading-relaxed">
                        {clue.shortSummary}
                      </p>

                      <p className="font-serif text-[11px] text-parchment-400 mt-1 italic">
                        {clue.fullDetail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges Section */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-parchment-800/60 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-parchment-300 font-bold flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Pencapaian Detektif:</span>
              </span>
              <span className="font-mono text-[11px] text-amber-400">
                {badges.filter(b => b.isUnlocked).length} / {badges.length} Terbuka
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center space-x-3 ${
                    b.isUnlocked
                      ? 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                      : 'bg-[#14100c] border-parchment-900 text-parchment-600 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <strong className="block font-serif text-xs text-parchment-100">{b.name}</strong>
                    <span className="text-[10px] text-parchment-400 line-clamp-1">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 bg-[#231c15] border-t border-parchment-800 flex justify-end">
          <button
            onClick={toggleNotebook}
            className="px-5 py-2 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold transition"
          >
            TUTUP CATATAN
          </button>
        </footer>
      </div>
    </div>
  );
};
