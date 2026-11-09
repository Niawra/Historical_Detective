import { HistoricalWorld, Quest, CollectibleItem, DetectiveBadge, NPCEntity } from '../types';

export const HISTORICAL_WORLDS: HistoricalWorld[] = [
  {
    id: 'WORLD_01_RENGASDENGKLOK',
    name: 'Dunia 01: Rengasdengklok',
    year: 1945,
    location: 'Karawang, Jawa Barat',
    title: 'Before the Independence',
    subtitle: 'Fajar Penentuan Menjelang Proklamasi Bangsa',
    description: 'Jelajahi desa Rengasdengklok di tepi Sungai Citarum pada pagi hari 16 Agustus 1945. Temui para pejuang PETA, pemilik rumah bersejarah Djiaw Kie Siong, dan saksikan dialog menentukan antara kaum muda dan Bung Karno serta Bung Hatta.',
    themeColor: '#e07a5f',
    isUnlocked: true,
    completionPercent: 0,
    totalCollectibles: 6,
    totalQuests: 5
  },
  {
    id: 'WORLD_02_PROKLAMASI',
    name: 'Dunia 02: Jakarta Proklamasi',
    year: 1945,
    location: 'Pegangsaan Timur 56 & Rumah Maeda',
    title: 'The Sacred Proclamation',
    subtitle: 'Detik-Detik Perumusan Naskah Kemerdekaan',
    description: 'Masuki kawasan kota Batavia tengah malam di kediaman Laksamana Tadashi Maeda hingga fajar 17 Agustus 1945 saat naskah proklamasi diketik Sayuti Melik dan dibacakan di bawah tiang bendera bambu.',
    themeColor: '#3d5a80',
    isUnlocked: false,
    completionPercent: 0,
    totalCollectibles: 5,
    totalQuests: 4
  },
  {
    id: 'WORLD_03_SURABAYA',
    name: 'Dunia 03: Pertempuran Surabaya',
    year: 1945,
    location: 'Jembatan Merah & Hotel Yamato',
    title: 'Battle of the Heroes',
    subtitle: 'Kobaran Semangat Arek-Arek Suroboyo',
    description: 'Jelajahi Surabaya pada Oktober-November 1945. Telusuri insiden perobekan bendera di Hotel Yamato, pidato menggelora Bung Tomo, dan misteri di balik tewasnya Jenderal Mallaby.',
    themeColor: '#d62828',
    isUnlocked: false,
    completionPercent: 0,
    totalCollectibles: 5,
    totalQuests: 4
  },
  {
    id: 'WORLD_04_BANDUNG',
    name: 'Dunia 04: Bandung Lautan Api',
    year: 1946,
    location: 'Bandung Selatan & Dayeuhkolot',
    title: 'Sea of Fire',
    subtitle: 'Pengorbanan Demi Kedaulatan Negeri',
    description: 'Maret 1946. Hadapi dilema strategi pembumihangusan kota Bandung agar fasilitas penting tidak jatuh ke tangan tentara Sekutu, serta aksi heroik Mohammad Toha di gudang mesiu.',
    themeColor: '#f77f00',
    isUnlocked: false,
    completionPercent: 0,
    totalCollectibles: 5,
    totalQuests: 4
  },
  {
    id: 'WORLD_05_SUMPAH_PEMUDA',
    name: 'Dunia 05: Sumpah Pemuda',
    year: 1928,
    location: 'Kramat Raya 106, Batavia',
    title: 'The Youth Pledge',
    subtitle: 'Satu Nusa, Satu Bangsa, Satu Bahasa',
    description: 'Hadiri Kongres Pemuda II pada 27-28 Oktober 1928. Temui perwakilan Jong Java, Jong Sumatranen Bond, serta dengarkan alunan perdana biola W.R. Soepratman melantunkan Indonesia Raya.',
    themeColor: '#2a9d8f',
    isUnlocked: false,
    completionPercent: 0,
    totalCollectibles: 5,
    totalQuests: 4
  }
];

