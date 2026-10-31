import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  FolderLock, 
  FolderCheck, 
  ArrowLeft, 
  Calendar, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  Play,
  Lock
} from 'lucide-react';
import { HistoricalCase } from '../types';

export const CaseSelectModal: React.FC = () => {
  const { allCases, startNewCase, setActiveView } = useGame();
  const [selectedCase, setSelectedCase] = useState<HistoricalCase>(allCases[0]);

  return (
    <div className="min-h-screen bg-detective-950 text-parchment-100 p-4 sm:p-8 flex flex-col justify-between">
      {/* Top bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-parchment-800/60 pb-4">
        <button
          onClick={() => {
            sound.playPaper();
            setActiveView('TITLE');
          }}
          className="flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-parchment-100 px-3 py-1.5 rounded border border-parchment-800 bg-detective-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE MEJA DEPAN</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono text-seal-gold uppercase tracking-widest">
            Katalog Berkas Rahasia
          </span>
          <p className="text-[11px] text-parchment-400 font-mono">
            Pilih arsip sejarah untuk memulai penyelidikan
          </p>
        </div>
      </div>

      {/* Main Grid: Cases list + Case Dossier Detail */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-start">
        {/* Left side: Case Cards List (5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-parchment-400 mb-2 flex items-center space-x-2">
            <FolderLock className="w-4 h-4 text-seal-gold" />
            <span>Daftar Berkas Perkara Sejarah ({allCases.length})</span>
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
            {allCases.map((c, idx) => {
              const isSelected = selectedCase.id === c.id;
              const isLocked = c.isLocked;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCase(c);
                  }}
                  className={`p-4 rounded border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-detective-800 border-seal-gold/80 shadow-paper'
                      : isLocked
                      ? 'bg-detective-950/70 border-parchment-900/40 opacity-75 hover:opacity-90'
                      : 'bg-detective-900 border-parchment-800/60 hover:border-parchment-700'
                  }`}
                >
                  {/* Decorative stamp on top right */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-parchment-400 bg-detective-950 px-2 py-0.5 rounded border border-parchment-800">
                          {c.code}
                        </span>
                        <span className="flex items-center text-[10px] text-seal-gold font-mono">
                          <Calendar className="w-3 h-3 mr-1" />
                          {c.year}
                        </span>
                      </div>
                      <h4 className="mt-1 font-serif font-bold text-sm sm:text-base text-parchment-100">
                        {c.title}
                      </h4>
                      <p className="text-xs text-parchment-400 line-clamp-1 mt-0.5 font-serif italic">
                        {c.subtitle}
                      </p>
                    </div>

                    <div className="text-right pl-2">
                      {isLocked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-black/40 border border-parchment-800/50 text-[10px] font-mono text-parchment-500">
                          <Lock className="w-3 h-3 mr-1 text-parchment-600" />
                          Terkunci
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-mono text-emerald-400">
                          <FolderCheck className="w-3 h-3 mr-1 text-emerald-400" />
                          Tersedia
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-parchment-500 border-t border-parchment-800/30 pt-2">
                    <span>Tingkat: <span className="text-parchment-300">{c.difficulty}</span></span>
                    <span>Kasus #{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Detailed Folder / Dossier View (7 columns) */}
        <div className="lg:col-span-7 bg-parchment-100 text-detective-900 rounded-lg p-6 sm:p-8 shadow-dossier border-4 border-parchment-300 relative min-h-[500px] flex flex-col justify-between">
          {/* Top Paper Tab & Stamps */}
          <div>
            <div className="flex items-center justify-between border-b-2 border-detective-900/20 pb-4 mb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-seal-red">
                  Arsip Nasional • Kode: {selectedCase.code}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-detective-950 mt-1">
                  {selectedCase.title}
                </h2>
                <p className="text-xs font-serif italic text-detective-700">
                  {selectedCase.subtitle}
                </p>
              </div>

              {/* Red Stamp */}
              <div className="transform rotate-3 border-2 border-seal-red text-seal-red px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase rounded">
                {selectedCase.isLocked ? 'TERBATAS' : 'SIAP DISELIDIKI'}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 font-serif text-sm text-detective-800 leading-relaxed">
              <div className="p-3 bg-parchment-200/70 rounded border border-parchment-300">
                <span className="font-mono text-[11px] font-bold uppercase text-detective-600 block mb-1">
                  Ringkasan Masalah:
                </span>
                <p>{selectedCase.summary}</p>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold uppercase text-detective-600 block mb-1">
                  Pertanyaan Pokok Investigasi:
                </span>
                <p className="italic font-bold text-detective-950 border-l-2 border-seal-red pl-3 py-1 bg-parchment-200/40">
                  “{selectedCase.mainQuestion}”
                </p>
              </div>

              {/* Learning Goals */}
              {selectedCase.learningGoals && selectedCase.learningGoals.length > 0 && (
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase text-detective-600 block mb-1.5 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-seal-gold" />
                    <span>Tujuan Pembelajaran Sejarah:</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-detective-700">
                    {selectedCase.learningGoals.map((g, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action inside folder */}
          <div className="mt-8 pt-4 border-t-2 border-detective-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-detective-600">
              <span>Tahun Kejadian: <strong>{selectedCase.year}</strong></span>
              <span className="mx-2">•</span>
              <span>Kesulitan: <strong>{selectedCase.difficulty}</strong></span>
            </div>

            {selectedCase.isLocked ? (
              <div className="flex items-center space-x-2 text-xs font-mono text-seal-red bg-seal-red/10 px-4 py-2 rounded border border-seal-red/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Selesaikan Kasus 01 terlebih dahulu untuk mendeskripsi berkas ini.</span>
              </div>
            ) : (
              <button
                onClick={() => startNewCase(selectedCase.id)}
                className="w-full sm:w-auto px-6 py-3 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider shadow-paper transition flex items-center justify-center space-x-2 border border-red-900"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>BUKA MAP KASUS & BRIEFING</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="w-full max-w-6xl mx-auto border-t border-parchment-800/40 pt-4 text-center text-xs font-mono text-parchment-500">
        Unit Investigasi Arsip Jejak Nusantara • Hak Cipta Fakta Sejarah Dilindungi
      </div>
    </div>
  );
};
