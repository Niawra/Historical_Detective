import React, { useState } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { Clock, ArrowUp, ArrowDown, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { MISSION_1_CLUES } from '../../data/adventureData';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  desc: string;
  correctIndex: number;
}

export const TimelineMiniGame: React.FC = () => {
  const { 
    timelineSolved, 
    setTimelineSolved, 
    addClue, 
    advanceToLocation, 
    addXP 
  } = useAdventure();

  const initialEvents: TimelineEvent[] = [
    {
      id: 'te-3',
      time: '15 Agustus (22.00 WIB)',
      title: 'Perdebatan Sengit Wikana vs Bung Karno',
      desc: 'Pemuda mendesak di Pegangsaan Timur 56; Bung Karno menolak didikte demi keselamatan rakyat.',
      correctIndex: 2
    },
    {
      id: 'te-1',
      time: '14-15 Agustus 1945',
      title: 'Berita Menyerahnya Jepang Didengar Radio Gelap',
      desc: 'Pemuda menyadap siaran Sekutu mengenai kekalahan Kekaisaran Dai Nippon.',
      correctIndex: 0
    },
    {
      id: 'te-5',
      time: '16 Agustus (17.30 WIB)',
      title: 'Jaminan Taruhan Leher Mr. Achmad Soebardjo',
      desc: 'Achmad Soebardjo meyakinkan pemuda bahwa Proklamasi akan diumumkan di Jakarta besok siang.',
      correctIndex: 4
    },
    {
      id: 'te-2',
      time: '15 Agustus (20.00 WIB)',
      title: 'Rapat Rahasia Pemuda Menteng 31',
      desc: 'Dipimpin Chaerul Saleh, pemuda sepakat menolak kemerdekaan sebagai hadiah Jepang.',
      correctIndex: 1
    },
    {
      id: 'te-6',
      time: '16 Agustus (23.00 WIB)',
      title: 'Kembali ke Jakarta & Menuju Rumah Maeda',
      desc: 'Rombongan tiba di Jakarta untuk merumuskan naskah proklamasi secara mandiri.',
      correctIndex: 5
    },
    {
      id: 'te-4',
      time: '16 Agustus (04.00 WIB)',
      title: 'Soekarno-Hatta Dibawa ke Rengasdengklok',
      desc: 'Sukarni dan Shodanco Singgih mengawal kedua proklamator ke basis aman PETA Karawang.',
      correctIndex: 3
    }
  ];

  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    sound.playClick();
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= events.length) return;

    const copy = [...events];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setEvents(copy);
    setFeedback(null);
  };

  const handleVerify = () => {
    let correctCount = 0;
    events.forEach((ev, idx) => {
      if (ev.correctIndex === idx) correctCount++;
    });

    if (correctCount === events.length) {
      sound.playSuccess();
      sound.playBadge();
      setTimelineSolved(true);
      addXP(150);
      addClue(MISSION_1_CLUES.subardjoGuarantee);
      setFeedback({
        isSuccess: true,
        text: 'Kronologi Sempurna! Anda berhasil menyusun kembali rangkaian peristiwa dari siaran radio gelap hingga perumusan di rumah Maeda.'
      });
    } else {
      sound.playClick();
      setFeedback({
        isSuccess: false,
        text: `${correctCount} dari ${events.length} kartu sudah di posisi yang tepat. Cermati tanggal dan jam kejadian untuk mengatur ulang urutannya.`
      });
    }
  };

  const handleProceed = () => {
    sound.playPaper();
    advanceToLocation('LOC_5_DEDUKSI');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1b1510] border-2 border-amber-600/70 rounded-2xl p-6 sm:p-8 shadow-2xl text-parchment-100 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-800 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Tantangan Lokasi 4 • Susun Peristiwa
            </span>
            <h3 className="font-serif font-black text-xl text-parchment-100">
              Urutan Garis Waktu Menjelang Proklamasi
            </h3>
          </div>
        </div>

        {timelineSolved && (
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>KRONOLOGI TERVERIFIKASI</span>
          </span>
        )}
      </div>

      <p className="font-serif text-xs sm:text-sm text-parchment-300 mb-4 leading-relaxed">
        Gunakan tombol panah <strong>[▲ Naik]</strong> dan <strong>[▼ Turun]</strong> untuk menyusun kartu peristiwa dari waktu paling awal ke paling akhir.
      </p>

      {/* Cards List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {events.map((ev, idx) => {
          const isCorrect = timelineSolved || (feedback && ev.correctIndex === idx);

          return (
            <div
              key={ev.id}
              className={`p-3.5 rounded-xl border-2 transition flex items-center justify-between gap-3 ${
                timelineSolved
                  ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-100'
                  : 'bg-[#221c16] border-parchment-800 text-parchment-200 hover:border-parchment-600'
              }`}
            >
              {/* Order Number */}
              <div className="w-7 h-7 rounded-full bg-black/50 border border-parchment-700 flex items-center justify-center font-mono text-xs font-bold shrink-0 text-amber-400">
                {idx + 1}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                    {ev.time}
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-parchment-100">
                    {ev.title}
                  </h4>
                </div>
                <p className="font-serif text-xs text-parchment-400 mt-1 leading-relaxed">
                  {ev.desc}
                </p>
              </div>

              {/* Up / Down Controls */}
              {!timelineSolved && (
                <div className="flex flex-col space-y-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'UP')}
                    className="p-1 rounded bg-[#16120e] hover:bg-parchment-800 text-parchment-300 disabled:opacity-30 border border-parchment-800"
                    title="Pindahkan Lebih Awal"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === events.length - 1}
                    onClick={() => moveItem(idx, 'DOWN')}
                    className="p-1 rounded bg-[#16120e] hover:bg-parchment-800 text-parchment-300 disabled:opacity-30 border border-parchment-800"
                    title="Pindahkan Lebih Akhir"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`mt-4 p-3 rounded-xl border text-xs font-serif leading-relaxed flex items-center space-x-2 ${
          feedback.isSuccess 
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
            : 'bg-amber-950/60 border-amber-500 text-amber-200'
        }`}>
          {feedback.isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="mt-6 pt-4 border-t border-parchment-800 flex items-center justify-between">
        {!timelineSolved ? (
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition shadow-md flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>PERIKSA URUTAN KRONOLOGI</span>
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="ml-auto px-6 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition shadow-lg flex items-center space-x-2 animate-pulse"
          >
            <span>MENUJU MISTERI TERUNGKAP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
