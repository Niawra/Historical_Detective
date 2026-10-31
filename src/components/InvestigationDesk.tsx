import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  FolderArchive, 
  Share2, 
  Clock, 
  FileEdit, 
  HelpCircle, 
  Radio, 
  Lock, 
  CheckCircle2, 
  Search, 
  FileText, 
  MapPin, 
  Eye, 
  Sparkles, 
  KeyRound, 
  Users, 
  Award,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { InteractiveObject } from '../types';

export const InvestigationDesk: React.FC = () => {
  const { 
    currentCase, 
    activeSceneIndex, 
    setActiveSceneIndex, 
    progress, 
    examineObject, 
    setActiveView, 
    setActiveModal, 
    inspectEvidence,
    isMuted,
    toggleMute,
    requestHint
  } = useGame();

  const [inspectingObject, setInspectingObject] = useState<InteractiveObject | null>(null);

  const activeScene = currentCase.scenes[activeSceneIndex] || currentCase.scenes[0];

  const handleObjectClick = (obj: InteractiveObject) => {
    sound.playClick();
    examineObject(obj.id);
    setInspectingObject(obj);
  };

  const getObjectIcon = (type: InteractiveObject['iconType']) => {
    switch (type) {
      case 'radio': return <Radio className="w-5 h-5 text-amber-300 animate-pulse" />;
      case 'safe': return <Lock className="w-5 h-5 text-red-400" />;
      case 'map': return <MapPin className="w-5 h-5 text-emerald-300" />;
      case 'person': return <Users className="w-5 h-5 text-blue-300" />;
      case 'document': return <FileText className="w-5 h-5 text-amber-200" />;
      default: return <Search className="w-5 h-5 text-parchment-200" />;
    }
  };

  const totalEvidences = currentCase.evidences.length;
  const foundEvidences = progress.foundEvidenceIds.length;
  const solvedPuzzles = progress.solvedPuzzleIds.length;

  return (
    <div className="min-h-screen bg-detective-950 text-parchment-100 flex flex-col justify-between select-none">
      {/* Top Detective Command Bar */}
      <header className="bg-detective-900 border-b border-parchment-800/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-paper z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.playPaper();
              setActiveView('TITLE');
            }}
            className="flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-parchment-200 px-2.5 py-1 rounded border border-parchment-800 bg-detective-950"
            title="Kembali ke Beranda"
          >
            <Compass className="w-3.5 h-3.5 text-seal-gold" />
            <span className="hidden sm:inline">JEJAK NUSANTARA</span>
          </button>

          <div className="h-4 w-[1px] bg-parchment-800" />

          <div>
            <h1 className="text-xs sm:text-sm font-serif font-bold text-parchment-100 flex items-center space-x-2">
              <span>{currentCase.title}</span>
              <span className="text-[10px] font-mono text-seal-gold bg-seal-gold/10 px-2 py-0.5 rounded border border-seal-gold/30">
                {currentCase.year}
              </span>
            </h1>
          </div>
        </div>

        {/* Center / Right Tool Navigation Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Evidence Board Shortcut */}
          <button
            onClick={() => {
              sound.playPaper();
              setActiveView('EVIDENCE_BOARD');
            }}
            className="px-3 py-1.5 rounded bg-detective-800 hover:bg-detective-750 border border-seal-gold/50 text-seal-gold hover:text-white font-mono text-xs flex items-center space-x-1.5 shadow-sm transition"
            title="Buka Papan Investigasi Hubungan Bukti"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Papan Investigasi</span>
            {progress.boardConnections.length > 0 && (
              <span className="bg-seal-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {progress.boardConnections.length}
              </span>
            )}
          </button>

          {/* Evidence Archive Modal */}
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('ARCHIVE');
            }}
            className="px-3 py-1.5 rounded bg-detective-850 hover:bg-detective-800 border border-parchment-700/60 text-parchment-200 font-mono text-xs flex items-center space-x-1.5 shadow-sm transition"
            title="Buka Arsip Seluruh Bukti yang Dikumpulkan"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            <span>Arsip Bukti</span>
            <span className="bg-parchment-800 text-parchment-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {foundEvidences}/{totalEvidences}
            </span>
          </button>

          {/* Timeline Puzzle Modal */}
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('TIMELINE');
            }}
            className="px-3 py-1.5 rounded bg-detective-850 hover:bg-detective-800 border border-parchment-700/60 text-parchment-200 font-mono text-xs flex items-center space-x-1.5 shadow-sm transition"
            title="Susun Kronologi Peristiwa"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Kronologi</span>
            {progress.solvedPuzzleIds.includes('timeline-puzzle') && (
              <span className="text-emerald-400 text-xs">✓</span>
            )}
          </button>

          {/* Role Matching Puzzle Modal */}
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('MATCHING');
            }}
            className="px-3 py-1.5 rounded bg-detective-850 hover:bg-detective-800 border border-parchment-700/60 text-parchment-200 font-mono text-xs flex items-center space-x-1.5 shadow-sm transition"
            title="Cocokkan Profil & Peran Tokoh Sejarah"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Peran Tokoh</span>
            {progress.solvedPuzzleIds.includes('matching-puzzle') && (
              <span className="text-emerald-400 text-xs">✓</span>
            )}
          </button>

          {/* Detective Notes Modal */}
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('NOTES');
            }}
            className="px-3 py-1.5 rounded bg-detective-850 hover:bg-detective-800 border border-parchment-700/60 text-parchment-200 font-mono text-xs flex items-center space-x-1.5 shadow-sm transition"
            title="Buku Catatan Detektif"
          >
            <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
            <span>Catatan</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={() => {
              const h = requestHint();
              alert(`[PETUNJUK DETEKTIF TINGKAT ${h.level}]\n\n${h.hintText}`);
            }}
            className="px-2.5 py-1.5 rounded bg-detective-900 hover:bg-detective-800 border border-amber-600/40 text-amber-300 font-mono text-xs flex items-center space-x-1"
            title="Minta Petunjuk Koordinator Nara"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hint ({3 - progress.hintsUsedCount})</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded bg-detective-900 border border-parchment-800 text-parchment-400 hover:text-parchment-200"
            title={isMuted ? "Bunyikan Audio" : "Bisukan Audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Scene Navigation Sub-Header */}
      <nav className="bg-detective-950 border-b border-parchment-900/60 px-4 py-2 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-parchment-500 mr-2 flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-seal-red" /> Lokasi:
          </span>
          {currentCase.scenes.map((scene, idx) => {
            const isActive = activeSceneIndex === idx;
            // Count examined in this scene
            const examinedCount = scene.objects.filter(o => progress.examinedObjectIds.includes(o.id)).length;
            const totalObjects = scene.objects.length;

            return (
              <button
                key={scene.id}
                onClick={() => {
                  sound.playClick();
                  setActiveSceneIndex(idx);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center space-x-2 border whitespace-nowrap ${
                  isActive
                    ? 'bg-parchment-100 text-detective-950 font-bold border-parchment-200 shadow-sm'
                    : 'bg-detective-900 text-parchment-400 hover:text-parchment-200 border-parchment-800/50'
                }`}
              >
                <span>{idx + 1}. {scene.title}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${isActive ? 'bg-detective-900 text-parchment-100' : 'bg-detective-950 text-parchment-500'}`}>
                  {examinedCount}/{totalObjects}
                </span>
              </button>
            );
          })}
        </div>

        {/* Final Deduction Call to Action Button */}
        <div>
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('DEDUCTION');
            }}
            className="px-4 py-1.5 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider shadow-paper transition flex items-center space-x-1.5 border border-red-500/50"
          >
            <Award className="w-3.5 h-3.5" />
            <span>BUAT KESIMPULAN KASUS</span>
          </button>
        </div>
      </nav>

      {/* Main Exploration Room Canvas */}
      <main className="relative flex-1 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[460px]">
        {/* Background scene atmospheric box */}
        <div className="relative w-full max-w-5xl h-[460px] sm:h-[500px] rounded-xl border-4 border-parchment-800/80 bg-gradient-to-b from-detective-900 via-detective-850 to-detective-950 shadow-dossier overflow-hidden flex flex-col justify-between p-6">
          
          {/* Subtle vintage texture overlay */}
          <div className="absolute inset-0 bg-cork-texture opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

          {/* Scene Header inside canvas */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-parchment-800/60 max-w-lg">
              <span className="font-mono text-[10px] text-seal-gold uppercase tracking-widest block">
                {activeScene.subtitle}
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-parchment-100">
                {activeScene.title}
              </h2>
              <p className="text-xs font-serif text-parchment-400 mt-0.5 line-clamp-2">
                {activeScene.description}
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-parchment-800 text-[11px] font-mono text-parchment-300 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-seal-gold" />
              <span>Cari & Klik Objek yang Berkedip</span>
            </div>
          </div>

          {/* Interactive Object Hotspots placed in space */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {activeScene.objects.map((obj) => {
              const isExamined = progress.examinedObjectIds.includes(obj.id);
              const givesEvidence = !!obj.givesEvidenceId;
              const hasEvidenceFound = obj.givesEvidenceId && progress.foundEvidenceIds.includes(obj.givesEvidenceId);

              return (
                <div
                  key={obj.id}
                  style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <button
                    onClick={() => handleObjectClick(obj)}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    {/* Pulsing Target Ring */}
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-12 h-12 rounded-full animate-ping opacity-75 ${
                        isExamined ? 'bg-emerald-500/20' : 'bg-amber-400/40'
                      }`} />
                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 ${
                        isExamined
                          ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                          : 'bg-detective-900/90 border-amber-400 text-amber-200'
                      }`}>
                        {getObjectIcon(obj.iconType)}
                      </div>

                      {/* Small badge if evidence found */}
                      {hasEvidenceFound && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Object Label Tooltip */}
                    <div className="mt-2 px-2.5 py-1 rounded bg-black/85 border border-parchment-800 text-parchment-200 text-xs font-mono whitespace-nowrap shadow-md group-hover:border-seal-gold transition flex items-center space-x-1.5">
                      <span>{obj.name}</span>
                      {isExamined && <span className="text-emerald-400 text-[10px]">(Tercatat)</span>}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Scene hint / ambient stamp */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-parchment-500">
            <span>Area Investigasi: {activeScene.title}</span>
            <span>Kasus ID: {currentCase.code}</span>
          </div>
        </div>
      </main>

      {/* Bottom Mission Checklist & Progress HUD */}
      <footer className="bg-detective-900 border-t border-parchment-800/60 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <span className="text-parchment-500">Bukti Ditemukan:</span>
            <div className="flex items-center space-x-1.5">
              <div className="w-24 sm:w-32 bg-detective-950 rounded-full h-2.5 border border-parchment-800 overflow-hidden">
                <div 
                  className="bg-seal-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${(foundEvidences / totalEvidences) * 100}%` }}
                />
              </div>
              <span className="font-bold text-parchment-200">{foundEvidences}/{totalEvidences}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-parchment-500">Hubungan di Papan:</span>
            <span className="font-bold text-seal-gold">{progress.boardConnections.length} tautan</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-parchment-500">Teka-Teki Selesai:</span>
            <span className="font-bold text-emerald-400">{solvedPuzzles}/3</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.playPaper();
              setActiveModal('DEDUCTION');
            }}
            className="text-xs font-mono text-seal-gold hover:text-white underline underline-offset-4 decoration-seal-gold"
          >
            Siap untuk Menjawab Pertanyaan Pokok Kasus? →
          </button>
        </div>
      </footer>

      {/* Inspecting Object Modal / Drawer */}
      {inspectingObject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-xl bg-parchment-100 text-detective-900 rounded-lg p-6 shadow-dossier border-4 border-parchment-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-detective-900/20 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-detective-900 text-parchment-100 flex items-center justify-center">
                  {getObjectIcon(inspectingObject.iconType)}
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-seal-red">
                    Pemeriksaan Objek • {inspectingObject.area}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-detective-950">
                    {inspectingObject.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setInspectingObject(null);
                }}
                className="text-xs font-mono font-bold px-2 py-1 border border-detective-400 rounded hover:bg-detective-900 hover:text-white transition"
              >
                TUTUP [ESC]
              </button>
            </div>

            {/* Description */}
            <div className="space-y-3 font-serif text-sm text-detective-800 leading-relaxed">
              <p className="italic text-detective-600 border-l-2 border-parchment-400 pl-3">
                {inspectingObject.description}
              </p>

              <div className="p-3.5 bg-white/80 rounded border border-parchment-300">
                <span className="font-mono text-[11px] font-bold uppercase text-seal-red block mb-1">
                  Hasil Pemeriksaan Forensik Sejarah:
                </span>
                <p>{inspectingObject.detailedInspection}</p>
              </div>

              {/* If it unlocked evidence */}
              {inspectingObject.givesEvidenceId && (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-900 block">
                        Bukti Ditambahkan ke Evidence Archive!
                      </span>
                      <span className="text-xs text-emerald-700">
                        {currentCase.evidences.find(e => e.id === inspectingObject.givesEvidenceId)?.title}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const ev = currentCase.evidences.find(e => e.id === inspectingObject.givesEvidenceId);
                      if (ev) inspectEvidence(ev);
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-700 text-white font-mono text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    Buka Arsip Bukti
                  </button>
                </div>
              )}

              {/* If it triggers cipher */}
              {inspectingObject.triggersPuzzleId === 'cipher-rengasdengklok' && (
                <div className="p-3 bg-amber-50 rounded border border-amber-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-900 block">
                        Peti Terkunci Gembok Sandi PETA
                      </span>
                      <span className="text-xs text-amber-700">
                        Pecahkan kode 4 angka untuk membuka catatan komando.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setInspectingObject(null);
                      setActiveModal('CIPHER');
                    }}
                    className="px-3 py-1.5 rounded bg-amber-800 text-white font-mono text-xs font-bold hover:bg-amber-900 transition"
                  >
                    Buka Gembok
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t-2 border-detective-900/20 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setInspectingObject(null);
                }}
                className="px-4 py-2 rounded bg-detective-900 text-parchment-100 font-mono text-xs font-bold tracking-wider hover:bg-detective-800 transition"
              >
                SELESAI MEMERIKSA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