export const WORLD_01_QUESTS: Quest[] = [
  {
    id: 'quest-01-singgih',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    title: 'Langkah Pertama: Pos Komando PETA',
    npcName: 'Shodanco Singgih',
    npcRole: 'Perwira Peleton PETA Purwakarta',
    description: 'Bicaralah dengan Shodanco Singgih di pos penjagaan menara PETA untuk mengetahui situasi pengamanan Bung Karno dan Bung Hatta di Rengasdengklok.',
    isMainQuest: true,
    steps: [
      { id: 's1', description: 'Dekati pos menara bendera PETA dan bicara dengan Shodanco Singgih.', isCompleted: false },
      { id: 's2', description: 'Ketahui alasan mengapa Rengasdengklok dipilih sebagai basis pengamanan.', isCompleted: false }
    ],
    currentStepIndex: 0,
    isCompleted: false,
    rewardXP: 100,
    historicalContext: 'Rengasdengklok dipilih karena letaknya strategis sekitar 15 km utara Karawang, terlindung hutan dan Sungai Citarum, serta memiliki tangsi PETA yang dipimpin perwira yang bersimpati kepada pemuda.'
  },
  {
    id: 'quest-02-dispatch',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    title: 'Misi Rahasia: Kantong Berkas yang Hilang',
    npcName: 'Djiaw Kie Siong',
    npcRole: 'Pemilik Rumah Singgah Bersejarah',
    description: 'Djiaw Kie Siong kehilangan kantong berkas penting dari para pemuda di dekat rerumpunan bambu tepi sungai. Temukan dan kembalikan kantong tersebut!',
    isMainQuest: false,
    steps: [
      { id: 's1', description: 'Bicara dengan Djiaw Kie Siong di pelataran rumahnya.', isCompleted: false },
      { id: 's2', description: 'Cari kantong berkas yang jatuh di antara pepohonan bambu tepi Citarum.', targetLocation: { x: 28, z: -25 }, isCompleted: false },
      { id: 's3', description: 'Kembalikan kantong berkas kepada Djiaw Kie Siong.', isCompleted: false }
    ],
    currentStepIndex: 0,
    isCompleted: false,
    rewardXP: 150,
    historicalContext: 'Djiaw Kie Siong adalah petani ramah keturunan Tionghoa di Kampung Bojong. Rumahnya dipilih karena aman, tidak mencolok dari patroli udara, dan ia bersedia merelakan kamarnya untuk proklamator.'
  },
  {
    id: 'quest-03-cipher',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    title: 'Peti Sandi Telegraf PETA',
    npcName: 'Peti Komando PETA',
    npcRole: 'Perangkat Komunikasi Lapangan',
    description: 'Buka peti sandi telegraf komando PETA di dekat truk militer dengan memecahkan kombinasi angka 4 digit.',
    isMainQuest: true,
    steps: [
      { id: 's1', description: 'Dekati peti sandi di dekat pos truk militer.', isCompleted: false },
      { id: 's2', description: 'Pecahkan kode 4 digit (Hari dan Bulan kedatangan di Rengasdengklok).', isCompleted: false }
    ],
    currentStepIndex: 0,
    isCompleted: false,
    rewardXP: 150,
    historicalContext: 'Tanggal 16 Agustus (1608) adalah momentum pengamanan kedua tokoh bangsa sebelum disepakatinya waktu Proklamasi Kemerdekaan.'
  },
  {
    id: 'quest-04-veranda',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    title: 'Dialog Sejarah di Serambi Bambu',
    npcName: 'Ir. Soekarno & Bung Hatta',
    npcRole: 'Proklamator Bangsa',
    description: 'Kunjungi Bung Karno dan Bung Hatta di serambi rumah bersejarah. Dengarkan pertimbangan mendalam mengenai waktu pembacaan Proklamasi.',
    isMainQuest: true,
    steps: [
      { id: 's1', description: 'Naik ke serambi rumah Djiaw Kie Siong.', isCompleted: false },
      { id: 's2', description: 'Bicara dengan Bung Karno dan pahami dialektika antara Golongan Tua dan Golongan Muda.', isCompleted: false }
    ],
    currentStepIndex: 0,
    isCompleted: false,
    rewardXP: 200,
    historicalContext: 'Bung Karno dan Bung Hatta berpegang pada prinsip kehati-hatian agar rakyat tidak dibantai serdadu Jepang yang masih memegang senjata mesin, sementara pemuda mendesak kemerdekaan mandiri secepatnya.'
  },
  {
    id: 'quest-05-timeline',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    title: 'Penyusunan Kronologi & Jaminan Soebardjo',
    npcName: 'Mr. Achmad Soebardjo',
    npcRole: 'Tokoh Penengah Diplomatik',
    description: 'Sambut kedatangan Mr. Achmad Soebardjo di Rengasdengklok dan selesaikan tantangan kronologi waktu untuk mengawal kepulangan proklamator ke Jakarta!',
    isMainQuest: true,
    steps: [
      { id: 's1', description: 'Bicara dengan Mr. Achmad Soebardjo di dekat gerbang masuk desa.', isCompleted: false },
      { id: 's2', description: 'Susun kartu urutan kronologi peristiwa 14–17 Agustus 1945 di Chronicle Compass.', isCompleted: false },
      { id: 's3', description: 'Buka jalan keberangkatan rombongan menuju Jakarta!', isCompleted: false }
    ],
    currentStepIndex: 0,
    isCompleted: false,
    rewardXP: 250,
    historicalContext: 'Achmad Soebardjo menjaminkan nyawanya: jika Proklamasi tidak dibacakan pada 17 Agustus pukul 12.00, kepalanya boleh dipenggal. Berkat jaminan ini, pemuda mengizinkan rombongan kembali ke Jakarta.'
  }
];

