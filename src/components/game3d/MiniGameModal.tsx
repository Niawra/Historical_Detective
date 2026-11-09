import React, { useState } from 'react';
import { MiniGameData } from '../../types';
import { sound } from '../../utils/audio';
import { 
  KeyRound, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

interface MiniGameModalProps {
  gameData: MiniGameData;
  onSuccess: () => void;
  onClose: () => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  gameData,
  onSuccess,
  onClose
}) => {
  // --- Game 1: Cipher state ---
  const [cipherDigits, setCipherDigits] = useState<string[]>(['1', '6', '0', '0']);
  const [cipherFeedback, setCipherFeedback] = useState<string | null>(null);

  // --- Game 2: Timeline state ---
  const initialTimeline = [
    { id: 't3', time: '15 Agu (22.00)', text: 'Wikana & Darwis mendesak Bung Karno di Pegangsaan 56', order: 2 },
    { id: 't1', time: '14-15 Agu', text: 'Kabar penyerahan Jepang disadap lewat siaran radio gelap', order: 0 },
    { id: 't4', time: '16 Agu (04.00)', text: 'Pemuda membawa Soekarno & Hatta ke Rengasdengklok', order: 3 },
    { id: 't2', time: '15 Agu (20.00)', text: 'Rapat pemuda Menteng 31 menolak kemerdekaan hadiah Jepang', order: 1 },
    { id: 't5', time: '16 Agu (17.30)', text: 'Mr. Achmad Soebardjo menjaminkan lehernya agar proklamator kembali', order: 4 }
  ];
  const [timelineItems, setTimelineItems] = useState(initialTimeline);
  const [timelineFeedback, setTimelineFeedback] = useState<string | null>(null);

  // --- Game 3: Role Match state ---
  const figures = [
    { id: 'f1', name: 'Ir. Soekarno & Mohammad Hatta', roleKey: 'tua' },
    { id: 'f2', name: 'Chaerul Saleh & Sukarni', roleKey: 'muda' },
    { id: 'f3', name: 'Shodanco Singgih', roleKey: 'peta' },
    { id: 'f4', name: 'Mr. Achmad Soebardjo', roleKey: 'diplomat' }
  ];
  const roles = [
    { key: 'tua', desc: 'Golongan Tua (Kalkulasi matang demi keselamatan rakyat dari serdadu Dai Nippon)' },
    { key: 'muda', desc: 'Golongan Muda (Mendesak proklamasi mandiri seketika tanpa kompromi janji Jepang)' },
    { key: 'peta', desc: 'Perwira PETA (Mengawal dan mengamankan rombongan proklamator di Rengasdengklok)' },
    { key: 'diplomat', desc: 'Tokoh Penengah (Menjaminkan nyawanya sendiri untuk kepastian pelaksanaan Proklamasi)' }
  ];
  const [selectedFig, setSelectedFig] = useState<string | null>(null);
  const [roleMatches, setRoleMatches] = useState<Record<string, string>>({});
  const [roleFeedback, setRoleFeedback] = useState<string | null>(null);

  // --- Cipher Actions ---
  const handleDigitStep = (idx: number, delta: number) => {
    sound.playClick();
    setCipherDigits(prev => {
      const next = [...prev];
      const val = (parseInt(next[idx], 10) + delta + 10) % 10;
      next[idx] = val.toString();
      return next;
    });
    setCipherFeedback(null);
  };

  const handleVerifyCipher = () => {
    const code = cipherDigits.join('');
    if (code === '1608') {
      sound.playQuestComplete();
      setCipherFeedback('KODE BENAR (1608)! Peti sandi komando PETA terbuka.');
      setTimeout(() => onSuccess(), 1000);
    } else {
      sound.playClick();
      setCipherFeedback('Kode salah. Ingat: 2 digit hari dan 2 digit bulan kedatangan Bung Karno di Rengasdengklok (DDMM).');
    }
  };

  // --- Timeline Actions ---
  const moveTimelineItem = (index: number, dir: 'UP' | 'DOWN') => {
    sound.playClick();
    const targetIdx = dir === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= timelineItems.length) return;

    const copy = [...timelineItems];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setTimelineItems(copy);
    setTimelineFeedback(null);
  };

  const handleVerifyTimeline = () => {
    let correctCount = 0;
    timelineItems.forEach((item, idx) => {
      if (item.order === idx) correctCount++;
    });

    if (correctCount === timelineItems.length) {
      sound.playQuestComplete();
      setTimelineFeedback('Kronologi Tepat! Rangkaian peristiwa tersusun sempurna.');
      setTimeout(() => onSuccess(), 1000);
    } else {
      sound.playClick();
      setTimelineFeedback(`${correctCount} dari ${timelineItems.length} kartu sudah di posisi benar. Periksa kembali urutan jam dan tanggal.`);
    }
  };

  // --- Role Match Actions ---
  const handleMatchRole = (roleKey: string) => {
    if (!selectedFig) {
      setRoleFeedback('Pilih tokoh di sebelah kiri terlebih dahulu.');
      return;
    }
    sound.playClick();
    const fig = figures.find(f => f.id === selectedFig);
    if (!fig) return;

    if (fig.roleKey === roleKey) {
      sound.playCollectible();
      const updated = { ...roleMatches, [selectedFig]: roleKey };
      setRoleMatches(updated);
      setSelectedFig(null);
      setRoleFeedback('Cocok! Peran historis terverifikasi.');

      if (Object.keys(updated).length === figures.length) {
        sound.playQuestComplete();
        setTimeout(() => onSuccess(), 1000);
      }
    } else {
      sound.playClick();
      setRoleFeedback('Kurang tepat. Cermati kembali posisi dan peran tokoh tersebut.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#1b1510] border-2 border-amber-500 rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-100 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-parchment-800 pb-3 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-400">
              {gameData.type === 'CIPHER' && <KeyRound className="w-5 h-5" />}
              {gameData.type === 'TIMELINE' && <Clock className="w-5 h-5" />}
              {gameData.type === 'ROLE_MATCH' && <Users className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Tantangan Sejarah
              </span>
              <h3 className="font-serif font-black text-lg text-parchment-100">
                {gameData.title}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-parchment-800 text-parchment-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="font-serif text-xs sm:text-sm text-parchment-300 leading-relaxed mb-6 bg-[#241c15] p-3.5 rounded-xl border border-parchment-800">
          {gameData.instructions}
        </p>

        {/* --- 1. CIPHER MINI-GAME --- */}
        {gameData.type === 'CIPHER' && (
          <div className="flex flex-col items-center my-4 space-y-6">
            <span className="font-mono text-xs uppercase text-amber-400 tracking-widest font-bold">
              Kombinasi Sandi Tanggal Keramat (DDMM):
            </span>

            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              {cipherDigits.map((digit, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => handleDigitStep(idx, 1)}
                    className="w-11 h-8 rounded-lg bg-[#2c221a] hover:bg-amber-600 text-parchment-200 hover:text-black font-bold flex items-center justify-center border border-parchment-700"
                  >
                    ▲
                  </button>
                  <div className="w-14 h-16 rounded-xl bg-black border-2 border-amber-500 flex items-center justify-center font-mono text-3xl font-black text-amber-400 shadow-inner">
                    {digit}
                  </div>
                  <button
                    onClick={() => handleDigitStep(idx, -1)}
                    className="w-11 h-8 rounded-lg bg-[#2c221a] hover:bg-amber-600 text-parchment-200 hover:text-black font-bold flex items-center justify-center border border-parchment-700"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleVerifyCipher}
              className="px-8 py-3 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono font-bold text-xs tracking-wider transition shadow-lg"
            >
              BUKA GEMBOK
            </button>

            {cipherFeedback && (
              <div className={`p-3 rounded-xl text-xs font-serif ${cipherFeedback.includes('BENAR') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500' : 'bg-red-950/80 text-red-300 border border-red-500'}`}>
                {cipherFeedback}
              </div>
            )}
          </div>
        )}

        {/* --- 2. TIMELINE MINI-GAME --- */}
        {gameData.type === 'TIMELINE' && (
          <div className="space-y-3 my-2">
            {timelineItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#221c16] border border-parchment-800 flex items-center justify-between gap-3 text-xs font-serif"
              >
                <div className="w-6 h-6 rounded-full bg-black/60 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold block">{item.time}</span>
                  <span className="text-parchment-200">{item.text}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveTimelineItem(idx, 'UP')}
                    className="p-1 rounded bg-[#2c221a] text-parchment-300 disabled:opacity-30 border border-parchment-700 hover:bg-amber-600 hover:text-black"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === timelineItems.length - 1}
                    onClick={() => moveTimelineItem(idx, 'DOWN')}
                    className="p-1 rounded bg-[#2c221a] text-parchment-300 disabled:opacity-30 border border-parchment-700 hover:bg-amber-600 hover:text-black"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] font-mono text-parchment-500">Urutkan dari waktu terawal (atas) ke akhir (bawah)</span>
              <button
                onClick={handleVerifyTimeline}
                className="px-6 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono font-bold text-xs tracking-wider transition shadow-lg"
              >
                PERIKSA URUTAN
              </button>
            </div>

            {timelineFeedback && (
              <div className={`p-3 rounded-xl text-xs font-serif mt-2 ${timelineFeedback.includes('Tepat') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500' : 'bg-amber-950/80 text-amber-300 border border-amber-500'}`}>
                {timelineFeedback}
              </div>
            )}
          </div>
        )}

        {/* --- 3. ROLE MATCH MINI-GAME --- */}
        {gameData.type === 'ROLE_MATCH' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400 block mb-1">1. Pilih Tokoh:</span>
              {figures.map(fig => {
                const isMatched = !!roleMatches[fig.id];
                const isSelected = selectedFig === fig.id;
                return (
                  <button
                    key={fig.id}
                    disabled={isMatched}
                    onClick={() => setSelectedFig(fig.id)}
                    className={`w-full text-left p-3 rounded-xl border transition text-xs font-serif ${isMatched ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : isSelected ? 'bg-amber-950 border-amber-400 text-amber-200 ring-2 ring-amber-500/50' : 'bg-[#221c16] border-parchment-800 text-parchment-200'}`}
                  >
                    <span className="font-bold">{fig.name}</span>
                    {isMatched && <span className="ml-2 text-emerald-400">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400 block mb-1">2. Tautkan Peran:</span>
              {roles.map(r => {
                const isUsed = Object.values(roleMatches).includes(r.key);
                return (
                  <button
                    key={r.key}
                    disabled={isUsed}
                    onClick={() => handleMatchRole(r.key)}
                    className={`w-full text-left p-2.5 rounded-xl border transition text-[11px] font-serif leading-relaxed ${isUsed ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' : 'bg-[#221c16] border-parchment-800 text-parchment-300 hover:border-amber-400 hover:text-white'}`}
                  >
                    {r.desc}
                  </button>
                );
              })}
            </div>

            {roleFeedback && (
              <div className="col-span-1 sm:col-span-2 p-2.5 rounded-xl text-xs font-serif bg-amber-950/80 border border-amber-500 text-amber-300">
                {roleFeedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
