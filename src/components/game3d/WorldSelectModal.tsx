import React from 'react';
import { HistoricalWorld, HistoricalWorldId } from '../../types';
import { HISTORICAL_WORLDS } from '../../data/worldData';
import { sound } from '../../utils/audio';
import { Compass, Calendar, MapPin, Lock, Play, X, Sparkles } from 'lucide-react';

interface WorldSelectModalProps {
  currentWorldId: HistoricalWorldId;
  onSelectWorld: (worldId: HistoricalWorldId) => void;
  onClose: () => void;
}

export const WorldSelectModal: React.FC<WorldSelectModalProps> = ({
  currentWorldId,
  onSelectWorld,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#1b1510] border-2 border-amber-600 rounded-2xl shadow-2xl text-parchment-100 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#231b14] border-b border-parchment-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Peta Waktu Nusantara
              </span>
              <h3 className="font-serif font-black text-lg text-parchment-100">
                Pilih Periode Dunia Sejarah
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worlds Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HISTORICAL_WORLDS.map((world) => {
            const isCurrent = world.id === currentWorldId;
            const isUnlocked = world.isUnlocked;

            return (
              <div
                key={world.id}
                className={`relative rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-400 shadow-xl ring-2 ring-amber-500/30'
                    : isUnlocked
                    ? 'bg-[#241c15] border-parchment-800 hover:border-amber-500/70 cursor-pointer'
                    : 'bg-[#15110d] border-parchment-900/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-black/50 text-amber-300 border border-parchment-800 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {world.year}
                    </span>
                    <span className="text-[10px] font-mono text-parchment-400">
                      {world.location}
                    </span>
                  </div>

                  <h4 className="font-serif font-black text-base text-parchment-100 mt-1">
                    {world.name}
                  </h4>
                  <p className="font-serif italic text-xs text-amber-300 mt-0.5">
                    {world.title}
                  </p>
                  <p className="font-serif text-xs text-parchment-400 mt-2 line-clamp-3 leading-relaxed">
                    {world.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-parchment-800/50 flex items-center justify-between">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectWorld(world.id);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs tracking-wider transition flex items-center justify-center space-x-1.5 shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrent ? 'LANJUTKAN EKSPLORASI' : 'JELAJAHI DUNIA INI'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl bg-black/40 text-parchment-500 font-mono text-xs flex items-center justify-center space-x-1 border border-parchment-900">
                      <Lock className="w-3.5 h-3.5 mr-1 text-parchment-600" />
                      <span>Selesaikan Misi Sebelumnya</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
