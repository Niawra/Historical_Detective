import React from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { Search, X, CheckCircle2, BookmarkPlus } from 'lucide-react';

export const InspectModal: React.FC = () => {
  const { inspectData, closeInspect } = useAdventure();

  if (!inspectData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#1b1510] border-2 border-amber-600/80 rounded-2xl p-6 sm:p-7 shadow-2xl text-parchment-100 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                Pemeriksaan Objek • {inspectData.category}
              </span>
              <h3 className="font-serif font-black text-lg text-parchment-100">
                {inspectData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeInspect}
            className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-serif text-sm text-parchment-200 leading-relaxed">
          <p className="bg-[#241c15] p-4 rounded-xl border border-parchment-800 text-parchment-200">
            {inspectData.description}
          </p>

          {inspectData.historicalNote && (
            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-700/40 text-xs text-amber-200">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                Konteks Fakta Sejarah:
              </span>
              <p>{inspectData.historicalNote}</p>
            </div>
          )}

          {inspectData.rewardClue && (
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-600/50 flex items-center space-x-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block font-mono text-[11px] uppercase text-emerald-200">
                  Petunjuk Baru Tercatat di Buku Saku!
                </strong>
                <span>{inspectData.rewardClue.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-parchment-800 flex justify-end">
          <button
            onClick={closeInspect}
            className="px-5 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold transition"
          >
            SELESAI MEMERIKSA
          </button>
        </div>
      </div>
    </div>
  );
};
