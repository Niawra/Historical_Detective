import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { 
  Award, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const FinalDeductionModal: React.FC = () => {
  const { currentCase, progress, submitDeduction, setActiveView, setActiveModal } = useGame();

  const [selectedOptionId, setSelectedOptionId] = useState<string>(progress.deductionAnswerId || '');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(progress.deductionEvidenceIds || []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const foundEvidences = currentCase.evidences.filter(e => progress.foundEvidenceIds.includes(e.id));

  const toggleEvidenceSelection = (id: string) => {
    sound.playClick();
    setSelectedEvidenceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) {
      setErrorMsg('Pilih salah satu kesimpulan utama penyelidikan.');
      return;
    }
    if (selectedEvidenceIds.length < 2) {
      setErrorMsg('Pilih minimal 2 bukti arsip yang mendukung kesimpulan Anda.');
      return;
    }

    const result = submitDeduction(selectedOptionId, selectedEvidenceIds);
    setActiveModal(null);
    setActiveView('CASE_REPORT');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-parchment-100 text-detective-900 rounded-lg shadow-dossier border-4 border-seal-red flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-4 border-b-2 border-detective-900/20 bg-seal-red/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-seal-red text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-seal-red tracking-wider">
                Sidang Kesimpulan Akhir • {currentCase.code}
              </span>
              <h2 className="text-xl font-serif font-black text-detective-950">
                Final Deduction (Deduksi Kesimpulan Sejarah)
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

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Question Box */}
          <div className="p-4 bg-white rounded-lg border-2 border-seal-red shadow-sm">
            <span className="font-mono text-xs font-bold uppercase text-seal-red block mb-1 flex items-center space-x-1.5">
              <Compass className="w-4 h-4" />
              <span>Pertanyaan Utama yang Harus Anda Jawab:</span>
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-detective-950 leading-relaxed">
              “{currentCase.deductionQuestion}”
            </p>
          </div>

          {/* Section 1: Choose Conclusion Option */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold uppercase text-detective-800 block">
              1. Pilih Kesimpulan Historis yang Paling Tepat & Berdasar Fakta:
            </span>

            <div className="space-y-3">
              {currentCase.deductionOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedOptionId(opt.id);
                      setErrorMsg(null);
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-seal-red/10 border-seal-red shadow-sm'
                        : 'bg-white/80 border-parchment-300 hover:border-seal-gold'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deduction-option"
                      checked={isSelected}
                      onChange={() => setSelectedOptionId(opt.id)}
                      className="mt-1 text-seal-red focus:ring-seal-red"
                    />
                    <div className="flex-1">
                      <p className="font-serif text-xs sm:text-sm text-detective-950 leading-relaxed font-medium">
                        {opt.statement}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Choose Supporting Evidence from Archive */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-detective-800">
                2. Pilih Bukti Arsip Pendukung yang Memperkuat Kesimpulan Anda:
              </span>
              <span className="font-mono text-xs text-seal-red font-bold">
                Terpilih: {selectedEvidenceIds.length} bukti
              </span>
            </div>

            {foundEvidences.length === 0 ? (
              <p className="p-3 bg-amber-50 border border-amber-300 rounded text-xs font-serif text-amber-900">
                Anda belum menemukan bukti di ruang investigasi. Kumpulkan bukti terlebih dahulu agar kesimpulan Anda didukung data arsip yang valid.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                {foundEvidences.map((ev) => {
                  const isChecked = selectedEvidenceIds.includes(ev.id);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => toggleEvidenceSelection(ev.id)}
                      className={`p-3 rounded border text-xs font-serif cursor-pointer transition flex items-start space-x-2.5 ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-white/90 border-parchment-300 text-detective-800 hover:border-parchment-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEvidenceSelection(ev.id)}
                        className="mt-0.5 text-emerald-700 focus:ring-emerald-600 rounded"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-seal-red font-bold uppercase block">
                          [{ev.id.toUpperCase()}] {ev.category}
                        </span>
                        <span className="line-clamp-2 mt-0.5 leading-snug">
                          {ev.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded bg-red-100 border border-red-400 text-xs font-serif text-red-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <footer className="px-6 py-4 border-t-2 border-detective-900/20 bg-parchment-200/60 flex items-center justify-between">
          <span className="text-xs font-mono text-detective-600">
            Penilaian akhir mempertimbangkan ketepatan analisis & kelengkapan bukti.
          </span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="px-4 py-2 rounded border border-detective-400 font-mono text-xs text-detective-800 hover:bg-parchment-300"
            >
              KEMBALI KE MEJA
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded bg-seal-red hover:bg-seal-redLight text-white font-mono text-xs font-bold tracking-wider transition shadow-paper flex items-center space-x-2 border border-red-900"
            >
              <span>KIRIM LAPORAN HASIL AKHIR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
