import React, { useState } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { Award, CheckCircle2, Compass, AlertCircle, ArrowRight } from 'lucide-react';

export const FinalDeductionView: React.FC = () => {
  const { clues, submitDeduction } = useAdventure();

  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const options = [
    {
      id: 'opt-a',
      text: 'Pemberontakan kriminal bersenjata oleh kaum pemuda untuk menggulingkan kepemimpinan Soekarno-Hatta yang dicap bekerja sama dengan Jepang.',
      isCorrect: false
    },
    {
      id: 'opt-b',
      text: 'Tindakan pengamanan politik oleh Golongan Muda untuk menjauhkan Soekarno-Hatta dari intimidasi dan pengaruh militer Jepang di Jakarta, agar kemerdekaan diproklamasikan atas kekuatan bangsa sendiri di luar janji Jepang.',
      isCorrect: true
    },
    {
      id: 'opt-c',
      text: 'Perintah rahasia dari pihak berwenang militer Jepang untuk menyembunyikan Soekarno-Hatta dari kejaran tentara Sekutu yang baru mendarat.',
      isCorrect: false
    },
    {
      id: 'opt-d',
      text: 'Perjalanan dinas biasa anggota PPKI untuk beristirahat di pinggiran Karawang sebelum merumuskan undang-undang.',
      isCorrect: false
    }
  ];

  const toggleClue = (id: string) => {
    sound.playClick();
    setSelectedClueIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) {
      setErrorMsg('Pilih satu kesimpulan utama dari pilihan di bawah.');
      return;
    }
    if (selectedClueIds.length === 0) {
      setErrorMsg('Pilih minimal 1 petunjuk yang mendukung kesimpulan Anda.');
      return;
    }

    submitDeduction(selectedOptionId, selectedClueIds);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1b1510] border-2 border-seal-red rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-100 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-800 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-seal-red text-white flex items-center justify-center shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Lokasi 5 • Misteri Terungkap
            </span>
            <h3 className="font-serif font-black text-xl text-parchment-100">
              Deduksi Akhir: Peristiwa Rengasdengklok
            </h3>
          </div>
        </div>

        <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-700/50">
          Sidang Kesimpulan
        </span>
      </div>

      {/* Main Question Box */}
      <div className="p-4 bg-[#251c15] rounded-xl border-2 border-amber-600/60 mb-6">
        <span className="font-mono text-xs font-bold uppercase text-amber-400 block mb-1 flex items-center space-x-1.5">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Pertanyaan Utama Investigasi:</span>
        </span>
        <p className="font-serif text-base sm:text-lg font-bold text-parchment-100 leading-snug">
          “Mengapa Soekarno dan Mohammad Hatta dibawa ke Rengasdengklok pada 16 Agustus 1945?”
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Conclusion */}
        <div>
          <span className="font-mono text-xs font-bold uppercase text-parchment-300 block mb-3">
            1. Pilih Kesimpulan Historis yang Paling Sesuai:
          </span>

          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedOptionId(opt.id);
                    setErrorMsg(null);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-seal-red/20 border-seal-red text-white shadow-md'
                      : 'bg-[#221c15] border-parchment-800 text-parchment-300 hover:border-parchment-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="final-option"
                    checked={isSelected}
                    onChange={() => setSelectedOptionId(opt.id)}
                    className="mt-1 text-seal-red focus:ring-seal-red"
                  />
                  <p className="font-serif text-xs sm:text-sm leading-relaxed font-medium">
                    {opt.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Supporting Clues */}
        <div>
          <span className="font-mono text-xs font-bold uppercase text-parchment-300 block mb-2">
            2. Pilih Petunjuk Pendukung dari Buku Catatan Anda:
          </span>

          {clues.length === 0 ? (
            <p className="p-3 bg-amber-950/40 rounded-xl text-xs font-serif text-amber-200">
              Belum ada petunjuk tercatat di buku saku.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {clues.map((clue) => {
                const isChecked = selectedClueIds.includes(clue.id);

                return (
                  <div
                    key={clue.id}
                    onClick={() => toggleClue(clue.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                      isChecked
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : 'bg-[#221c16] border-parchment-800 text-parchment-400 hover:border-parchment-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleClue(clue.id)}
                      className="text-emerald-500 focus:ring-emerald-500 rounded"
                    />
                    <div className="text-xl">{clue.icon}</div>
                    <div className="flex-1 min-w-0">
                      <strong className="block font-serif text-xs text-parchment-100 truncate">
                        {clue.title}
                      </strong>
                      <span className="text-[10px] text-parchment-400 line-clamp-1">
                        {clue.shortSummary}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-600 rounded-xl text-xs font-serif text-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-parchment-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition shadow-lg flex items-center space-x-2"
          >
            <span>KIRIM HASIL DEDUKSI & UNGKAP KEBENARAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
