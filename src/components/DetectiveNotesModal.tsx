import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  FileEdit, 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  BookMarked,
  Save
} from 'lucide-react';

export const DetectiveNotesModal: React.FC = () => {
  const { progress, addNote, deleteNote, setActiveModal } = useGame();

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addNote(newTitle.trim() || 'Catatan Pribadi', newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-parchment-300 flex flex-col h-[85vh] max-h-[700px] overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-4 border-b-2 border-detective-900/20 bg-parchment-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-detective-900 text-emerald-400 flex items-center justify-center shadow-sm">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-red tracking-wider">
                Buku Saku Lapangan Detektif
              </span>
              <h2 className="text-xl font-serif font-black text-detective-950">
                Detective Notes (Catatan Penyelidikan)
              </h2>
            </div>
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
        </header>

        {/* Action bar */}
        <div className="px-6 py-2.5 bg-parchment-200/40 border-b border-parchment-300 flex items-center justify-between">
          <span className="font-mono text-xs text-detective-700">
            Total Entri: <strong>{progress.notes.length}</strong> catatan
          </span>

          <button
            onClick={() => {
              sound.playClick();
              setIsAdding(!isAdding);
            }}
            className="px-3 py-1 rounded bg-detective-900 text-parchment-100 font-mono text-xs font-bold flex items-center space-x-1.5 hover:bg-detective-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Batal Tambah' : 'Tulis Catatan Baru'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* New Note Form */}
          {isAdding && (
            <form onSubmit={handleCreateNote} className="p-4 bg-white rounded-lg border-2 border-seal-gold shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-parchment-200 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-seal-red">
                  Tulis Hipotesis / Bukti Baru
                </span>
                <span className="text-[10px] font-mono text-detective-500">
                  Akan tersimpan ke buku saku
                </span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Judul Catatan (misal: Kecurigaan terhadap Sikap Nishimura)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded border border-parchment-300 font-serif text-xs text-detective-950 focus:border-seal-gold outline-none"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Uraikan temuan, fakta tanggal, atau korelasi antartokoh..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2 rounded border border-parchment-300 font-serif text-xs text-detective-950 focus:border-seal-gold outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded border border-parchment-400 font-mono text-xs text-detective-700 hover:bg-parchment-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-seal-red text-white font-mono text-xs font-bold tracking-wider hover:bg-seal-redLight flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </form>
          )}

          {/* Notes list */}
          {progress.notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-2 shadow-sm relative ${
                note.isUserAdded
                  ? 'bg-amber-50/90 border-amber-300'
                  : 'bg-white/90 border-parchment-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-parchment-200 pb-1.5 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-seal-red bg-seal-red/10 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{note.timestamp}</span>
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-detective-950">
                    {note.title}
                  </h4>
                </div>

                {note.isUserAdded && (
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-detective-400 hover:text-red-600 transition p-1"
                    title="Hapus Catatan Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="font-serif text-xs sm:text-sm text-detective-800 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t-2 border-detective-900/20 bg-parchment-200/50 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal(null);
            }}
            className="px-4 py-2 rounded bg-detective-900 text-white font-mono text-xs font-bold hover:bg-detective-850"
          >
            TUTUP BUKU SAKU
          </button>
        </footer>
      </div>
    </div>
  );
};
