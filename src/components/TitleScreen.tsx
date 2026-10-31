import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  Compass, 
  FolderLock, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldAlert,
  Play,
  History,
  FileCheck
} from 'lucide-react';

export const TitleScreen: React.FC = () => {
  const { 
    startNewCase, 
    continueSavedCase, 
    hasSavedCase, 
    setActiveView, 
    setActiveModal, 
    isMuted, 
    toggleMute,
    isAmbientActive,
    toggleAmbient
  } = useGame();

  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden bg-detective-950 select-none">
      {/* Background vignette & atmospheric overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-detective-850 via-detective-950 to-black opacity-90 pointer-events-none" />
      
      {/* Decorative archival watermark stamp */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full border-8 border-parchment-700/10 flex items-center justify-center pointer-events-none rotate-12">
        <span className="font-mono text-parchment-700/15 text-2xl font-bold tracking-widest uppercase">
          Unit Arsip Jejak Nusantara • 1945
        </span>
      </div>
      
      <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full border-4 border-dashed border-parchment-700/10 pointer-events-none -rotate-45" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-parchment-800/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded border border-seal-gold/40 bg-detective-900 flex items-center justify-center text-seal-gold shadow-paper">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono tracking-widest text-parchment-400">
              Kementerian Arsip & Penyelidikan Sejarah
            </h2>
            <p className="text-[10px] text-parchment-500 font-mono">
              Divisi Rahasia Deklasifikasi Fakta Kemerdekaan
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAmbient}
            title={isAmbientActive ? "Matikan Suasana Ruang Arsip" : "Nyalakan Suasana Ruang Arsip"}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-2 border transition ${
              isAmbientActive 
                ? 'bg-seal-red/20 border-seal-red text-parchment-200' 
                : 'bg-detective-900 border-parchment-800/50 text-parchment-400 hover:text-parchment-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAmbientActive ? 'text-seal-gold animate-spin' : ''}`} />
            <span className="hidden sm:inline">Suasana Vintage: {isAmbientActive ? 'Aktif' : 'Nonaktif'}</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded bg-detective-900 border border-parchment-800/50 text-parchment-400 hover:text-parchment-200 transition"
            title={isMuted ? "Aktifkan Efek Suara" : "Bisukan Efek Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('SETTINGS');
            }}
            className="p-2 rounded bg-detective-900 border border-parchment-800/50 text-parchment-400 hover:text-parchment-200 transition"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero & Title Centerpiece */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center my-auto py-8">
        {/* Classified Seal Stamp */}
        <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded border border-seal-red/70 bg-seal-red/10 text-seal-red text-xs font-mono font-bold tracking-widest uppercase animate-fade-in shadow-stamp">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Berkas Investigasi Sejarah Deklasifikasi • Tingkat I</span>
        </div>

        {/* Grand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-wider text-parchment-100 drop-shadow-md">
          JEJAK NUSANTARA
        </h1>

        {/* Subtitle / Tagline */}
        <div className="mt-2 flex items-center justify-center space-x-3 text-parchment-300">
          <div className="h-[1px] w-12 bg-seal-gold/40" />
          <p className="font-mono text-sm sm:text-base tracking-widest text-parchment-300 italic">
            “Setiap Sejarah Menyimpan Petunjuk.”
          </p>
          <div className="h-[1px] w-12 bg-seal-gold/40" />
        </div>

        <p className="max-w-xl mt-6 text-sm sm:text-base text-parchment-400 font-serif leading-relaxed">
          Pecahkan teka-teki nyata di balik peristiwa genting kemerdekaan Indonesia.
          Telusuri dokumen otentik, hubungkan bukti di papan detektif, dan singkap kebenaran sejarah bangsa.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          {hasSavedCase ? (
            <button
              onClick={continueSavedCase}
              className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono font-bold text-sm tracking-wider shadow-paper transition flex items-center justify-center space-x-2 border border-red-500/40 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LANJUTKAN KASUS</span>
            </button>
          ) : (
            <button
              onClick={() => startNewCase('case-01')}
              className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono font-bold text-sm tracking-wider shadow-paper transition flex items-center justify-center space-x-2 border border-red-500/40 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>MULAI INVESTIGASI</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playPaper();
              setActiveView('CASE_SELECT');
            }}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded bg-detective-850 hover:bg-detective-800 text-parchment-200 border border-parchment-700/50 font-mono text-sm tracking-wider shadow-paper transition flex items-center justify-center space-x-2 hover:border-parchment-500"
          >
            <FolderLock className="w-4 h-4 text-seal-gold" />
            <span>ARSIP KASUS</span>
          </button>
        </div>

        {/* Secondary Auxiliary Buttons */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs font-mono text-parchment-400">
          <button
            onClick={() => {
              sound.playPaper();
              setShowGuideModal(true);
            }}
            className="flex items-center space-x-1.5 hover:text-seal-gold transition underline underline-offset-4 decoration-parchment-700"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buku Panduan Detektif</span>
          </button>

          <span className="text-parchment-700">•</span>

          <button
            onClick={() => {
              sound.playClick();
              startNewCase('case-01');
            }}
            className="flex items-center space-x-1.5 hover:text-seal-gold transition underline underline-offset-4 decoration-parchment-700"
          >
            <History className="w-3.5 h-3.5" />
            <span>Mulai Kasus Baru</span>
          </button>
        </div>
      </main>

      {/* Atmospheric Desk Details at Bottom */}
      <footer className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between border-t border-parchment-800/40 pt-4 text-xs font-mono text-parchment-500">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-500/80" />
          <span>Fakta Sejarah Diverifikasi • ANRI, Notosusanto, Hatta (1970) & Ricklefs</span>
        </div>
        <div className="mt-2 sm:mt-0 text-center sm:text-right">
          <span>Versi 2.0 • Arsip Investigasi Jejak Nusantara</span>
        </div>
      </footer>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-detective-900 border-2 border-parchment-700/60 rounded-lg p-6 sm:p-8 shadow-dossier max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-seal-gold">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-parchment-100">
                  Pedoman Lapangan Penyelidik Sejarah
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGuideModal(false);
                }}
                className="text-parchment-400 hover:text-white font-mono text-sm px-2 py-1 border border-parchment-800 rounded"
              >
                TUTUP [ESC]
              </button>
            </div>

            <div className="space-y-4 text-sm font-serif text-parchment-300 leading-relaxed">
              <div className="p-3 bg-detective-850 rounded border border-parchment-800/60">
                <h4 className="font-bold text-parchment-100 font-mono text-xs uppercase tracking-wider text-seal-gold mb-1">
                  1. Eksplorasi & Pengumpulan Bukti
                </h4>
                <p>
                  Periksa setiap sudut ruang investigasi. Klik objek yang mencurigakan (dokumen, radio, foto, brankas). Bukti yang ditemukan akan otomatis tercatat di <strong>Evidence Archive</strong> dengan label keaslian sumber.
                </p>
              </div>

              <div className="p-3 bg-detective-850 rounded border border-parchment-800/60">
                <h4 className="font-bold text-parchment-100 font-mono text-xs uppercase tracking-wider text-seal-gold mb-1">
                  2. Evidence Board (Papan Investigasi)
                </h4>
                <p>
                  Gunakan papan gabus investigasi untuk menarik benang merah kausalitas antarbukti. Hubungan yang tepat akan membuka pemahaman mendalam mengenai motif para tokoh sejarah.
                </p>
              </div>

              <div className="p-3 bg-detective-850 rounded border border-parchment-800/60">
                <h4 className="font-bold text-parchment-100 font-mono text-xs uppercase tracking-wider text-seal-gold mb-1">
                  3. Teka-Teki Kronologi & Sandi
                </h4>
                <p>
                  Susun kartu garis waktu sesuai urutan peristiwa yang sebenarnya dan pecahkan gembok sandi menggunakan informasi tanggal atau jam bersejarah yang Anda temukan di dokumen.
                </p>
              </div>

              <div className="p-3 bg-detective-850 rounded border border-parchment-800/60">
                <h4 className="font-bold text-parchment-100 font-mono text-xs uppercase tracking-wider text-seal-gold mb-1">
                  4. Deduksi Akhir & Evaluasi Kasus
                </h4>
                <p>
                  Setelah bukti lengkap, rumuskan kesimpulan atas misteri sejarah kasus dan pilih bukti pendukung. Nilai akhir Anda akan didasarkan pada ketepatan analisis, kelengkapan arsip, dan minimnya penggunaan petunjuk.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-parchment-800/60 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGuideModal(false);
                }}
                className="px-5 py-2 rounded bg-seal-red text-white font-mono text-xs font-bold tracking-wider hover:bg-seal-redLight transition"
              >
                SAYA MENGERTI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
