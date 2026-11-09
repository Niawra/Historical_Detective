import React, { useState } from 'react';
import { Quest, CollectibleItem, DetectiveBadge } from '../../types';
import { sound } from '../../utils/audio';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  Compass, 
  X, 
  CheckCircle2, 
  MapPin, 
  FileText 
} from 'lucide-react';

interface JournalModalProps {
  quests: Quest[];
  collectibles: CollectibleItem[];
  badges: DetectiveBadge[];
  xp: number;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  quests,
  collectibles,
  badges,
  xp,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'COLLECTIBLES' | 'QUESTS' | 'BADGES'>('COLLECTIBLES');
  const [selectedCollectible, setSelectedCollectible] = useState<CollectibleItem | null>(
    collectibles.find(c => c.isFound) || collectibles[0]
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#1b1510] border-2 border-amber-600 rounded-2xl shadow-2xl text-parchment-100 flex flex-col h-[85vh] max-h-[680px] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#231b14] border-b border-parchment-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Chronicle Compass
              </span>
              <h3 className="font-serif font-black text-lg text-parchment-100">
                Jurnal Petualang & Catatan Sejarah
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-600/50 px-2.5 py-1 rounded-full font-bold">
              +{xp} XP
            </span>
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
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-[#201811] border-b border-parchment-800 flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('COLLECTIBLES');
            }}
            className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center space-x-2 ${
              activeTab === 'COLLECTIBLES' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-parchment-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artefak Sejarah ({collectibles.filter(c => c.isFound).length}/{collectibles.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('QUESTS');
            }}
            className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center space-x-2 ${
              activeTab === 'QUESTS' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-parchment-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daftar Misi ({quests.filter(q => q.isCompleted).length}/{quests.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('BADGES');
            }}
            className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center space-x-2 ${
              activeTab === 'BADGES' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-parchment-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Medali ({badges.filter(b => b.isUnlocked).length}/{badges.length})</span>
          </button>
        </div>

        {/* Tab 1: Collectibles */}
        {activeTab === 'COLLECTIBLES' && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 p-6 gap-6">
            {/* Left list (5 cols) */}
            <div className="md:col-span-5 space-y-2 overflow-y-auto max-h-[460px] pr-1">
              {collectibles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCollectible(item);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center space-x-3 ${
                    selectedCollectible?.id === item.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : item.isFound
                      ? 'bg-[#221c16] border-parchment-800 text-parchment-200 hover:border-parchment-600'
                      : 'bg-[#15110d] border-parchment-900/50 text-parchment-600 opacity-60'
                  }`}
                >
                  <span className="text-2xl shrink-0">{item.isFound ? item.icon : '❓'}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs truncate">
                      {item.isFound ? item.name : 'Artefak Tersembunyi'}
                    </h4>
                    <span className="font-mono text-[10px] text-parchment-400 block truncate">
                      {item.isFound ? item.category : 'Jelajahi peta untuk mencari'}
                    </span>
                  </div>
                  {item.isFound && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>

            {/* Right detail (7 cols) */}
            <div className="md:col-span-7 bg-[#231b14] rounded-2xl p-5 border border-parchment-800 flex flex-col justify-between overflow-y-auto">
              {selectedCollectible && selectedCollectible.isFound ? (
                <div className="space-y-4 font-serif">
                  <div className="flex items-center space-x-3 border-b border-parchment-800 pb-3">
                    <span className="text-4xl">{selectedCollectible.icon}</span>
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        {selectedCollectible.category}
                      </span>
                      <h4 className="font-black text-base text-parchment-100">
                        {selectedCollectible.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-parchment-300 leading-relaxed">
                    {selectedCollectible.description}
                  </p>

                  <div className="p-3 bg-[#19130e] rounded-xl border border-amber-900/40 text-xs text-amber-200">
                    <strong className="block font-mono text-[10px] uppercase text-amber-400 mb-1">
                      Fakta Sejarah Otentik:
                    </strong>
                    <p>{selectedCollectible.historicalFact}</p>
                  </div>

                  <div className="text-[11px] font-mono text-parchment-500 italic">
                    Sumber: {selectedCollectible.sourceReference}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-parchment-500">
                  <Sparkles className="w-12 h-12 text-parchment-700 mb-3" />
                  <p className="font-serif text-sm">Artefak ini belum ditemukan.</p>
                  <span className="text-xs font-mono mt-1">Cari benda berputar dengan cahaya pendar hijau di sekitar desa.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Quests */}
        {activeTab === 'QUESTS' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border ${
                  quest.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-600/60'
                    : 'bg-[#231b14] border-amber-600/60'
                }`}
              >
                <div className="flex items-start justify-between border-b border-parchment-800 pb-2 mb-3">
                  <div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                      {quest.isMainQuest ? '★ Misi Utama' : 'Side Quest'} • Pemberi: {quest.npcName}
                    </span>
                    <h4 className="font-serif font-black text-sm sm:text-base text-parchment-100 mt-0.5">
                      {quest.title}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    quest.isCompleted ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'
                  }`}>
                    {quest.isCompleted ? 'SELESAI ✓' : 'SEDANG BERJALAN'}
                  </span>
                </div>

                <p className="font-serif text-xs text-parchment-300 mb-3 leading-relaxed">
                  {quest.description}
                </p>

                {/* Steps */}
                <div className="space-y-1.5 bg-[#18130e] p-3 rounded-xl border border-parchment-800 text-xs font-serif">
                  {quest.steps.map((st, i) => (
                    <div key={st.id} className="flex items-center space-x-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        quest.currentStepIndex > i || quest.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : quest.currentStepIndex === i
                          ? 'bg-amber-500 text-black'
                          : 'bg-parchment-800 text-parchment-500'
                      }`}>
                        {i + 1}
                      </span>
                      <span className={quest.currentStepIndex > i || quest.isCompleted ? 'line-through text-parchment-500' : 'text-parchment-200'}>
                        {st.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Badges */}
        {activeTab === 'BADGES' && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-center space-x-4 ${
                  b.isUnlocked
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md'
                    : 'bg-[#15110d] border-parchment-900 text-parchment-600 opacity-50'
                }`}
              >
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h4 className="font-serif font-black text-sm text-parchment-100">
                    {b.name}
                  </h4>
                  <p className="font-serif text-xs text-parchment-400 mt-0.5">
                    {b.description}
                  </p>
                  <span className="font-mono text-[10px] text-amber-400 mt-1 block font-bold">
                    {b.isUnlocked ? 'Lencana Terbuka ★' : 'Terkunci'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
