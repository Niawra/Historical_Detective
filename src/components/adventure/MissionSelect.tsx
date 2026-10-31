import React, { useState } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { MISSIONS_LIST } from '../../data/adventureData';
import { ArrowLeft, Play, Lock, Calendar, Sparkles, Compass } from 'lucide-react';
import { MissionData } from '../../types';

export const MissionSelect: React.FC = () => {
  const { setScreen, startMission1 } = useAdventure();
  const [selectedMission, setSelectedMission] = useState<MissionData>(MISSIONS_LIST[0]);

  const handleStartMission = (mission: MissionData) => {
    if (mission.isUnlocked) {
      sound.playClick();
      startMission1();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0b09] text-parchment-100 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-parchment-800/60 pb-4">
        <button
          onClick={() => {
            sound.playClick();
            setScreen('MENU_UTAMA');
          }}
          className="flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-white px-3 py-1.5 rounded-lg border border-parchment-800 bg-[#16120e] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE MENU</span>
        </button>

        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-amber-500" />
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
            PILIH MISI PENYELIDIKAN
          </span>
        </div>
      </header>

      {/* Main Grid: Mission Posters */}
      <main className="w-full max-w-6xl mx-auto my-auto py-8">
        <div className="text-center mb-8">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-parchment-100">
            Katalog Kasus Sejarah Indonesia
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-parchment-400 mt-1">
            Pilih peristiwa masa lalu yang ingin kamu selidiki
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MISSIONS_LIST.map((m) => {
            const isUnlocked = m.isUnlocked;

            return (
              <div
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMission(m);
                }}
                className={`relative rounded-2xl p-5 border-2 transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-[#231b14] to-[#16120e] border-amber-600/70 hover:border-amber-400 cursor-pointer transform hover:-translate-y-1'
                    : 'bg-[#14100c]/80 border-parchment-900/60 opacity-60'
                }`}
              >
                {/* Poster Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase bg-black/50 border border-parchment-800 text-amber-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{m.year}</span>
                  </span>

                  <span className="font-mono text-[10px] text-parchment-400 uppercase tracking-wider">
                    MISI #{m.number}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="my-2">
                  <h3 className="font-serif font-black text-lg text-parchment-100 leading-tight">
                    {m.title}
                  </h3>
                  <p className="font-serif italic text-xs text-amber-300/80 mt-1">
                    {m.subtitle}
                  </p>
                  <p className="font-serif text-xs text-parchment-400 mt-3 line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-parchment-800/40 flex items-center justify-between">
                  {isUnlocked ? (
                    <button
                      onClick={() => handleStartMission(m)}
                      className="w-full py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>MASUK KE LOKASI</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl bg-black/40 text-parchment-500 font-mono text-xs flex items-center justify-center space-x-1.5 border border-parchment-800/30">
                      <Lock className="w-3.5 h-3.5 text-parchment-600" />
                      <span>Selesaikan Misi #{m.number - 1} untuk membuka</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center text-xs font-mono text-parchment-500 pt-4 border-t border-parchment-800/40">
        Unit Penyelidikan Sejarah • Jejak Nusantara
      </footer>
    </div>
  );
};
