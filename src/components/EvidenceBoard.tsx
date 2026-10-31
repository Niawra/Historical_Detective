import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  ArrowLeft, 
  Share2, 
  Pin, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Plus, 
  Sparkles,
  Eye,
  BookOpen
} from 'lucide-react';
import { EvidenceItem } from '../types';

export const EvidenceBoard: React.FC = () => {
  const { 
    currentCase, 
    progress, 
    connectEvidenceOnBoard, 
    removeEvidenceConnection, 
    setActiveView,
    inspectEvidence
  } = useGame();

  const [selectedFromId, setSelectedFromId] = useState<string>('');
  const [selectedToId, setSelectedToId] = useState<string>('');
  const [selectedRelation, setSelectedRelation] = useState<string>('Memicu Peristiwa Terkait');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // Available evidences found by player
  const foundEvidences = currentCase.evidences.filter(e => progress.foundEvidenceIds.includes(e.id));

  // Pre-set relation options
  const relationOptions = [
    'Memicu Aksi Revolusioner',
    'Menolak Ketergantungan PPKI',
    'Menyebabkan Keputusan Pengamanan',
    'Lokasi Perlindungan Nyata',
    'Kesepakatan Kembali ke Ibu Kota',
    'Memberikan Landasan Hukum',
    'Menghindari Benturan Fisik'
  ];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFromId || !selectedToId) {
      alert('Pilih kedua bukti yang ingin Anda hubungkan dengan benang merah.');
      return;
    }
    if (selectedFromId === selectedToId) {
      alert('Tidak dapat menghubungkan bukti dengan dirinya sendiri.');
      return;
    }

    const result = connectEvidenceOnBoard(selectedFromId, selectedToId, selectedRelation);
    setFeedbackMessage({
      text: result.explanation,
      isSuccess: result.success
    });
  };

  return (
    <div className="min-h-screen bg-detective-950 text-parchment-100 p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-parchment-800/60 pb-3">
        <button
          onClick={() => {
            sound.playPaper();
            setActiveView('INVESTIGATION');
          }}
          className="flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-parchment-100 px-3 py-1.5 rounded border border-parchment-800 bg-detective-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE MEJA PENYELIDIKAN</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <h2 className="font-serif font-bold text-sm sm:text-base text-parchment-100 flex items-center justify-end space-x-2">
              <Share2 className="w-4 h-4 text-seal-gold" />
              <span>Evidence Board (Papan Investigasi)</span>
            </h2>
            <p className="text-[10px] font-mono text-parchment-400">
              Hubungkan Benang Merah Kausalitas Antarbukti
            </p>
          </div>
        </div>
      </div>

      {/* Main Corkboard Area */}
      <div className="w-full max-w-6xl mx-auto my-4 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left: Connection Form & Connections List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Connection Builder Panel */}
          <div className="bg-detective-900 border border-parchment-800/80 rounded-lg p-5 shadow-paper">
            <h3 className="font-mono text-xs uppercase tracking-wider text-seal-gold flex items-center space-x-2 mb-3">
              <Plus className="w-4 h-4" />
              <span>Tautkan Hubungan Antarbukti</span>
            </h3>

            {foundEvidences.length < 2 ? (
              <div className="p-3 bg-detective-950 rounded border border-parchment-800/60 text-xs font-serif text-parchment-400">
                <AlertCircle className="w-4 h-4 text-amber-400 mb-1" />
                Anda memerlukan minimal 2 bukti yang ditemukan untuk mulai menarik benang merah di papan investigasi. Cari bukti di ruang-ruang penyelidikan terlebih dahulu.
              </div>
            ) : (
              <form onSubmit={handleConnect} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-parchment-400 mb-1">Bukti Asal (Penyebab/Konteks):</label>
                  <select
                    value={selectedFromId}
                    onChange={(e) => setSelectedFromId(e.target.value)}
                    className="w-full bg-detective-950 border border-parchment-700/60 rounded px-2.5 py-1.5 text-parchment-100 text-xs focus:border-seal-gold outline-none"
                  >
                    <option value="">-- Pilih Bukti 1 --</option>
                    {foundEvidences.map(e => (
                      <option key={e.id} value={e.id}>
                        [{e.id.toUpperCase()}] {e.title.slice(0, 36)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-parchment-400 mb-1">Kategori Hubungan:</label>
                  <select
                    value={selectedRelation}
                    onChange={(e) => setSelectedRelation(e.target.value)}
                    className="w-full bg-detective-950 border border-parchment-700/60 rounded px-2.5 py-1.5 text-parchment-100 text-xs focus:border-seal-gold outline-none"
                  >
                    {relationOptions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-parchment-400 mb-1">Bukti Tujuan (Dampak/Kelanjutan):</label>
                  <select
                    value={selectedToId}
                    onChange={(e) => setSelectedToId(e.target.value)}
                    className="w-full bg-detective-950 border border-parchment-700/60 rounded px-2.5 py-1.5 text-parchment-100 text-xs focus:border-seal-gold outline-none"
                  >
                    <option value="">-- Pilih Bukti 2 --</option>
                    {foundEvidences.map(e => (
                      <option key={e.id} value={e.id}>
                        [{e.id.toUpperCase()}] {e.title.slice(0, 36)}...
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition shadow-paper flex items-center justify-center space-x-1.5"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>PASANG BENANG HUBUNGAN</span>
                </button>
              </form>
            )}

            {/* Validation Feedback Toast inside panel */}
            {feedbackMessage && (
              <div className={`mt-3 p-3 rounded text-xs font-serif leading-relaxed border ${
                feedbackMessage.isSuccess 
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200' 
                  : 'bg-amber-950/70 border-amber-600/60 text-amber-200'
              }`}>
                <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold uppercase mb-1">
                  {feedbackMessage.isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Hubungan Sejarah Terverifikasi!</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Telaah Ulang Hubungan:</span>
                    </>
                  )}
                </div>
                <p>{feedbackMessage.text}</p>
              </div>
            )}
          </div>

          {/* Active Connections List */}
          <div className="bg-detective-900 border border-parchment-800/80 rounded-lg p-4 shadow-paper">
            <div className="flex items-center justify-between border-b border-parchment-800/60 pb-2 mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-parchment-300">
                Tautan Benang Aktif ({progress.boardConnections.length})
              </span>
              <span className="font-mono text-[10px] text-seal-gold">
                Target: {currentCase.validConnections.length} Valid
              </span>
            </div>

            {progress.boardConnections.length === 0 ? (
              <p className="text-xs font-serif text-parchment-500 italic py-2">
                Belum ada hubungan yang ditarik. Hubungkan dokumen radio, rapat pemuda, hingga jaminan Soebardjo.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {progress.boardConnections.map((conn, idx) => {
                  const evFrom = currentCase.evidences.find(e => e.id === conn.fromId);
                  const evTo = currentCase.evidences.find(e => e.id === conn.toId);

                  const isValid = currentCase.validConnections.some(
                    vc => (vc.fromId === conn.fromId && vc.toId === conn.toId) || (vc.fromId === conn.toId && vc.toId === conn.fromId)
                  );

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded border text-xs font-serif flex items-start justify-between gap-2 ${
                        isValid 
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-parchment-200' 
                          : 'bg-detective-850 border-parchment-800 text-parchment-300'
                      }`}
                    >
                      <div>
                        <div className="font-mono text-[10px] text-seal-red font-bold uppercase">
                          {conn.relationLabel}
                        </div>
                        <div className="text-xs text-parchment-200 mt-0.5 line-clamp-1">
                          <strong>{evFrom?.id.toUpperCase()}</strong> → <strong>{evTo?.id.toUpperCase()}</strong>
                        </div>
                        <div className="text-[11px] text-parchment-400 line-clamp-1">
                          {evFrom?.title.slice(0, 24)}... ↔ {evTo?.title.slice(0, 24)}...
                        </div>
                      </div>

                      <button
                        onClick={() => removeEvidenceConnection(conn.fromId, conn.toId)}
                        className="text-parchment-500 hover:text-red-400 p-1 transition"
                        title="Lepaskan Benang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: The Visual Corkboard with Pinned Cards (8 cols) */}
        <div className="lg:col-span-8 bg-[#5c4028] p-4 sm:p-6 rounded-xl border-8 border-[#3c2919] shadow-dossier relative min-h-[580px] overflow-hidden">
          {/* Cork texture & grid backdrop */}
          <div className="absolute inset-0 bg-cork-texture opacity-30 pointer-events-none" />

          {/* Board Title Banner Pin */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="bg-parchment-100 text-detective-900 px-4 py-1.5 rounded shadow-paper border-2 border-parchment-400 transform -rotate-1 inline-flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-seal-red border border-red-900 shadow-sm" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-detective-950">
                PAPAN HUBUNGAN FAKTA SEJARAH 1945
              </span>
            </div>

            <div className="bg-detective-950/80 backdrop-blur-sm text-parchment-300 px-3 py-1 rounded text-xs font-mono border border-parchment-700/60">
              Bukti Tersemat: {foundEvidences.length} / {currentCase.evidences.length}
            </div>
          </div>

          {/* Cards Grid on Corkboard */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {foundEvidences.map((ev, idx) => {
              // Check if connected
              const isConnected = progress.boardConnections.some(
                c => c.fromId === ev.id || c.toId === ev.id
              );

              return (
                <div
                  key={ev.id}
                  className={`relative p-3.5 rounded bg-parchment-100 text-detective-950 shadow-paper border-2 transition-transform hover:-translate-y-1 ${
                    isConnected ? 'border-seal-red ring-2 ring-seal-red/40' : 'border-parchment-300'
                  }`}
                >
                  {/* Push Pin on top center */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-seal-red border-2 border-red-950 shadow-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-300 rounded-full" />
                  </div>

                  {/* Header: ID & Category */}
                  <div className="flex items-center justify-between border-b border-detective-900/20 pb-1.5 mb-2 mt-1">
                    <span className="font-mono text-[10px] font-bold text-seal-red bg-seal-red/10 px-1.5 py-0.2 rounded">
                      {ev.id.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] text-detective-600 truncate max-w-[110px]">
                      {ev.category}
                    </span>
                  </div>

                  {/* Title & snippet */}
                  <h4 className="font-serif font-bold text-xs leading-snug line-clamp-2 text-detective-950 min-h-[32px]">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] font-serif text-detective-700 mt-1 line-clamp-3 leading-relaxed">
                    {ev.shortDesc}
                  </p>

                  {/* Footer inspection shortcut */}
                  <div className="mt-3 pt-2 border-t border-detective-900/15 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-detective-500">
                      {ev.dateOrEra}
                    </span>
                    <button
                      onClick={() => inspectEvidence(ev)}
                      className="text-[10px] font-mono text-seal-red font-bold hover:underline flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty slots for missing evidences */}
            {Array.from({ length: Math.max(0, currentCase.evidences.length - foundEvidences.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="p-4 rounded border-2 border-dashed border-parchment-700/40 bg-black/20 flex flex-col items-center justify-center text-center min-h-[140px]"
              >
                <div className="w-6 h-6 rounded-full border border-dashed border-parchment-600 flex items-center justify-center text-parchment-500 text-xs font-mono mb-1">
                  ?
                </div>
                <span className="font-mono text-[10px] text-parchment-400">
                  Arsip Belum Ditemukan
                </span>
                <span className="text-[9px] font-serif text-parchment-500 italic mt-0.5">
                  Periksa objek di ruang investigasi
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Board Notes */}
          <div className="relative z-10 mt-6 pt-3 border-t border-parchment-700/30 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-parchment-300">
            <span>Benang merah mewakili rangkaian sebab-akibat yang diverifikasi sejarah.</span>
            <span className="mt-1 sm:mt-0 font-bold text-seal-gold">
              Tautan Aktif: {progress.boardConnections.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
