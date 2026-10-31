import { MissionData, DetectiveBadge, DetectiveClue } from '../types';

export const MISSIONS_LIST: MissionData[] = [
  {
    id: 'misi-1',
    number: 1,
    title: 'THE DAY BEFORE INDEPENDENCE',
    subtitle: 'Misteri Pengamanan Dua Tokoh Bangsa di Rengasdengklok',
    year: 1945,
    isUnlocked: true,
    tagline: '16 Agustus 1945 — Apa yang sesungguhnya terjadi menjelang Fajar Kemerdekaan?',
    description: 'Bung Karno dan Bung Hatta mendadak dibawa keluar dari Batavia sebelum subuh. Selidiki lingkungan Rengasdengklok, temukan dokumen tersembunyi, dan ungkap alasan sebenarnya di balik peristiwa bersejarah ini.',
    coverImageTheme: 'rengasdengklok'
  },
  {
    id: 'misi-2',
    number: 2,
    title: 'THE SACRED PROCLAMATION',
    subtitle: 'Detik-Detik Perumusan Naskah di Rumah Laksamana Maeda',
    year: 1945,
    isUnlocked: false,
    tagline: '17 Agustus 1945 — Kalimat kemerdekaan yang diketik di tengah malam.',
    description: 'Menelusuri ketegangan perumusan teks proklamasi di Meiji Dori hingga pengibaran Sang Saka Merah Putih di Pegangsaan Timur 56.',
    coverImageTheme: 'proklamasi'
  },
  {
    id: 'misi-3',
    number: 3,
    title: 'BATTLE OF THE HEROES',
    subtitle: 'Api Perjuangan Arek Suroboyo',
    year: 1945,
    isUnlocked: false,
    tagline: '10 November 1945 — Ultimatum Sekutu dibalas pekik merdeka atau mati.',
    description: 'Insiden perobekan bendera di Hotel Yamato dan misteri di balik tewasnya Brigadir Jenderal Mallaby di Jembatan Merah.',
    coverImageTheme: 'surabaya'
  },
  {
    id: 'misi-4',
    number: 4,
    title: 'SEA OF FIRE',
    subtitle: 'Pengorbanan Bumi Hangus Kota Kembang',
    year: 1946,
    isUnlocked: false,
    tagline: 'Maret 1946 — Bandung Selatan dibakar demi kedaulatan Republik.',
    description: 'Keputusan dramatis pejuang TRI mengosongkan kota dan aksi kepahlawanan Mohammad Toha di gudang mesiu Dayeuhkolot.',
    coverImageTheme: 'bandung'
  },
  {
    id: 'misi-5',
    number: 5,
    title: 'THE YOUTH PLEDGE',
    subtitle: 'Kongres Pemuda II dan Ikrar Persatuan Bangsa',
    year: 1928,
    isUnlocked: false,
    tagline: '28 Oktober 1928 — Satu Nusa, Satu Bangsa, Satu Bahasa.',
    description: 'Menyatukan puluhan perkumpulan kedaerahan Nusantara dan kumandang perdana lagu Indonesia Raya oleh W.R. Soepratman.',
    coverImageTheme: 'sumpah-pemuda'
  }
];

export const INITIAL_BADGES: DetectiveBadge[] = [
  {
    id: 'badge-first-discovery',
    name: 'First Discovery',
    description: 'Menemukan petunjuk sejarah pertama dalam penyelidikan.',
    icon: '🔍',
    isUnlocked: false
  },
  {
    id: 'badge-sharp-observer',
    name: 'Sharp Observer',
    description: 'Menemukan dan memeriksa seluruh objek tersembunyi di lokasi.',
    icon: '👁️',
    isUnlocked: false
  },
  {
    id: 'badge-history-explorer',
    name: 'History Explorer',
    description: 'Menyelesaikan tantangan analisis tokoh dan garis waktu.',
    icon: '🧭',
    isUnlocked: false
  },
  {
    id: 'badge-master-detective',
    name: 'Master Detective',
    description: 'Mengungkap misteri utama Peristiwa Rengasdengklok dengan sempurna.',
    icon: '🎖️',
    isUnlocked: false
  }
];

export const MISSION_1_CLUES: Record<string, DetectiveClue> = {
  japanSurrender: {
    id: 'clue-japan',
    title: 'Siaran Rahasia Menyerahnya Jepang',
    icon: '📻',
    shortSummary: 'Jepang menyerah tanpa syarat pada 15 Agustus 1945, menciptakan kekosongan kekuasaan (vacuum of power).',
    fullDetail: 'Pada 15 Agustus 1945, Kaisar Hirohito mengumumkan penyerahan Jepang tanpa syarat kepada Sekutu setelah bom atom Hiroshima & Nagasaki. Berita ini disadap oleh pemuda pejuang melalui radio gelap luar negeri.',
    sourceStatus: 'SUMBER SEJARAH ASLI'
  },
  youthManifesto: {
    id: 'clue-youth',
    title: 'Notula Risalah Rapat Menteng 31',
    icon: '📜',
    shortSummary: 'Golongan Muda menolak kemerdekaan sebagai hadiah dari Jepang atau lewat badan PPKI.',
    fullDetail: 'Para pemuda (Chaerul Saleh, Wikana, Sukarni) berkumpul pada malam 15 Agustus 1945 di Lembaga Bakteriologi Pegangsaan Timur. Mereka menuntut kemerdekaan diproklamasikan atas nama kekuatan rakyat sendiri, bukan lewat izin Jepang.',
    sourceStatus: 'SUMBER SEJARAH ASLI'
  },
  houseProtection: {
    id: 'clue-soekarno-hatta',
    title: 'Catatan Rumah Djiaw Kie Siong',
    icon: '🏡',
    shortSummary: 'Soekarno-Hatta diamankan dengan hormat di Rengasdengklok, terlindung oleh pasukan PETA.',
    fullDetail: 'Soekarno, Hatta, Fatmawati, dan bayi Guntur tinggal di rumah petani Tionghoa Djiaw Kie Siong tepi Citarum. Peristiwa ini bukan penculikan kriminal yang menyakiti, melainkan tindakan evakuasi preventif dari pengaruh militer Jepang di Jakarta.',
    sourceStatus: 'SUMBER SEJARAH ASLI'
  },
  rolesSynthesis: {
    id: 'clue-roles',
    title: 'Sintesis Pemuda & Kaum Tua',
    icon: '👥',
    shortSummary: 'Kedua golongan memiliki cita-cita yang sama, hanya berbeda dalam perhitungan taktis.',
    fullDetail: 'Pemuda memiliki keberanian revolusioner yang mendesak momentum kemerdekaan, sementara Golongan Tua memperhitungkan keselamatan rakyat agar tidak menjadi korban pembantaian serdadu Jepang yang masih memegang senjata mesin.',
    sourceStatus: 'REKONSTRUKSI FAKTA'
  },
  subardjoGuarantee: {
    id: 'clue-guarantee',
    title: 'Kawat Jaminan Mr. Achmad Soebardjo',
    icon: '🤝',
    shortSummary: 'Achmad Soebardjo menjaminkan lehernya agar Soekarno-Hatta kembali ke Jakarta untuk proklamasi.',
    fullDetail: 'Pada 16 Agustus 1945 sore, Achmad Soebardjo tiba di Rengasdengklok dan berjanji kepada pemuda dengan taruhan nyawanya bahwa Proklamasi pasti diumumkan paling lambat 17 Agustus pukul 12.00 di Jakarta.',
    sourceStatus: 'SUMBER SEJARAH ASLI'
  }
};