export const WORLD_01_COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'col-radio',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Radio Gelap Pemuda',
    category: 'ARTEFAK',
    description: 'Pesawat radio penerima gelombang pendek luar negeri yang digunakan Sutan Sjahrir dan para pemuda pejuang.',
    historicalFact: 'Melalui radio inilah berita Kaisar Hirohito membacakan Deklarasi Penyerahan Jepang tanpa syarat (Gyokuon-hoso) pertama kali didengar pemuda Indonesia pada 15 Agustus 1945.',
    sourceReference: 'Arsip Nasional RI & Sutan Sjahrir, Pikiran dan Tindakan (1947)',
    position: { x: -28, y: 1.2, z: 12 },
    isFound: false,
    icon: '📻'
  },
  {
    id: 'col-manifesto',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Risalah Rapat Menteng 31',
    category: 'DOKUMEN',
    description: 'Catatan hasil rapat rahasia pemuda di Laboratorium Bakteriologi Pegangsaan Timur yang dipimpin Chaerul Saleh.',
    historicalFact: 'Rapat pemuda memutuskan menolak kemerdekaan sebagai hadiah pemberian Jepang, serta menuntut proklamasi diumumkan atas kehendak rakyat sendiri.',
    sourceReference: 'Adam Malik, Riwayat Proklamasi Agustus 1945 (1962)',
    position: { x: 5, y: 1.4, z: -18 },
    isFound: false,
    icon: '📜'
  },
  {
    id: 'col-map',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Peta Taktis PETA Karawang',
    category: 'DOKUMEN',
    description: 'Peta rute pertahanan militer darat dan sungai antara Batavia, Karawang, dan Rengasdengklok.',
    historicalFact: 'Daidan Purwakarta dan peleton Shodanco Singgih menjamin keamanan di wilayah Karawang utara dari penyusupan Kenpeitai (Polisi Militer Jepang).',
    sourceReference: 'Disjarah Angkatan Darat & Pusat Sejarah TNI',
    position: { x: -35, y: 1.3, z: -8 },
    isFound: false,
    icon: '🗺️'
  },
  {
    id: 'col-coin',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Koin Gulden Relik 1945',
    category: 'KOIN',
    description: 'Mata uang peredaran masa peralihan yang tertimbun di bawah pohon beringin tua desa.',
    historicalFact: 'Pada masa menjelang kemerdekaan, peredaran uang di Jawa bercampur antara uang militer Jepang (Dai Nippon Teikoku Seifu) dan uang peninggalan kolonial.',
    sourceReference: 'Museum Bank Indonesia & Khazanah Numismatik Sejarah',
    position: { x: 22, y: 1.1, z: 25 },
    isFound: false,
    icon: '🪙'
  },
  {
    id: 'col-photo',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Foto Rumah Bersejarah Bojong',
    category: 'FOTO',
    description: 'Dokumentasi otentik rumah panggung berdinding anyaman bambu milik Djiaw Kie Siong.',
    historicalFact: 'Hingga kini rumah bersejarah ini masih berdiri dan dirawat sebagai simbol gotong-royong warga lintas etnis dalam melindungi pemimpin kemerdekaan.',
    sourceReference: 'Museum Rumah Sejarah Djiaw Kie Siong, Rengasdengklok',
    position: { x: 2, y: 1.2, z: 22 },
    isFound: false,
    icon: '📸'
  },
  {
    id: 'col-dispatch-pouch',
    worldId: 'WORLD_01_RENGASDENGKLOK',
    name: 'Kantong Berkas Rahasia Pemuda',
    category: 'CATATAN',
    description: 'Kantong kulit berisi surat penghubung rahasia antara pemuda Jakarta dan perwira PETA Rengasdengklok.',
    historicalFact: 'Komunikasi antar-kelompok pemuda dilakukan secara klandestin menggunakan kurir sepeda dan mobil berkecepatan tinggi.',
    sourceReference: 'Mohammad Hatta, Memoir Sekitar Proklamasi (1970)',
    position: { x: 28, y: 0.9, z: -25 },
    isFound: false,
    icon: '🎋'
  }
];

