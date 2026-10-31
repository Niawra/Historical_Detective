import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdventure } from '../../context/AdventureContext';
import { sound } from '../../utils/audio';
import { 
  BookOpen, 
  MapPin, 
  CheckCircle2, 
  Compass, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Radio, 
  MessageSquare,
  Search,
  DoorOpen,
  Award,
  Sparkles
} from 'lucide-react';
import { RoleMatchingMiniGame } from './RoleMatchingMiniGame';
import { TimelineMiniGame } from './TimelineMiniGame';
import { FinalDeductionView } from './FinalDeductionView';
import { DialogueBox } from './DialogueBox';
import { InspectModal } from './InspectModal';
import { DetectiveNotebookModal } from './DetectiveNotebookModal';
import { MISSION_1_CLUES } from '../../data/adventureData';

interface InteractiveEntity {
  id: string;
  name: string;
  x: number; // percentage 0-100
  y: number;
  type: 'NPC' | 'OBJECT' | 'DOOR';
  icon: string;
  prompt: string;
  action: () => void;
}

export const AdventureGameplay: React.FC = () => {
  const { 
    currentLocation, 
    setCurrentLocation,
    advanceToLocation,
    playerPos, 
    setPlayerPos, 
    clues, 
    examinedObjectIds, 
    markObjectExamined, 
    toggleNotebook, 
    startDialogue, 
    openInspect, 
    isMuted, 
    toggleMute, 
    isAmbientActive, 
    toggleAmbient,
    setScreen,
    toastClue,
    dismissToastClue,
    toastBadge,
    dismissToastBadge
  } = useAdventure();

  const [nearbyEntity, setNearbyEntity] = useState<InteractiveEntity | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepSoundCooldown = useRef<number>(0);

  // Entities in Location 1 (Briefing Office)
  const loc1Entities: InteractiveEntity[] = [
    {
      id: 'npc-nara',
      name: 'Koordinator Nara Larasati',
      x: 50,
      y: 35,
      type: 'NPC',
      icon: '👩‍💼',
      prompt: 'Bicara dengan Koordinator Nara',
      action: () => {
        startDialogue('Koordinator Nara Larasati', [
          'Selamat datang di ruang penyelidikan, Detektif. Kita memiliki situasi darurat.',
          '16 Agustus 1945 dini hari, Soekarno dan Mohammad Hatta dibawa keluar dari Jakarta menuju Rengasdengklok.',
          'Misi pertamamu: Masuki lokasi Rengasdengklok, periksa 3 benda tersembunyi, dan temukan apa yang sesungguhnya terjadi sebelum Proklamasi!',
          'Gunakan pintu di sebelah atas untuk berangkat menuju lokasi Rengasdengklok sekarang.'
        ]);
      }
    },
    {
      id: 'door-to-rengas',
      name: 'Pintu Berangkat ke Rengasdengklok',
      x: 50,
      y: 12,
      type: 'DOOR',
      icon: '🚪',
      prompt: 'Berangkat ke Rumah Rengasdengklok',
      action: () => {
        sound.playPaper();
        advanceToLocation('LOC_2_RENGASDENGKLOK');
      }
    },
    {
      id: 'prop-map-desk',
      name: 'Peta Jawa Barat 1945',
      x: 25,
      y: 40,
      type: 'OBJECT',
      icon: '🗺️',
      prompt: 'Periksa Peta Wilayah',
      action: () => {
        openInspect({
          title: 'Peta Wilayah Batavia - Karawang 1945',
          category: 'Peta Taktis',
          description: 'Peta ini menunjukkan jalur darat dan perairan Citarum yang menghubungkan Batavia dengan Rengasdengklok, berjarak sekitar 80 km ke arah timur.',
          historicalNote: 'Rengasdengklok berada di bawah pengawasan Batalion PETA (Pembela Tanah Air) yang loyal terhadap perjuangan kemerdekaan.'
        });
      }
    }
  ];

  // Entities in Location 2 (Rumah Rengasdengklok & Yard)
  const loc2Entities: InteractiveEntity[] = [
    {
      id: 'obj-rengas-radio',
      name: 'Radio Gelombang Pendek Gelap',
      x: 22,
      y: 60,
      type: 'OBJECT',
      icon: '📻',
      prompt: 'Periksa Siaran Radio',
      action: () => {
        markObjectExamined('obj-rengas-radio');
        openInspect({
          title: 'Radio Penerima Gelombang Pendek',
          category: 'Dokumen Intelijen',
          description: 'Pesawat radio yang berhasil menyadap siaran Sekutu: Kaisar Hirohito mengumumkan kekalahan Jepang tanpa syarat dalam siaran Gyokuon-hoso.',
          historicalNote: 'Menyerahnya Jepang menciptakan situasi "vacuum of power" (kekosongan kekuasaan) di Indonesia.',
          rewardClue: MISSION_1_CLUES.japanSurrender
        });
      }
    },
    {
      id: 'obj-rengas-manifesto',
      name: 'Catatan Risalah Pemuda Menteng 31',
      x: 75,
      y: 45,
      type: 'OBJECT',
      icon: '📜',
      prompt: 'Periksa Catatan Pemuda',
      action: () => {
        markObjectExamined('obj-rengas-manifesto');
        openInspect({
          title: 'Notula Risalah Rapat Pemuda Menteng 31',
          category: 'Dokumen Sejarah',
          description: 'Catatan pertemuan pemuda yang dipimpin Chaerul Saleh: "Kemerdekaan adalah hak rakyat Indonesia sendiri dan tidak boleh digantungkan pada kemurahan hati balatentara Dai Nippon atau badan PPKI."',
          historicalNote: 'Golongan muda khawatir jika merdeka lewat PPKI, Sekutu akan menuduh Republik sebagai boneka ciptaan fasis Jepang.',
          rewardClue: MISSION_1_CLUES.youthManifesto
        });
      }
    },
    {
      id: 'obj-rengas-house-log',
      name: 'Catatan Perlindungan di Rumah Bojong',
      x: 48,
      y: 35,
      type: 'OBJECT',
      icon: '🏡',
      prompt: 'Periksa Catatan Rumah Bojong',
      action: () => {
        markObjectExamined('obj-rengas-house-log');
        openInspect({
          title: 'Catatan Rumah Singgah Djiaw Kie Siong',
          category: 'Kesaksian Sejarah',
          description: 'Soekarno, Hatta, Fatmawati, dan bayi Guntur beristirahat di rumah sederhana petani Tionghoa Djiaw Kie Siong di tepi Kali Citarum. Mereka dilindungi dengan penuh rasa hormat.',
          historicalNote: 'Fakta ini membuktikan peristiwa Rengasdengklok adalah pengamanan preventif dari jangkauan militer Jepang, bukan tindakan kriminal.',
          rewardClue: MISSION_1_CLUES.houseProtection
        });
      }
    },
    {
      id: 'npc-djiaw',
      name: 'Djiaw Kie Siong',
      x: 35,
      y: 36,
      type: 'NPC',
      icon: '👴',
      prompt: 'Bicara dengan Djiaw Kie Siong',
      action: () => {
        startDialogue('Djiaw Kie Siong (Pemilik Rumah)', [
          'Halo Detektif! Selamat datang di Kampung Bojong tepi Kali Citarum.',
          'Bung Karno dan Bung Hatta kami sediakan kamar terbaik di dalam rumah kami.',
          'Pemuda dan perwira PETA menjaga halaman dengan ketat. Kami semua merindukan kemerdekaan Indonesia!'
        ]);
      }
    },
    {
      id: 'npc-singgih',
      name: 'Shodanco Singgih (Perwira PETA)',
      x: 82,
      y: 65,
      type: 'NPC',
      icon: '💂',
      prompt: 'Bicara dengan Shodanco Singgih',
      action: () => {
        startDialogue('Shodanco Singgih (Perwira PETA Karawang)', [
          'Lapor! Pasukan PETA telah menutup akses jalan dari arah Batavia.',
          'Bung Karno dan Bung Hatta aman bersama kami di sini, bebas dari mata-mata Kenpeitai Jepang.',
          'Kami siap mengawal Proklamasi Kemerdekaan sampai titik darah penghabisan!'
        ]);
      }
    },
    {
      id: 'door-to-doc-room',
      name: 'Pintu Masuk Ruang Dokumen',
      x: 50,
      y: 10,
      type: 'DOOR',
      icon: '🚪',
      prompt: 'Masuk ke Ruang Dokumen',
      action: () => {
        const rengasCluesFound = ['clue-japan', 'clue-youth', 'clue-soekarno-hatta'].filter(id => 
          clues.some(c => c.id === id)
        ).length;

        if (rengasCluesFound >= 3) {
          sound.playPaper();
          advanceToLocation('LOC_3_DOKUMEN');
        } else {
          sound.playClick();
          alert(`Pintu terkunci!\n\nKumpulkan ketiga petunjuk tersembunyi di sekitar rumah Rengasdengklok terlebih dahulu (${rengasCluesFound}/3 ditemukan).`);
        }
      }
    }
  ];

  // Get active entities based on current location
  const currentEntities = currentLocation === 'LOC_1_BRIEFING' 
    ? loc1Entities 
    : currentLocation === 'LOC_2_RENGASDENGKLOK' 
    ? loc2Entities 
    : [];

  // Distance check for nearby entity
  useEffect(() => {
    if (currentLocation !== 'LOC_1_BRIEFING' && currentLocation !== 'LOC_2_RENGASDENGKLOK') {
      setNearbyEntity(null);
      return;
    }

    let closest: InteractiveEntity | null = null;
    let minDistance = 14; // trigger radius in percentage

    currentEntities.forEach(ent => {
      const dx = ent.x - playerPos.x;
      const dy = ent.y - playerPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        closest = ent;
      }
    });

    setNearbyEntity(closest);
  }, [playerPos, currentLocation, currentEntities]);

  // Movement handler
  const handleMove = useCallback((dx: number, dy: number, dir: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT') => {
    setPlayerPos(prev => {
      const nextX = Math.max(8, Math.min(92, prev.x + dx));
      const nextY = Math.max(12, Math.min(88, prev.y + dy));

      // Play soft footstep sound occasionally
      const now = Date.now();
      if (now - stepSoundCooldown.current > 260) {
        sound.playStep();
        stepSoundCooldown.current = now;
      }

      return {
        x: nextX,
        y: nextY,
        direction: dir,
        isMoving: true
      };
    });
  }, [setPlayerPos]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't move if typing or in modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const speed = 4;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          handleMove(0, -speed, 'UP');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          handleMove(0, speed, 'DOWN');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          handleMove(-speed, 0, 'LEFT');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          handleMove(speed, 0, 'RIGHT');
          break;
        case 'e':
        case 'enter':
        case ' ':
          if (nearbyEntity) {
            e.preventDefault();
            sound.playClick();
            nearbyEntity.action();
          }
          break;
        case 'tab':
          e.preventDefault();
          toggleNotebook();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, nearbyEntity, toggleNotebook]);

  // Objective text calculation
  const getObjectiveText = () => {
    switch (currentLocation) {
      case 'LOC_1_BRIEFING':
        return 'Bicara dengan Koordinator Nara, lalu keluar melalui pintu menuju Rengasdengklok.';
      case 'LOC_2_RENGASDENGKLOK': {
        const rengasClues = ['clue-japan', 'clue-youth', 'clue-soekarno-hatta'].filter(id => 
          clues.some(c => c.id === id)
        ).length;
        if (rengasClues >= 3) {
          return 'Semua 3 petunjuk ditemukan! Masuk melalui pintu atas menuju Ruang Dokumen.';
        }
        return `Temukan 3 petunjuk tersembunyi di sekitar Rumah Rengasdengklok (${rengasClues}/3).`;
      }
      case 'LOC_3_DOKUMEN':
        return 'Cocokkan tokoh-tokoh penting dengan peran historis mereka pada perundingan kemerdekaan.';
      case 'LOC_4_TIMELINE':
        return 'Susun kartu garis waktu peristiwa menjelang Proklamasi dari awal hingga akhir.';
      case 'LOC_5_DEDUKSI':
        return 'Pecahkan misteri utama: Mengapa Soekarno & Hatta dibawa ke Rengasdengklok?';
      default:
        return 'Selidiki lokasi peristiwa sejarah.';
    }
  };

  const getLocationTitle = () => {
    switch (currentLocation) {
      case 'LOC_1_BRIEFING': return 'Ruang Investigasi Arsip (Batavia 1945)';
      case 'LOC_2_RENGASDENGKLOK': return 'Rumah Djiaw Kie Siong & Asrama PETA (Rengasdengklok)';
      case 'LOC_3_DOKUMEN': return 'Ruang Dokumen & Analisis Tokoh Bangsa';
      case 'LOC_4_TIMELINE': return 'Garis Waktu Detik-Detik Menjelang Proklamasi';
      case 'LOC_5_DEDUKSI': return 'Misteri Terungkap • Deduksi Akhir';
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d0b09] text-parchment-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top HUD Bar */}
      <header className="z-30 bg-[#16120e]/95 backdrop-blur-md border-b border-parchment-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
        {/* Left: Back & Location */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.playClick();
              setScreen('PILIH_MISI');
            }}
            className="p-1.5 rounded-lg border border-parchment-800 bg-[#201913] hover:bg-[#2c231b] text-parchment-300 hover:text-white transition"
            title="Keluar ke Pilih Misi"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <h2 className="font-serif font-black text-xs sm:text-sm text-parchment-100">
                {getLocationTitle()}
              </h2>
            </div>
          </div>
        </div>

        {/* Center: Objective Banner */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#241c15] border border-amber-600/40 text-xs font-serif text-amber-300">
          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-md">{getObjectiveText()}</span>
        </div>

        {/* Right: Notebook Button & Audio */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleNotebook}
            className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/60 text-amber-300 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Catatan</span>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
              {clues.length}
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-[#201913] border border-parchment-800 text-parchment-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Objective Bar (on small screens) */}
      <div className="md:hidden z-20 bg-[#1f1812] border-b border-parchment-800/80 px-4 py-1.5 text-xs font-serif text-amber-300 flex items-center space-x-2">
        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">{getObjectiveText()}</span>
      </div>

      {/* Main Exploration Canvas or Mini Game Views */}
      <main className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* If in Location 1 or 2: Top-down 2D Exploration View */}
        {(currentLocation === 'LOC_1_BRIEFING' || currentLocation === 'LOC_2_RENGASDENGKLOK') && (
          <div 
            ref={containerRef}
            className="relative w-full h-[460px] sm:h-[540px] rounded-2xl border-4 border-amber-900/60 shadow-2xl overflow-hidden bg-[#241a12] select-none"
          >
            {/* Environment Floor Texture */}
            {currentLocation === 'LOC_1_BRIEFING' ? (
              // Briefing room wooden parquet floor
              <div className="absolute inset-0 bg-[#291e15] bg-[radial-gradient(#3a2c1f_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Office Wall Trim at top */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-[#1a130d] border-b-4 border-amber-950 flex items-center justify-around px-8">
                  <div className="w-16 h-8 bg-[#2c1d12] border border-parchment-800/40 rounded flex items-center justify-center text-[10px] text-parchment-500 font-mono">Arsip A</div>
                  <div className="w-16 h-8 bg-[#2c1d12] border border-parchment-800/40 rounded flex items-center justify-center text-[10px] text-parchment-500 font-mono">Arsip B</div>
                  <div className="w-16 h-8 bg-[#2c1d12] border border-parchment-800/40 rounded flex items-center justify-center text-[10px] text-parchment-500 font-mono">Arsip C</div>
                </div>
                {/* Vintage Warm Carpet in center */}
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-64 h-72 rounded-xl bg-seal-red/20 border-2 border-seal-red/30 shadow-inner" />
              </div>
            ) : (
              // Rengasdengklok rural yard & house floor
              <div className="absolute inset-0 bg-[#352517]">
                {/* River Citarum at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1b323c] to-[#254756] border-t-2 border-emerald-900/50 flex items-center justify-between px-8 text-xs font-serif italic text-cyan-200/60">
                  <span>Sungai Citarum 1945</span>
                  <span className="text-xl">🛶</span>
                </div>

                {/* Bamboo house structure at top */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[340px] sm:w-[420px] h-48 rounded-xl bg-[#2b1f15] border-4 border-[#4a3420] shadow-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold border-b border-parchment-800 pb-1">
                    <span>Rumah Djiaw Kie Siong</span>
                    <span className="text-[9px] text-parchment-400">Kp. Bojong</span>
                  </div>
                  {/* Veranda mat */}
                  <div className="w-full h-16 bg-[#3d2c1c] rounded-lg border border-[#5a4128] flex items-center justify-around text-xs text-parchment-400">
                    <span>Serambi Bambu</span>
                    <span>🛋️</span>
                  </div>
                </div>

                {/* Dirt road texture & tropical trees */}
                <div className="absolute top-64 left-6 text-2xl">🌴</div>
                <div className="absolute top-72 right-8 text-2xl">🎋</div>
                <div className="absolute bottom-24 left-10 text-xl">🚛 <span className="text-[9px] font-mono text-parchment-400 ml-1">Truk PETA</span></div>
              </div>
            )}

            {/* Ambient Lighting Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_40%,_rgba(0,0,0,0.65)_100%)] pointer-events-none" />

            {/* Interactive Entities on Canvas */}
            {currentEntities.map((ent) => (
              <div
                key={ent.id}
                style={{ left: `${ent.x}%`, top: `${ent.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
              >
                {/* Entity Icon / Sprite */}
                <div className="relative group cursor-pointer" onClick={() => ent.action()}>
                  <div className="text-3xl sm:text-4xl filter drop-shadow-md transform transition group-hover:scale-110">
                    {ent.icon}
                  </div>

                  {/* Pulsing glow under interactive object */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 rounded-full bg-amber-400/30 blur-xs animate-ping" />
                </div>

                {/* Name Label */}
                <span className="mt-1 px-2 py-0.5 rounded bg-black/75 border border-parchment-800 text-[10px] font-mono text-parchment-200 whitespace-nowrap shadow-md">
                  {ent.name}
                </span>
              </div>
            ))}

            {/* Detective Player Sprite */}
            <div
              style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-75 z-20 pointer-events-none"
            >
              {/* Animated Detective Avatar */}
              <div className="relative flex flex-col items-center">
                {/* Detective Fedora Hat */}
                <div className="w-8 h-3.5 bg-[#4a2e18] rounded-t-full border border-black shadow-sm" />
                {/* Head */}
                <div className="w-5 h-5 bg-[#d4a373] rounded-full border border-black -mt-1 flex items-center justify-center text-[10px]">
                  🕵️
                </div>
                {/* Trench coat */}
                <div className="w-7 h-7 bg-[#6a4c2f] rounded-b-md border border-black -mt-1 flex items-center justify-center">
                  <div className="w-1 h-4 bg-amber-300" />
                </div>
                {/* Moving Feet */}
                <div className="flex space-x-2 -mt-0.5">
                  <div className="w-2 h-2.5 bg-black rounded-sm animate-pulse" />
                  <div className="w-2 h-2.5 bg-black rounded-sm" />
                </div>
              </div>

              {/* Player Tag */}
              <span className="mt-1 px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/50 text-[9px] font-mono text-amber-200">
                Detektif
              </span>
            </div>

            {/* Interaction Prompt Overlay when close to an entity */}
            {nearbyEntity && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
                <button
                  onClick={() => {
                    sound.playClick();
                    nearbyEntity.action();
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-black text-xs tracking-wider shadow-2xl flex items-center space-x-2 border-2 border-amber-300"
                >
                  <span className="px-2 py-0.5 rounded bg-black text-amber-300 text-[11px] font-bold">
                    [ E ]
                  </span>
                  <span>{nearbyEntity.prompt}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Location 3: Role Matching Mini Game */}
        {currentLocation === 'LOC_3_DOKUMEN' && <RoleMatchingMiniGame />}

        {/* Location 4: Timeline Puzzle Mini Game */}
        {currentLocation === 'LOC_4_TIMELINE' && <TimelineMiniGame />}

        {/* Location 5: Final Deduction View */}
        {currentLocation === 'LOC_5_DEDUKSI' && <FinalDeductionView />}
      </main>

      {/* Bottom Virtual Controls for Mobile / Tablets */}
      <footer className="z-30 w-full max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Virtual D-Pad (Left) */}
        {(currentLocation === 'LOC_1_BRIEFING' || currentLocation === 'LOC_2_RENGASDENGKLOK') && (
          <div className="flex items-center space-x-1">
            <div className="grid grid-cols-3 gap-1 w-32 h-28 p-1 bg-black/40 rounded-2xl border border-parchment-800">
              <div />
              <button
                onClick={() => handleMove(0, -6, 'UP')}
                className="rounded-xl bg-[#2c221a] active:bg-amber-600 active:text-black border border-parchment-700 flex items-center justify-center font-bold text-xs"
              >
                ▲
              </button>
              <div />
              <button
                onClick={() => handleMove(-6, 0, 'LEFT')}
                className="rounded-xl bg-[#2c221a] active:bg-amber-600 active:text-black border border-parchment-700 flex items-center justify-center font-bold text-xs"
              >
                ◀
              </button>
              <div className="flex items-center justify-center text-[10px] text-parchment-600 font-mono">D-Pad</div>
              <button
                onClick={() => handleMove(6, 0, 'RIGHT')}
                className="rounded-xl bg-[#2c221a] active:bg-amber-600 active:text-black border border-parchment-700 flex items-center justify-center font-bold text-xs"
              >
                ▶
              </button>
              <div />
              <button
                onClick={() => handleMove(0, 6, 'DOWN')}
                className="rounded-xl bg-[#2c221a] active:bg-amber-600 active:text-black border border-parchment-700 flex items-center justify-center font-bold text-xs"
              >
                ▼
              </button>
              <div />
            </div>
          </div>
        )}

        {/* Keyboard hints (Desktop) or Action Button (Mobile) */}
        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono text-parchment-500">
          <span>Gerak: <strong>W, A, S, D / Panah</strong></span>
          <span>•</span>
          <span>Interaksi: <strong>[E] / Spasi</strong></span>
          <span>•</span>
          <span>Buku Saku: <strong>[Tab]</strong></span>
        </div>

        {/* Big Action Button (Right) for mobile interaction */}
        {(currentLocation === 'LOC_1_BRIEFING' || currentLocation === 'LOC_2_RENGASDENGKLOK') && nearbyEntity && (
          <button
            onClick={() => {
              sound.playClick();
              nearbyEntity.action();
            }}
            className="w-16 h-16 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-mono font-black text-lg shadow-2xl flex flex-col items-center justify-center border-2 border-amber-300 sm:hidden"
          >
            <span>[E]</span>
            <span className="text-[9px] uppercase">Aksi</span>
          </button>
        )}
      </footer>

      {/* Dialogue Overlay */}
      <DialogueBox />

      {/* Inspect Item Modal */}
      <InspectModal />

      {/* Detective Notebook Modal */}
      <DetectiveNotebookModal />

      {/* Floating Toast Notification when Clue is Discovered */}
      {toastClue && (
        <div className="fixed top-16 right-4 z-50 max-w-sm w-full bg-[#1e1711] border-2 border-amber-500 rounded-2xl p-4 shadow-2xl animate-bounce">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>PETUNJUK BARU DITEMUKAN!</span>
            </div>
            <button onClick={dismissToastClue} className="text-parchment-400 hover:text-white">✕</button>
          </div>
          <h4 className="font-serif font-bold text-sm text-parchment-100 mt-1">
            {toastClue.title}
          </h4>
          <p className="font-serif text-xs text-parchment-300 mt-0.5 line-clamp-2">
            {toastClue.shortSummary}
          </p>
        </div>
      )}

      {/* Floating Toast Notification when Badge is Unlocked */}
      {toastBadge && (
        <div className="fixed top-36 right-4 z-50 max-w-sm w-full bg-[#1b1510] border-2 border-purple-500 rounded-2xl p-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>LENCANA DETEKTIF DIBUKA!</span>
            </div>
            <button onClick={dismissToastBadge} className="text-parchment-400 hover:text-white">✕</button>
          </div>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-2xl">{toastBadge.icon}</span>
            <div>
              <h4 className="font-serif font-bold text-sm text-parchment-100">{toastBadge.name}</h4>
              <p className="font-serif text-xs text-parchment-300">{toastBadge.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
