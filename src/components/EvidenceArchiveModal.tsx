import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  FolderArchive, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { EvidenceCategory, EvidenceItem } from '../types';

export const EvidenceArchiveModal: React.FC = () => {
  const { currentCase, progress, setActiveModal, selectedEvidenceForDetail, inspectEvidence } = useGame();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'LIST' | 'DETAIL'>(selectedEvidenceForDetail ? 'DETAIL' : 'LIST');
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem | null>(selectedEvidenceForDetail || null);

  const foundEvidences = currentCase.evidences.filter(e => progress.foundEvidenceIds.includes(e.id));

  const filteredEvidences = filterCategory === 'ALL'
    ? foundEvidences
    : foundEvidences.filter(e => e.category === filterCategory);

  const categories: EvidenceCategory[] = ['DOKUMEN', 'KORAN & TELEGRAM', 'PETA', 'FOTO SEJARAH', 'PROFIL TOKOH', 'KESAKSIAN'];

  const handleSelectEvidence = (ev: EvidenceItem) => {
    sound.playPaper();
    setActiveEvidence(ev);
    setActiveTab('DETAIL');
  };

  const getStampClass = (status: EvidenceItem['sourceStatus']) => {
    switch (status) {
      case 'SUMBER SEJARAH RESMI':
        return 'border-emerald-600 text-emerald-700 bg-emerald-50';
      case 'REKONSTRUKSI UNTUK GAME':
        return 'border-blue-600 text-blue-700 bg-blue-50';
      default:
        return 'border-amber-600 text-amber-700 bg-amber-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-parchment-300 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-4 border-b-2 border-detective-900/20 bg-parchment-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-detective-900 text-seal-gold flex items-center justify-center shadow-sm">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-red tracking-wider">
                Departemen Arsip & Dokumentasi • {currentCase.code}
              </span>
              <h2 className="text-xl font-serif font-black text-detective-950">
                Evidence Archive (Arsip Bukti Sejarah)
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center bg-parchment-300/60 rounded px-2.5 py-1 text-xs font-mono text-detective-800">
              <span>Terkumpul: <strong>{foundEvidences.length}</strong> dari {currentCase.evidences.length}</span>
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
          </div>
        </header>

        {/* View Switcher Tabs & Category Filter */}
        <div className="px-6 py-2.5 bg-parchment-200/30 border-b border-parchment-300 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('LIST');
              }}
              className={`px-3 py-1 rounded font-bold transition ${
                activeTab === 'LIST'
                  ? 'bg-detective-900 text-white'
                  : 'bg-parchment-200 text-detective-700 hover:bg-parchment-300'
              }`}
            >
              Daftar Bukti ({foundEvidences.length})
            </button>
            <button
              disabled={!activeEvidence}
              onClick={() => {
                sound.playClick();
                setActiveTab('DETAIL');
              }}
              className={`px-3 py-1 rounded font-bold transition ${
                activeTab === 'DETAIL'
                  ? 'bg-detective-900 text-white'
                  : !activeEvidence
                  ? 'opacity-50 cursor-not-allowed bg-parchment-200 text-detective-400'
                  : 'bg-parchment-200 text-detective-700 hover:bg-parchment-300'
              }`}
            >
              Baca Dokumen Lengkap
            </button>
          </div>

          {activeTab === 'LIST' && (
            <div className="flex items-center space-x-1 overflow-x-auto py-1">
              <span className="text-[10px] text-detective-600 uppercase font-bold mr-1">Filter:</span>
              <button
                onClick={() => setFilterCategory('ALL')}
                className={`px-2 py-0.5 rounded text-[10px] ${filterCategory === 'ALL' ? 'bg-seal-red text-white font-bold' : 'bg-parchment-200 text-detective-700'}`}
              >
                Semua
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap ${filterCategory === cat ? 'bg-seal-red text-white font-bold' : 'bg-parchment-200 text-detective-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'LIST' ? (
            <div>
              {filteredEvidences.length === 0 ? (
                <div className="text-center py-16">
                  <FolderArchive className="w-12 h-12 text-parchment-400 mx-auto mb-3" />
                  <p className="font-serif text-detective-600 text-sm italic">
                    Belum ada bukti dengan kategori ini yang ditemukan.
                  </p>
                  <p className="text-xs font-mono text-detective-500 mt-1">
                    Jelajahi objek di ruang investigasi untuk menambah koleksi berkas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvidences.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => handleSelectEvidence(ev)}
                      className="p-4 rounded-lg bg-white/80 border-2 border-parchment-300 hover:border-seal-gold transition-shadow hover:shadow-paper cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold text-seal-red bg-seal-red/10 px-2 py-0.5 rounded">
                            {ev.id.toUpperCase()}
                          </span>
                          <span className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getStampClass(ev.sourceStatus)}`}>
                            {ev.sourceStatus}
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-sm text-detective-950 line-clamp-2">
                          {ev.title}
                        </h4>
                        <p className="font-serif text-xs text-detective-700 mt-1 line-clamp-3 leading-relaxed">
                          {ev.shortDesc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-parchment-200 flex items-center justify-between text-[11px] font-mono text-detective-500">
                        <span>{ev.dateOrEra}</span>
                        <span className="text-seal-red font-bold flex items-center space-x-1">
                          <span>Buka Berkas</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // DETAIL VIEW FOR ACTIVE EVIDENCE
            activeEvidence && (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Official Stamp & Category header */}
                <div className="flex items-start justify-between border-b-2 border-detective-900/20 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-seal-red uppercase tracking-wider block">
                      Kode Registrasi: {activeEvidence.id.toUpperCase()} • Kategori: {activeEvidence.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-detective-950 mt-1">
                      {activeEvidence.title}
                    </h3>
                  </div>

                  {/* Stamp badge */}
                  <div className={`px-3 py-1 rounded border-2 font-mono text-xs font-bold uppercase tracking-wider text-center rotate-2 ${getStampClass(activeEvidence.sourceStatus)}`}>
                    {activeEvidence.sourceStatus}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-parchment-200/60 rounded border border-parchment-300 text-xs font-mono text-detective-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-seal-gold" />
                    <div>
                      <span className="block text-[10px] text-detective-500 uppercase">Waktu/Era:</span>
                      <strong>{activeEvidence.dateOrEra}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-seal-gold" />
                    <div>
                      <span className="block text-[10px] text-detective-500 uppercase">Lokasi:</span>
                      <strong>{activeEvidence.location}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                    <Users className="w-4 h-4 text-seal-gold" />
                    <div>
                      <span className="block text-[10px] text-detective-500 uppercase">Entitas Terkait:</span>
                      <strong className="truncate block max-w-[150px]">{activeEvidence.relatedEntities.join(', ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Full Historical Text */}
                <div className="p-5 bg-white/95 rounded-lg border-2 border-detective-900/20 shadow-sm space-y-3 font-serif text-sm sm:text-base text-detective-900 leading-relaxed">
                  <span className="font-mono text-xs font-bold uppercase text-seal-red block border-b border-detective-900/10 pb-1">
                    Transkrip & Analisis Isi Dokumen:
                  </span>
                  <p>{activeEvidence.fullDesc}</p>
                </div>

                {/* Key Historical Insights / Highlights */}
                {activeEvidence.highlightDetails && activeEvidence.highlightDetails.length > 0 && (
                  <div className="p-4 bg-parchment-200/80 rounded border border-parchment-400 space-y-2">
                    <span className="font-mono text-xs font-bold uppercase text-detective-900 block flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-seal-red" />
                      <span>Fakta Kunci yang Perlu Dicatat Detektif:</span>
                    </span>
                    <ul className="space-y-1.5 text-xs font-serif text-detective-800">
                      {activeEvidence.highlightDetails.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-seal-red font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Academic Citation & Origin */}
                <div className="p-3 bg-detective-900 text-parchment-200 rounded border border-parchment-800 text-xs font-mono space-y-1">
                  <span className="text-seal-gold text-[10px] uppercase font-bold block flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Sumber Rujukan Sejarah Terverifikasi:</span>
                  </span>
                  <p className="font-serif italic text-parchment-300">
                    {activeEvidence.sourceReference}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t-2 border-detective-900/20 bg-parchment-200/50 flex items-center justify-between text-xs font-mono text-detective-600">
          <span>Semua dokumen sejarah berstatus resmi mengacu pada catatan autentik arsip kemerdekaan.</span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="px-4 py-1.5 rounded bg-detective-900 text-white font-mono font-bold hover:bg-detective-850"
          >
            TUTUP ARSIP
          </button>
        </footer>
      </div>
    </div>
  );
};