export const WORLD_01_NPCS: NPCEntity[] = [
  {
    id: 'npc-singgih',
    name: 'Shodanco Singgih',
    role: 'Perwira Peleton PETA',
    position: { x: -22, y: 1.0, z: -4 },
    rotationY: Math.PI / 4,
    modelStyle: 'peta',
    dialogueTree: {
      greeting: [
        'Salam pejuang! Saya Shodanco Singgih dari Daidan PETA Purwakarta.',
        'Kami telah membarikade jalan dari arah Jakarta. Rengasdengklok aman dan tentram di bawah perlindungan pasukan pribumi.',
        'Bung Karno dan Bung Hatta berada di rumah Pak Djiaw Kie Siong di sebelah sana. Waspadalah terhadap intel Jepang!'
      ],
      questDialogue: [
        'Kamu mencari petunjuk? Coba periksa radio telegraf di pos jaga. Suara siaran Tokyo baru saja terputus!'
      ],
      completedDialogue: [
        'Terima kasih atas bantuanmu, Petualang! Kita akan mengawal Bung Karno kembali ke Jakarta begitu kesepakatan tercapai!'
      ]
    }
  },
  {
    id: 'npc-djiaw',
    name: 'Djiaw Kie Siong',
    role: 'Tuan Rumah Bersejarah',
    position: { x: 12, y: 1.0, z: -6 },
    rotationY: -Math.PI / 3,
    modelStyle: 'farmer',
    dialogueTree: {
      greeting: [
        'Selamat pagi anak muda! Selamat datang di Kampung Bojong.',
        'Bung Karno, Bung Hatta, dan Ibu Fatmawati yang menggendong bayi Guntur sedang beristirahat di dalam.',
        'Rumah saya sederhana di tepi Sungai Citarum, namun kami sekeluarga merasa sangat terhormat dapat melindungi beliau berdua.'
      ],
      questDialogue: [
        'Aduh celaka, kantong berkas penting dari pemuda tadi terjatuh waktu saya mengambil rebung di rumpun bambu tepi sungai. Bisakah kamu membantuku mencarinya?'
      ],
      completedDialogue: [
        'Terima kasih banyak! Berkas ini sangat berharga untuk kelancaran perundingan kemerdekaan kita.'
      ]
    }
  },
  {
    id: 'npc-soekarno',
    name: 'Ir. Soekarno',
    role: 'Pemimpin Besar Bangsa',
    position: { x: 0, y: 2.1, z: -10 },
    rotationY: 0,
    modelStyle: 'soekarno',
    dialogueTree: {
      greeting: [
        'Merdeka! Dengarlah anak muda...',
        'Kemerdekaan Indonesia bukan perkara tergesa-gesa tanpa perhitungan. Kita harus memperhitungkan keselamatan seluruh rakyat.',
        'Tentara Jepang masih memegang senjata mesin lengkap di Batavia. Satu langkah gegabah bisa memicu pertumpahan darah yang sia-sia.',
        'Namun tekad para pemuda sangat membakar dada saya. Kemerdekaan ini memang harus lahir dari keringat dan darah bangsa kita sendiri!'
      ]
    }
  },
  {
    id: 'npc-hatta',
    name: 'Drs. Mohammad Hatta',
    role: 'Tokoh Proklamator',
    position: { x: 3, y: 2.1, z: -10 },
    rotationY: -0.2,
    modelStyle: 'hatta',
    dialogueTree: {
      greeting: [
        'Kemerdekaan adalah hak segala bangsa, Bung.',
        'Kita sedang dalam situasi vacuum of power (kekosongan kekuasaan). Yang terpenting sekarang adalah merumuskan pernyataan proklamasi secara cermat dan bermartabat di hadapan dunia internasional.'
      ]
    }
  },
  {
    id: 'npc-soebardjo',
    name: 'Mr. Achmad Soebardjo',
    role: 'Tokoh Senior Diplomat',
    position: { x: -10, y: 1.0, z: 18 },
    rotationY: Math.PI,
    modelStyle: 'diplomat',
    dialogueTree: {
      greeting: [
        'Saya baru saja tiba dari Batavia bersama saudara Jusuf Kunto!',
        'Saya telah menjaminkan leher saya kepada para pemuda: Proklamasi Kemerdekaan pasti dibacakan paling lambat besok tanggal 17 Agustus pukul 12.00 siang!',
        'Mari kita segera menyusun urutan peristiwa dan mengawal Bung Karno kembali ke Jakarta!'
      ]
    }
  }
];

export const GAME_BADGES: DetectiveBadge[] = [
  {
    id: 'badge-first-explorer',
    name: 'First Explorer',
    description: 'Menemukan artefak bersejarah pertama dalam petualangan 3D.',
    icon: '🧭',
    isUnlocked: false
  },
  {
    id: 'badge-curious-mind',
    name: 'Curious Mind',
    description: 'Berbicara dengan seluruh tokoh sejarah di Desa Rengasdengklok.',
    icon: '💡',
    isUnlocked: false
  },
  {
    id: 'badge-history-hunter',
    name: 'History Hunter',
    description: 'Mengumpulkan seluruh 6 artefak tersembunyi di Dunia 01.',
    icon: '🏺',
    isUnlocked: false
  },
  {
    id: 'badge-master-adventurer',
    name: 'Master Adventurer',
    description: 'Menyelesaikan seluruh misi utama dan tantangan kronologi waktu.',
    icon: '👑',
    isUnlocked: false
  },
  {
    id: 'badge-nusantara-explorer',
    name: 'Nusantara Explorer',
    description: 'Menyingkap misteri Chronicle Compass dan bersiap menuju Jakarta.',
    icon: '🌟',
    isUnlocked: false
  }
];
