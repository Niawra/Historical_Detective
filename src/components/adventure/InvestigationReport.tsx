import React, { useEffect } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Star, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  FileText
} from 'lucide-react';

export const InvestigationReport: React.FC = () => {
  const { 
    xp, 
    stars, 
    badges, 
    clues, 
    deductionResult, 
    restartMission, 
    returnToMainMenu 
  } = useAdventure();

  useEffect(() => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const sources = [
    { title: 'Arsip Nasional Republik Indonesia (ANRI) - Khazanah Menjelang Proklamasi', institution: 'ANRI', year: '1945' },
    { title: 'Memoir: Sekitar Proklamasi 17 Agustus 1945', institution: 'Drs. Mohammad Hatta', year: '1970' },
    { title: 'Kesadaran Nasional: Sebuah Otobiografi', institution: 'Mr. Achmad Soebardjo', year: '1978' },
    { title: 'Sejarah Nasional Indonesia Jilid VI: Zaman Jepang dan Revolusi', institution: 'Prof. Nugroho Notosusanto', year: '2008' },
    { title: 'A History of Modern Indonesia since c. 1200', institution: 'Prof. M.C. Ricklefs', year: '2008' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d0b09] text-parchment-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-parchment-800 pb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-amber-500" />
          <span className="font-mono text-xs uppercase text-amber-400 tracking-widest font-bold">
            LAPORAN RESMI INVESTIGASI SEJARAH
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold">
          STATUS: KASUS TERPECAHKAN ✓
        </span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto my-6 bg-[#1b1510] border-2 border-amber-600/70 rounded-2xl p-6 sm:p-10 shadow-2xl">
        {/* Banner Title & Star Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-parchment-800 pb-6 mb-6 gap-4">
          <div>
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block font-bold">
              MISI #1 • TAHUN 1945
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-parchment-100 mt-1">
              THE DAY BEFORE INDEPENDENCE
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-parchment-300 mt-0.5">
              Misteri Pengamanan Dua Proklamator di Rengasdengklok
            </p>
          </div>

          {/* Star & XP Box */}
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center space-x-1.5 text-amber-400 mb-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${i < (stars || 3) ? 'fill-current text-amber-400' : 'text-parchment-700'}`}
                />
              ))}
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">
              +{xp} XP DIPEROLEH
            </span>
          </div>
        </div>

        {/* Deduction Result Explanation */}
        <div className="p-4 bg-[#231a12] rounded-xl border-2 border-amber-600/50 mb-6">
          <span className="font-mono text-xs font-bold uppercase text-amber-400 block mb-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kesimpulan Deduksi Akhir Detektif:</span>
          </span>
          <p className="font-serif text-sm text-parchment-100 leading-relaxed">
            {deductionResult?.explanation || 'Tindakan pemuda mengamankan Soekarno-Hatta ke Rengasdengklok terbukti merupakan langkah preventif strategis untuk melepaskan para pemimpin dari tekanan militer Jepang di Jakarta.'}
          </p>
        </div>

        {/* Badges Earned */}
        <div className="mb-6">
          <span className="font-mono text-xs uppercase font-bold text-parchment-300 tracking-wider block mb-3">
            Lencana Penyelidikan yang Terbuka:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map(b => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                  b.isUnlocked
                    ? 'bg-amber-950/40 border-amber-500/70 text-amber-200'
                    : 'bg-[#14100c] border-parchment-900 text-parchment-600 opacity-50'
                }`}
              >
                <span className="text-2xl mb-1">{b.icon}</span>
                <strong className="font-serif text-xs text-parchment-100">{b.name}</strong>
                <span className="text-[10px] text-parchment-400 mt-0.5 line-clamp-1">{b.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Historical Debrief */}
        <div className="space-y-4 font-serif text-xs sm:text-sm text-parchment-200 leading-relaxed border-t border-parchment-800 pt-5">
          <h3 className="font-serif font-black text-base text-amber-400 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Kilas Balik Sejarah: Apa yang Sesungguhnya Terjadi?</span>
          </h3>

          <p>
            1. <strong>Vacuum of Power:</strong> Menyerahnya Kekaisaran Jepang tanpa syarat pada 15 Agustus 1945 menciptakan kekosongan kekuasaan di Hindia Belanda.
          </p>
          <p>
            2. <strong>Perbedaan Pendekatan:</strong> Golongan Muda menghendaki kemerdekaan mandiri tanpa campur tangan PPKI (yang dibentuk Jepang). Sebaliknya, Golongan Tua berhati-hati untuk mencegah pembantaian massal rakyat oleh serdadu Jepang yang masih bersenjata lengkap.
          </p>
          <p>
            3. <strong>Bukan Penculikan Kriminal:</strong> Di Rengasdengklok, Bung Karno dan Bung Hatta diinapkan di rumah warga Tionghoa Djiaw Kie Siong dengan pengawalan tentara PETA, diperlakukan dengan penuh rasa hormat.
          </p>
          <p>
            4. <strong>Kesepakatan Bersejarah:</strong> Mr. Achmad Soebardjo mempertaruhkan lehernya sebagai jaminan bahwa Proklamasi akan dikumandangkan di Jakarta pada 17 Agustus 1945, yang memungkinkan kembalinya rombongan dan perumusan teks proklamasi di kediaman Laksamana Maeda.
          </p>

          {/* Academic References */}
          <div className="mt-4 p-3.5 bg-[#120e0a] rounded-xl border border-parchment-800">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
              Sumber Rujukan Terverifikasi:
            </span>
            <ul className="space-y-1 text-xs text-parchment-400">
              {sources.map((s, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-500">•</span>
                  <span><strong>{s.title}</strong> — {s.institution} ({s.year})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-5 border-t border-parchment-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={restartMission}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-parchment-700 font-mono text-xs text-parchment-300 hover:bg-parchment-800 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAINKAN LAGI</span>
          </button>

          <button
            onClick={returnToMainMenu}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-seal-red hover:bg-red-600 text-white font-mono text-xs font-bold tracking-wider transition shadow-lg flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center text-xs font-mono text-parchment-500 pt-3 border-t border-parchment-800/40">
        Unit Penyelidikan Sejarah • Jejak Nusantara
      </footer>
    </div>
  );
};
