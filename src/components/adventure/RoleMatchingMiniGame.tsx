import React, { useState } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { Users, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { MISSION_1_CLUES } from '../../data/adventureData';

interface RolePair {
  id: string;
  figureName: string;
  correctRoleKey: string;
}

export const RoleMatchingMiniGame: React.FC = () => {
  const { 
    roleMatchingSolved, 
    setRoleMatchingSolved, 
    addClue, 
    advanceToLocation, 
    addXP 
  } = useAdventure();

  const figures: RolePair[] = [
    { id: 'f-1', figureName: 'Ir. Soekarno & Mohammad Hatta', correctRoleKey: 'role-tua' },
    { id: 'f-2', figureName: 'Chaerul Saleh & Wikana', correctRoleKey: 'role-muda' },
    { id: 'f-3', figureName: 'Shodanco Singgih', correctRoleKey: 'role-peta' },
    { id: 'f-4', figureName: 'Mr. Achmad Soebardjo', correctRoleKey: 'role-penengah' },
  ];

  const roles = [
    { key: 'role-tua', text: 'Golongan Tua (Mengutamakan kehati-hatian diplomasi demi keselamatan rakyat dari serdadu Jepang)' },
    { key: 'role-muda', text: 'Golongan Muda (Mendesak kemerdekaan mandiri seketika tanpa kompromi janji Jepang)' },
    { key: 'role-peta', text: 'Perwira PETA (Mengawal dan mengamankan rombongan proklamator di Rengasdengklok)' },
    { key: 'role-penengah', text: 'Tokoh Penengah (Menjaminkan nyawanya sendiri untuk kepastian pelaksanaan Proklamasi)' },
  ];

  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectFigure = (figureId: string) => {
    sound.playClick();
    setSelectedFigureId(figureId);
    setFeedback(null);
  };

  const handleSelectRole = (roleKey: string) => {
    if (!selectedFigureId) {
      setFeedback('Pilih tokoh di sebelah kiri terlebih dahulu.');
      return;
    }

    sound.playClick();
    const targetFig = figures.find(f => f.id === selectedFigureId);
    if (!targetFig) return;

    if (targetFig.correctRoleKey === roleKey) {
      sound.playSuccess();
      const updated = { ...matches, [selectedFigureId]: roleKey };
      setMatches(updated);
      setSelectedFigureId(null);
      setFeedback('Cocok! Peran tokoh terbukti sesuai fakta sejarah.');

      // Check if all matched
      if (Object.keys(updated).length === figures.length) {
        setRoleMatchingSolved(true);
        addXP(100);
        addClue(MISSION_1_CLUES.rolesSynthesis);
        sound.playBadge();
      }
    } else {
      sound.playClick();
      setFeedback('Kurang tepat. Periksa kembali sikap dan posisi tokoh ini pada 15-16 Agustus 1945.');
    }
  };

  const handleProceed = () => {
    sound.playPaper();
    advanceToLocation('LOC_4_TIMELINE');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1b1510] border-2 border-amber-600/70 rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-100 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Tantangan Lokasi 3 • Ruang Dokumen
            </span>
            <h3 className="font-serif font-black text-xl text-parchment-100">
              Cocokkan Tokoh & Analisis Dua Golongan
            </h3>
          </div>
        </div>

        {roleMatchingSolved && (
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>TUNTAS</span>
          </span>
        )}
      </div>

      {/* Explanatory context */}
      <p className="font-serif text-xs sm:text-sm text-parchment-300 leading-relaxed mb-6">
        Ketuk salah satu tokoh di sebelah kiri, kemudian ketuk peran historis yang tepat di sebelah kanan untuk menautkannya.
      </p>

      {/* Matching Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        {/* Figures List (Left) */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase text-amber-400 block mb-2">
            Pilih Tokoh Sejarah:
          </span>
          {figures.map((fig) => {
            const isMatched = !!matches[fig.id];
            const isSelected = selectedFigureId === fig.id;

            return (
              <button
                key={fig.id}
                disabled={isMatched}
                onClick={() => handleSelectFigure(fig.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300 opacity-90'
                    : isSelected
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-[#241c15] border-parchment-800 text-parchment-200 hover:border-parchment-600'
                }`}
              >
                <span className="font-serif font-bold text-sm">{fig.figureName}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Roles List (Right) */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase text-amber-400 block mb-2">
            Tautkan Peran Historis:
          </span>
          {roles.map((r) => {
            const isMatchedByAny = Object.values(matches).includes(r.key);

            return (
              <button
                key={r.key}
                disabled={isMatchedByAny}
                onClick={() => handleSelectRole(r.key)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition ${
                  isMatchedByAny
                    ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300 opacity-90'
                    : 'bg-[#241c15] border-parchment-800 text-parchment-300 hover:border-amber-500 hover:text-white'
                }`}
              >
                <span className="font-serif text-xs leading-relaxed block">{r.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback notice */}
      {feedback && (
        <div className={`mt-4 p-3 rounded-xl border text-xs font-serif leading-relaxed flex items-center space-x-2 ${
          feedback.includes('Cocok') 
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
            : 'bg-amber-950/60 border-amber-500 text-amber-200'
        }`}>
          {feedback.includes('Cocok') ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      {/* Bottom Action */}
      <div className="mt-8 pt-4 border-t border-parchment-800 flex items-center justify-between">
        <span className="text-xs font-mono text-parchment-500">
          Progres: {Object.keys(matches).length} / {figures.length} Tokoh Cocok
        </span>

        {roleMatchingSolved && (
          <button
            onClick={handleProceed}
            className="px-6 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition flex items-center space-x-2 shadow-lg animate-pulse"
          >
            <span>MASUK KE RUANG KRONOLOGI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
