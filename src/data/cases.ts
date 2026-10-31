import { HistoricalCase } from '../types';

export const HISTORICAL_CASES: HistoricalCase[] = [
  {
    id: 'case-01',
    code: 'KASUS-01/1945',
    title: 'Rengasdengklok: The Missing Answer',
    subtitle: 'Misteri Pengamanan Dua Proklamator Menjelang Fajar Kemerdekaan',
    year: 1945,
    difficulty: 'Menengah',
    summary: 'Pada 16 Agustus 1945 dini hari, Jakarta mendadak kehilangan dua tokoh bangsa terpenting: Soekarno dan Mohammad Hatta. Apa motif tersembunyi di balik tindakan dramatis pemuda membawa mereka ke sebuah desa terpencil di Karawang?',
    learningGoals: [
      'Memahami situasi vacuum of power (kekosongan kekuasaan) akibat menyerahnya Jepang pada Perang Pasifik.',
      'Menganalisis perbedaan ideologis mendasar antara Golongan Muda dan Golongan Tua.',
      'Menjelaskan alasan pemilihan Rengasdengklok sebagai lokasi pengamanan strategis.',
      'Menghubungkan kompromi di Rengasdengklok dengan pelaksanaan Proklamasi Kemerdekaan 17 Agustus 1945.'
    ],
    mainQuestion: 'Mengapa Soekarno dan Mohammad Hatta dibawa ke Rengasdengklok pada 16 Agustus 1945, dan bagaimana peristiwa tersebut berkaitan langsung dengan percepatan Proklamasi Kemerdekaan Indonesia?',
    briefing: {
      coordinatorName: 'Nara Larasati',
      coordinatorRole: 'Koordinator Unit Investigasi Arsip Jejak Nusantara',
      caseFileNumber: 'JN-CAS-1945-0816',
      historicalContext: 'Agustus 1945 adalah pusaran waktu paling menentukan dalam sejarah modern Indonesia. Kekaisaran Jepang hancur setelah bom atom menghantam Hiroshima dan Nagasaki. Namun di Batavia, ketegangan antar-kelompok pejuang kemerdekaan justru meledak akibat perbedaan cara memandang momentum emas kemerdekaan.',
      coordinatorMessage: [
        'Selamat datang di Unit Investigasi Arsip Jejak Nusantara, Rekan Detektif.',
        'Berkas yang Anda pegang bukanlah teka-teki fiksi, melainkan rekaman peristiwa genting yang menentukan takdir bangsa kita: Peristiwa Rengasdengklok, 16 Agustus 1945.',
        'Dua tokoh sentral, Soekarno dan Mohammad Hatta, menghilang dari kediaman mereka sebelum subuh. Desas-desus penculikan beredar di Batavia yang masih dijaga ketat oleh serdadu Jepang (Kenpeitai).',
        'Tugas Anda: telusuri dokumen sejarah, periksa bukti-bukti di lokasi kejadian, pecahkan teka-teki sandi dan kronologi, hubungkan benang merah di Evidence Board, dan simpulkan apa yang sesungguhnya terjadi di balik peristiwa tersebut.',
        'Ingat prinsip kita: "Setiap Sejarah Menyimpan Petunjuk. Jangan menduga tanpa bukti, jangan menarik kesimpulan tanpa fakta."'
      ]
    },
    scenes: [
      {
        id: 'scene-jakarta-youth',
        title: 'Markas Pemuda Menteng 31 & Pegangsaan',
        subtitle: 'Jakarta, 15 Agustus 1945 — Malam Ketegangan',
        backdropTheme: 'dark-room',
        description: 'Ruang pertemuan rahasia para pemuda pejuang di Jl. Menteng 31 dan berlanjut ke beranda rumah Bung Karno di Pegangsaan Timur 56. Suasana hening namun penuh gejolak setelah kabar menyerahnya Jepang bocor.',
        objects: [
          {
            id: 'obj-radio-clandestine',
            name: 'Radio Gelombang Pendek Gelap',
            area: 'Meja Operator Radio',
            x: 22,
            y: 46,
            iconType: 'radio',
            description: 'Pesawat radio siaran luar negeri yang disegel oleh tentara Jepang, namun kawat segelnya telah dirusak secara rahasia.',
            detailedInspection: 'Radio penerima gelombang pendek yang digunakan para pemuda untuk memonitor siaran radio Sekutu (BBC & San Francisco). Pada tanggal 14-15 Agustus 1945, siaran mengumumkan Kaisar Hirohito membacakan Deklarasi Penyerahan Jepang tanpa syarat kepada Sekutu.',
            givesEvidenceId: 'ev-01',
            isExamined: false,
          },
          {
            id: 'obj-ppki-documents',
            name: 'Berkas Dokumen Stempel Gunseikan',
            area: 'Laci Meja Kerja Tokoh Tua',
            x: 48,
            y: 62,
            iconType: 'document',
            description: 'Tumpukan dokumen bertuliskan kanji dan bahasa Melayu mengenai pembentukan Panitia Persiapan Kemerdekaan Indonesia (PPKI).',
            detailedInspection: 'Dokumen keputusan pembentukan Dokuritsu Zyunbi Iinkai (PPKI) yang dibentuk Jepang. Bagi golongan muda, memproklamasikan kemerdekaan lewat PPKI akan mencap Republik Indonesia sebagai "hadiah" atau boneka buatan Tokyo di mata Sekutu.',
            givesEvidenceId: 'ev-02',
            isExamined: false,
          },
          {
            id: 'obj-menteng31-manifesto',
            name: 'Notula Risalah Rapat Pemuda',
            area: 'Papan Tulis Rahasia',
            x: 74,
            y: 35,
            iconType: 'document',
            description: 'Catatan tulisan tangan dari rapat pemuda di Laboratorium Bakteriologi Pegangsaan Timur dipimpin Chaerul Saleh.',
            detailedInspection: 'Hasil rapat pemuda pada 15 Agustus 1945 pukul 20.30 WIB: Menolak segala bentuk keterlibatan janji Jepang dan menuntut kemerdekaan diproklamasikan malam itu juga oleh rakyat Indonesia sendiri tanpa campur tangan balatentara Dai Nippon.',
            givesEvidenceId: 'ev-03',
            isExamined: false,
          },
          {
            id: 'obj-confrontation-notes',
            name: 'Catatan Perdebatan Panas di Pegangsaan Timur 56',
            area: 'Meja Ruang Tamu Soekarno',
            x: 85,
            y: 68,
            iconType: 'magnifier',
            description: 'Catatan saksi mata mengenai perdebatan tajam antara Wikana dan Bung Karno sekitar pukul 22.00 WIB.',
            detailedInspection: 'Wikana berkata dengan lantang: "Apabila Bung Karno tidak mau mengucapkan pengumuman itu malam ini juga, besok akan terjadi pertumpahan darah!" Bung Karno menjawab tegas: "Ini leher saya, seretlah saya ke pojok itu dan potonglah leher saya malam ini juga, jangan menunggu besok!" Bung Karno menolak didikte dan menegaskan perlunya perhitungan matang agar rakyat tidak dibantai serdadu Jepang.',
            givesEvidenceId: 'ev-04',
            isExamined: false,
          }
        ]
      },
      {
        id: 'scene-rengasdengklok-house',
        title: 'Kediaman Djiaw Kie Siong & Asrama PETA',
        subtitle: 'Rengasdengklok, Karawang — 16 Agustus 1945',
        backdropTheme: 'cork-wood',
        description: 'Sebuah rumah berdinding anyaman bambu milik petani Tionghoa di bantaran Sungai Citarum, terlindung oleh barikade pasukan Pembela Tanah Air (PETA) Karawang.',
        objects: [
          {
            id: 'obj-military-map',
            name: 'Peta Taktis Karawang & Jalur Citarum',
            area: 'Dinding Bambu Markas PETA',
            x: 28,
            y: 38,
            iconType: 'map',
            description: 'Peta militer lokal yang menunjukkan jalur transportasi darat dan sungai antara Batavia, Karawang, dan Rengasdengklok.',
            detailedInspection: 'Peta menunjukkan posisi strategis Rengasdengklok: berada sekitar 80 km timur Batavia, jauh dari markas tentara Jepang (Kenpeitai), dan dikawal penuh oleh satu kompi (Cudan) tentara PETA di bawah Daidan Purwakarta pimpinan Daidancho Kasman Singodimedjo serta Shodanco Singgih.',
            givesEvidenceId: 'ev-05',
            isExamined: false,
          },
          {
            id: 'obj-safe-box',
            name: 'Peti Sandi Telegraf Komando PETA',
            area: 'Sudut Meja Komando Singgih',
            x: 52,
            y: 58,
            iconType: 'safe',
            description: 'Kotak kayu berkunci sandi 4 angka yang menyimpan catatan pembicaraan rahasia antara Shodanco Singgih, Sukarni, dan Bung Karno di Rengasdengklok.',
            detailedInspection: 'Peti ini disegel dengan kombinasi angka sandi. Petunjuk pada gembok bertuliskan: "Kombinasi sandi adalah Hari dan Bulan tibanya Bung Karno di bumi Rengasdengklok (DDMM)."',
            triggersPuzzleId: 'cipher-rengasdengklok',
            isExamined: false,
          },
          {
            id: 'obj-djiaw-house-log',
            name: 'Buku Catatan Singgah Rumah Djiaw Kie Siong',
            area: 'Meja Makan Kayu Jati',
            x: 72,
            y: 65,
            iconType: 'person',
            description: 'Catatan kondisi di rumah petani Djiaw Kie Siong tempat Soekarno, Hatta, Fatmawati, dan bayi Guntur beristirahat selama di Rengasdengklok.',
            detailedInspection: 'Rumah Djiaw Kie Siong dipilih karena letaknya terpencil, aman di tepi Sungai Citarum, dan pemiliknya sangat simpatik pada perjuangan kemerdekaan. Di rumah ini, Bung Karno dan Bung Hatta tidak disiksa atau diperlakukan kasar, melainkan dilindungi dan diajak berdiskusi tentang kesiapan proklamasi.',
            givesEvidenceId: 'ev-06',
            isExamined: false,
          },
          {
            id: 'obj-subardjo-telegram',
            name: 'Kawat Sandi Jaminan Mr. Achmad Soebardjo',
            area: 'Tas Kurir Penghubung Yusuf Kunto',
            x: 88,
            y: 42,
            iconType: 'document',
            description: 'Pesan jaminan yang dibawa oleh Mr. Achmad Soebardjo dan Jusuf Kunto dari Jakarta pada sore hari 16 Agustus 1945.',
            detailedInspection: 'Mr. Achmad Soebardjo memberikan jaminan dengan taruhan nyawanya kepada para pemuda: "Saya menjamin bahwa Proklamasi Kemerdekaan Indonesia akan diumumkan besok pada tanggal 17 Agustus 1945 selambat-lambatnya pukul 12.00 siang. Jika tidak berhasil, taruhannya adalah leher saya!" Berdasarkan jaminan ini, Cudanco Subeno mengizinkan Soekarno-Hatta kembali ke Batavia.',
            givesEvidenceId: 'ev-07',
            isExamined: false,
          }
        ]
      },
      {
        id: 'scene-batavia-maeda',
        title: 'Ruang Telaah Menuju Jakarta',
        subtitle: 'Batavia, 16 Agustus 1945 Malam — Jalan Menuju Kemerdekaan',
        backdropTheme: 'library',
        description: 'Malam 16 Agustus 1945 pukul 23.00 WIB. Rombongan tiba kembali di Jakarta dan langsung bergerak ke rumah Laksamana Muda Tadashi Maeda di Meiji Dori (Jl. Imam Bonjol No. 1) untuk merumuskan naskah proklamasi.',
        objects: [
          {
            id: 'obj-maeda-study',
            name: 'Catatan Kesepakatan Rumah Maeda',
            area: 'Meja Bundar Perundingan',
            x: 35,
            y: 50,
            iconType: 'document',
            description: 'Ringkasan mengenai mengapa rumah Laksamana Maeda dipilih sebagai tempat penyusunan naskah proklamasi.',
            detailedInspection: 'Rumah Laksamana Maeda di Jalan Imam Bonjol No. 1 dipilih karena memiliki hak imunitas ekstra-teritorial Angkatan Laut Jepang (Kaigun), sehingga Angkatan Darat Jepang (Rikugun/Kenpeitai) tidak dapat sembarangan menggerebek. Di sinilah teks proklamasi diketik oleh Sayuti Melik setelah dirumuskan bersama.',
            givesEvidenceId: 'ev-08',
            isExamined: false,
          },
          {
            id: 'obj-historical-comparison',
            name: 'Buku Komparasi Pandangan Dua Golongan',
            area: 'Rak Buku Arsip',
            x: 68,
            y: 40,
            iconType: 'magnifier',
            description: 'Kajian mendalam perbedaan pandangan taktis antara Golongan Muda dan Golongan Tua.',
            detailedInspection: 'Perbedaan bukan pada tujuan ("apakah merdeka atau tidak"), melainkan cara dan waktu ("bagaimana memproklamasikannya"). Pemuda menginginkan proklamasi radikal sebagai penegasan kedaulatan mandiri; kaum tua menginginkan kehati-hatian diplomatik untuk menghindari pembantaian oleh tentara Jepang yang masih bersenjata lengkap.',
            givesEvidenceId: 'ev-09',
            isExamined: false,
          }
        ]
      }
    ],
    evidences: [
      {
        id: 'ev-01',
        title: 'Berita Siaran Radio Penyerahan Jepang (15 Agustus 1945)',
        category: 'KORAN & TELEGRAM',
        shortDesc: 'Informasi intelijen mengenai kapitulasi tanpa syarat Kekaisaran Jepang kepada tentara Sekutu.',
        fullDesc: 'Pada 15 Agustus 1945, Kaisar Hirohito mengumumkan penyerahan Jepang tanpa syarat dalam siaran Gyokuon-hoso menyusul kehancuran Hiroshima dan Nagasaki. Berita ini berhasil ditangkap oleh pemuda Indonesia (termasuk Sutan Sjahrir) melalui radio gelap yang dilarang penguasa militer Jepang. Ini menciptakan situasi vacuum of power (kekosongan kekuasaan).',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Arsip Nasional Republik Indonesia (ANRI) & Sutan Sjahrir, Pikiran dan Tindakan (1947).',
        dateOrEra: '15 Agustus 1945',
        location: 'Jakarta',
        relatedEntities: ['Sutan Sjahrir', 'Kaisar Hirohito', 'Sekutu', 'Golongan Muda'],
        isKeyClue: true,
        highlightDetails: [
          'Jepang menyerah tanpa syarat pada 15 Agustus 1945.',
          'Menciptakan vacuum of power di Hindia Belanda.',
          'Sutan Sjahrir yang pertama kali mendesak Bung Karno memproklamasikan kemerdekaan.'
        ]
      },
      {
        id: 'ev-02',
        title: 'Berkas Resmi Mandat PPKI (Dokuritsu Zyunbi Iinkai)',
        category: 'DOKUMEN',
        shortDesc: 'Dokumen pembentukan Panitia Persiapan Kemerdekaan Indonesia berstempel penguasa militer Jepang.',
        fullDesc: 'PPKI dibentuk pada 7 Agustus 1945 dengan izin Marsekal Terauchi di Dalat, Vietnam. Golongan Tua berpendapat proklamasi harus disahkan melalui sidang PPKI agar sah secara hukum ketatanegaraan. Sebaliknya, Golongan Muda menolak keras PPKI karena menganggap kemerdekaan lewat badan bentukan Jepang akan membuat Republik dicap sebagai "hadiah" atau boneka fasis di hadapan Sekutu.',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Risalah Badan Penyelidik Usaha-Usaha Persiapan Kemerdekaan Indonesia (BPUPKI) - PPKI (Sekretariat Negara RI, 1995).',
        dateOrEra: '7 - 14 Agustus 1945',
        location: 'Jakarta / Dalat Vietnam',
        relatedEntities: ['PPKI', 'Ir. Soekarno', 'Mohammad Hatta', 'Marsekal Terauchi'],
        isKeyClue: true,
        highlightDetails: [
          'PPKI beranggotakan 21 orang perwakilan daerah.',
          'Golongan Muda mencurigai PPKI sebagai perpanjangan tangan Jepang.',
          'Golongan Tua ingin menghindari pertumpahan darah dengan aparat militer Jepang.'
        ]
      },
      {
        id: 'ev-03',
        title: 'Risalah Rapat Rahasia Pemuda di Menteng 31',
        category: 'DOKUMEN',
        shortDesc: 'Keputusan para tokoh muda untuk melepaskan ikatan janji kemerdekaan dari pihak Jepang.',
        fullDesc: 'Pada 15 Agustus 1945 sekitar pukul 20.00 WIB, para pemuda (Chaerul Saleh, Sukarni, Wikana, Sayuti Melik, Yusuf Kunto, dll) berkumpul di Laboratorium Bakteriologi Pegangsaan Timur. Mereka sepakat bahwa kemerdekaan Indonesia adalah hak dan urusan rakyat Indonesia sendiri, sama sekali bukan urusan pemerintah militer Jepang.',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Adam Malik, Riwayat Proklamasi Agustus 1945 (Widjaya, Jakarta 1962).',
        dateOrEra: '15 Agustus 1945, 20.00 WIB',
        location: 'Pegangsaan Timur / Menteng 31, Jakarta',
        relatedEntities: ['Chaerul Saleh', 'Sukarni', 'Wikana', 'Sayuti Melik'],
        isKeyClue: true,
        highlightDetails: [
          'Dipimpin oleh Chaerul Saleh.',
          'Menolak kemerdekaan sebagai hadiah Jepang.',
          'Mengutus Wikana dan Darwis menemui Soekarno malam itu juga.'
        ]
      },
      {
        id: 'ev-04',
        title: 'Transkrip Saksi: Perdebatan Malam di Pegangsaan Timur 56',
        category: 'KESAKSIAN',
        shortDesc: 'Perdebatan dramatis antara perwakilan pemuda dan Bung Karno mengenai momentum proklamasi.',
        fullDesc: 'Wikana dan Darwis tiba di rumah Bung Karno sekitar pukul 22.00 WIB di hadapan Moh. Hatta, Ahmad Soebardjo, dan Buntaran. Wikana menuntut proklamasi diumumkan besok pagi (16 Agustus) atau darah akan tertumpah. Soekarno menolak ultimatum tersebut: "Kekuatan kita tidak sebanding dengan serdadu Jepang yang masih lengkap senjatanya. Kita harus menghitung dengan kepala dingin."',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Mohammad Hatta, Memoir: Sekitar Proklamasi (Tintamas, Jakarta 1970).',
        dateOrEra: '15 Agustus 1945, 22.00 WIB',
        location: 'Pegangsaan Timur 56, Jakarta',
        relatedEntities: ['Ir. Soekarno', 'Moh. Hatta', 'Wikana', 'Achmad Soebardjo'],
        isKeyClue: true,
        highlightDetails: [
          'Pertentangan tajam antara desakan pemuda dan pertimbangan realistis Bung Karno.',
          'Bung Karno tidak gentar menghadapi ancaman fisik pemuda.',
          'Ketidaksepakatan ini memicu rencana aksi pemuda menjauhkan Soekarno-Hatta dari Jakarta.'
        ]
      },
      {
        id: 'ev-05',
        title: 'Peta Strategis Wilayah Militer PETA Karawang - Rengasdengklok',
        category: 'PETA',
        shortDesc: 'Analisis alasan mengapa Rengasdengklok dipilih sebagai tempat pengamanan.',
        fullDesc: 'Rengasdengklok dipilih bukan secara acak. Desa ini terletak sekitar 15 km utara Karawang, dikelilingi hutan dan sawah dengan batas alam Sungai Citarum. Di sana terdapat Batalion PETA (Pembela Tanah Air) di bawah komando Daidan Purwakarta, di mana komandan peletonnya (Shodanco Singgih) sangat loyal kepada kaum muda. Bila serdadu Jepang menyerang dari Jakarta, pertahanan gerilya dapat dipersiapkan dengan mudah.',
        sourceStatus: 'REKONSTRUKSI UNTUK GAME',
        sourceReference: 'Berdasarkan data historis Markas PETA Jawa Barat dan Sejarah TNI AD (Disjarahad).',
        dateOrEra: '16 Agustus 1945',
        location: 'Rengasdengklok, Karawang',
        relatedEntities: ['Shodanco Singgih', 'Daidan Purwakarta', 'PETA'],
        isKeyClue: true,
        highlightDetails: [
          'Berjarak aman dari markas Kenpeitai di Batavia.',
          'Dikuasai oleh kekuatan pasukan PETA pribumi.',
          'Akses jalur darat dan sungai memudahkan pertahanan dan pelarian darurat.'
        ]
      },
      {
        id: 'ev-06',
        title: 'Laporan Singgah Rumah Djiaw Kie Siong',
        category: 'FOTO SEJARAH',
        shortDesc: 'Rumah tinggal petani Tionghoa tempat perlindungan Soekarno, Hatta, dan Ibu Fatmawati.',
        fullDesc: 'Awalnya Bung Karno dan Bung Hatta dibawa ke markas PETA Rengasdengklok. Namun karena barak militer terlalu mencolok bagi patroli udara atau mata-mata musuh, Shodanco Singgih memindahkan mereka ke rumah Djiaw Kie Siong, seorang petani dan perajin keturunan Tionghoa di Kampung Bojong. Tindakan ini membuktikan bahwa peristiwa Rengasdengklok bukanlah "penculikan kriminal untuk menyakiti", melainkan tindakan pengamanan politik (evakuasi preventif) dari jangkauan intimidasi Jepang.',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Museum Rumah Sejarah Djiaw Kie Siong, Rengasdengklok, Jawa Barat & Disjarah TNI.',
        dateOrEra: '16 Agustus 1945',
        location: 'Kp. Bojong, Rengasdengklok',
        relatedEntities: ['Djiaw Kie Siong', 'Fatmawati', 'Ir. Soekarno', 'Moh. Hatta'],
        isKeyClue: true,
        highlightDetails: [
          'Bung Karno dan Bung Hatta diperlakukan sangat hormat, bukan tawanan.',
          'Tujuan utama: menjauhkan kedua tokoh dari tekanan dan pengaruh militer Jepang di Jakarta.',
          'Keterlibatan warga etnis Tionghoa setempat dalam melindungi para tokoh proklamator.'
        ]
      },
      {
        id: 'ev-07',
        title: 'Kawat Kesepakatan & Jaminan Nyawa Mr. Achmad Soebardjo',
        category: 'DOKUMEN',
        shortDesc: 'Pernyataan bersejarah Achmad Soebardjo yang meyakinkan para pemuda mengizinkan Soekarno-Hatta kembali ke Jakarta.',
        fullDesc: 'Pada 16 Agustus 1945 sore hari, Mr. Achmad Soebardjo (tokoh Golongan Tua) bersama Jusuf Kunto berhasil tiba di Rengasdengklok. Terjadi negosiasi tegang dengan Cudanco Subeno dan Sukarni. Soebardjo meyakinkan pemuda dengan taruhan nyawanya sendiri bahwa Proklamasi pasti diumumkan paling lambat 17 Agustus pukul 12.00 siang di Jakarta. Berbekal janji tersebut, pemuda sepakat memulangkan Soekarno-Hatta.',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Achmad Soebardjo Djoyoadisuryo, Kesadaran Nasional: Sebuah Otobiografi (Gunung Agung, 1978).',
        dateOrEra: '16 Agustus 1945, 17.30 WIB',
        location: 'Rengasdengklok',
        relatedEntities: ['Mr. Achmad Soebardjo', 'Cudanco Subeno', 'Sukarni', 'Jusuf Kunto'],
        isKeyClue: true,
        highlightDetails: [
          'Jaminan leher Achmad Soebardjo sebagai garansi kepastian proklamasi.',
          'Pemuda menyetujui kompromi dengan syarat proklamasi diumumkan di Jakarta.',
          'Rombongan bertolak kembali ke Jakarta pada pukul 21.00 WIB malam itu juga.'
        ]
      },
      {
        id: 'ev-08',
        title: 'Memorandum Rumah Laksamana Maeda (Jl. Imam Bonjol No. 1)',
        category: 'DOKUMEN',
        shortDesc: 'Pemberhentian pertama setibanya di Batavia untuk merumuskan naskah kemerdekaan.',
        fullDesc: 'Setelah kembali dari Rengasdengklok, Soekarno dan Hatta sempat menemui Mayor Jenderal Moichiro Yamamoto (Gunseikan) yang menolak bertemu, lalu menemui Mayor Jenderal Nishimura (Kepala Departemen Umum). Nishimura melarang tegas perubahan status quo. Sadar bahwa Jepang tak bisa lagi diajak kompromi, Soekarno-Hatta menuju rumah Laksamana Maeda untuk menyusun naskah proklamasi secara mandiri.',
        sourceStatus: 'SUMBER SEJARAH RESMI',
        sourceReference: 'Nugroho Notosusanto, Menjelang Proklamasi (Pusat Sejarah ABRI, 1975).',
        dateOrEra: '16 Agustus 1945, 23.30 WIB',
        location: 'Jl. Imam Bonjol No. 1, Jakarta',
        relatedEntities: ['Laksamana Tadashi Maeda', 'Ir. Soekarno', 'Moh. Hatta', 'Sayuti Melik'],
        isKeyClue: true,
        highlightDetails: [
          'Jepang menolak proklamasi demi mematuhi perintah status quo dari Sekutu.',
          'Rumah Maeda dipilih karena perlindungan hak teritorial Angkatan Laut.',
          'Peristiwa Rengasdengklok berhasil meyakinkan Soekarno bahwa proklamasi harus segera dikumandangkan tanpa menunggu rapat PPKI.'
        ]
      },
      {
        id: 'ev-09',
        title: 'Analisis Komparatif: Sengketa Taktis Golongan Muda vs Golongan Tua',
        category: 'PROFIL TOKOH',
        shortDesc: 'Telaah mendalam sintesis antara keberanian pemuda dan kalkulasi matang para pendiri bangsa.',
        fullDesc: 'Peristiwa Rengasdengklok kerap disalahpahami sebagai permusuhan murni. Padahal secara historis, kedua kubu memiliki cita-cita yang identik: kemerdekaan penuh Indonesia. Golongan Muda menyediakan energi, keberanian, dan dorongan moral revolusioner; sedangkan Golongan Tua menyediakan otoritas kharismatik, strategi hukum, dan pencegahan bentrokan massal dengan tentara Jepang yang masih memegang senjata mesin.',
        sourceStatus: 'CATATAN INVESTIGASI',
        sourceReference: 'M.C. Ricklefs, A History of Modern Indonesia since c. 1200 (Stanford University Press, 2008).',
        dateOrEra: 'Kajian Sejarah Kritis',
        location: 'Analisis Unit Jejak Nusantara',
        relatedEntities: ['Golongan Muda', 'Golongan Tua'],
        isKeyClue: false,
        highlightDetails: [
          'Kedua golongan saling melengkapi satu sama lain.',
          'Tanpa desakan pemuda, proklamasi bisa tertunda karena menunggu persetujuan resmi Jepang.',
          'Tanpa kehati-hatian kaum tua, pergerakan kemerdekaan berisiko dihancurkan serdadu bersenjata Jepang.'
        ]
      }
    ],
    validConnections: [
      {
        fromId: 'ev-01',
        toId: 'ev-03',
        relationLabel: 'Memicu Aksi Revolusioner',
        explanation: 'Kabar siaran radio kekalahan Jepang tanpa syarat (ev-01) langsung mendorong para pemuda Menteng 31 (ev-03) untuk menggelar rapat rahasia mendesak kemerdekaan mandiri.'
      },
      {
        fromId: 'ev-02',
        toId: 'ev-03',
        relationLabel: 'Menolak Ketergantungan PPKI',
        explanation: 'Golongan muda (ev-03) menolak keras proklamasi disahkan melalui PPKI bentukan Jepang (ev-02) karena khawatir kemerdekaan dicap sebagai boneka buatan Tokyo di mata Sekutu.'
      },
      {
        fromId: 'ev-04',
        toId: 'ev-05',
        relationLabel: 'Menyebabkan Keputusan Pengamanan',
        explanation: 'Kebuntuan debat panas di Pegangsaan Timur 56 (ev-04) mendorong pemuda mengevakuasi Soekarno-Hatta ke basis aman PETA di Rengasdengklok (ev-05) agar terbebas dari intervensi Jepang.'
      },
      {
        fromId: 'ev-05',
        toId: 'ev-06',
        relationLabel: 'Lokasi Perlindungan Nyata',
        explanation: 'Di wilayah Rengasdengklok (ev-05), rombongan diamankan di rumah warga sipil Djiaw Kie Siong (ev-06) demi kerahasiaan maksimal dari intaian intelijen Jepang.'
      },
      {
        fromId: 'ev-07',
        toId: 'ev-08',
        relationLabel: 'Kesepakatan Kembali ke Ibu Kota',
        explanation: 'Jaminan nyawa Mr. Achmad Soebardjo (ev-07) meyakinkan pemuda untuk memulangkan Soekarno-Hatta langsung ke rumah Laksamana Maeda di Jakarta (ev-08) guna merumuskan proklamasi.'
      }
    ],
    timelineCards: [
      {
        id: 'tc-01',
        timestamp: '14-15 Agustus 1945',
        title: 'Berita Menyerahnya Jepang Didengar Lewat Radio Gelap',
        description: 'Sutan Sjahrir dan para pemuda memonitor siaran radio luar negeri mengenai kapitulasi tanpa syarat Kekaisaran Jepang kepada Sekutu.',
        evidenceHint: 'Lihat Bukti ev-01 (Siaran Radio Penyerahan Jepang).',
        correctOrder: 1
      },
      {
        id: 'tc-02',
        timestamp: '15 Agustus 1945 (Pukul 20.00 WIB)',
        title: 'Rapat Rahasia Pemuda di Pegangsaan Timur / Menteng 31',
        description: 'Dipimpin Chaerul Saleh, para pemuda menolak kemerdekaan sebagai hadiah Jepang dan sepakat menuntut proklamasi mandiri.',
        evidenceHint: 'Lihat Bukti ev-03 (Risalah Rapat Rahasia Pemuda).',
        correctOrder: 2
      },
      {
        id: 'tc-03',
        timestamp: '15 Agustus 1945 (Pukul 22.00 WIB)',
        title: 'Perdebatan Sengit Wikana vs Bung Karno',
        description: 'Utusan pemuda mendesak Soekarno di Pegangsaan Timur 56. Bung Karno menolak diultimatum demi menghindari pertumpahan darah rakyat.',
        evidenceHint: 'Lihat Bukti ev-04 (Perdebatan Malam di Pegangsaan Timur 56).',
        correctOrder: 3
      },
      {
        id: 'tc-04',
        timestamp: '16 Agustus 1945 (Pukul 04.00 WIB)',
        title: 'Soekarno & Hatta Dibawa Menuju Rengasdengklok',
        description: 'Sukarni, Jusuf Kunto, dan Shodanco Singgih mengawal Soekarno dan Hatta keluar Jakarta menuju basis PETA Karawang.',
        evidenceHint: 'Lihat Bukti ev-05 (Peta Strategis Wilayah PETA Rengasdengklok).',
        correctOrder: 4
      },
      {
        id: 'tc-05',
        timestamp: '16 Agustus 1945 (Pukul 17.30 WIB)',
        title: 'Perundingan & Jaminan Nyawa Mr. Achmad Soebardjo',
        description: 'Mr. Achmad Soebardjo tiba di Rengasdengklok dan mempertaruhkan lehernya agar Soekarno-Hatta diizinkan kembali ke Jakarta.',
        evidenceHint: 'Lihat Bukti ev-07 (Jaminan Nyawa Mr. Achmad Soebardjo).',
        correctOrder: 5
      },
      {
        id: 'tc-06',
        timestamp: '16 Agustus 1945 (Pukul 23.00 WIB)',
        title: 'Rombongan Tiba di Jakarta Menuju Rumah Maeda',
        description: 'Setelah perundingan dengan pihak militer Jepang menemui jalan buntu, naskah proklamasi disusun di kediaman Laksamana Tadashi Maeda.',
        evidenceHint: 'Lihat Bukti ev-08 (Memorandum Rumah Maeda).',
        correctOrder: 6
      }
    ],
    matchingPairs: [
      {
        id: 'fig-01',
        figureName: 'Ir. Soekarno & Mohammad Hatta',
        roleDescription: 'Pemimpin Golongan Tua yang menghendaki pembicaraan proklamasi secara cermat agar tidak terjadi pertumpahan darah dengan militer Jepang.',
        correctRoleKey: 'role-tua',
        context: 'Menolak tekanan pemuda untuk mengumumkan proklamasi secara tergesa-gesa tanpa perhitungan militer.'
      },
      {
        id: 'fig-02',
        figureName: 'Chaerul Saleh & Wikana',
        roleDescription: 'Eksponen Golongan Muda yang memimpin rapat pemuda dan melontarkan desakan keras proklamasi segera.',
        correctRoleKey: 'role-muda-desak',
        context: 'Menginginkan proklamasi dilepaskan total dari bayang-bayang janji maupun lembaga bentukan Jepang.'
      },
      {
        id: 'fig-03',
        figureName: 'Shodanco Singgih & Sukarni',
        roleDescription: 'Perwira PETA dan pemuda lapangan yang bertugas mengeksekusi pengamanan Soekarno-Hatta ke Rengasdengklok.',
        correctRoleKey: 'role-lapangan',
        context: 'Mengawal rombongan dengan kendaraan militer dan menempatkan mereka di bawah perlindungan batalion PETA.'
      },
      {
        id: 'fig-04',
        figureName: 'Mr. Achmad Soebardjo',
        roleDescription: 'Tokoh senior penengah yang menjamin kepastian proklamasi dengan taruhan nyawanya kepada para pemuda.',
        correctRoleKey: 'role-penengah',
        context: 'Menjemput Soekarno-Hatta di Rengasdengklok dan memfasilitasi perumusan di kediaman Maeda.'
      },
      {
        id: 'fig-05',
        figureName: 'Djiaw Kie Siong',
        roleDescription: 'Warga sipil keturunan Tionghoa yang merelakan kediamannya menjadi tempat bernaung proklamator demi keamanan.',
        correctRoleKey: 'role-tuan-rumah',
        context: 'Rumahnya di tepi Kali Citarum Kampung Bojong menjadi saksi bisu pengamanan Bung Karno dan Bung Hatta.'
      }
    ],
    cipherPuzzle: {
      id: 'cipher-rengasdengklok',
      title: 'Kotak Sandi Disposisi PETA Rengasdengklok',
      scenario: 'Peti komando PETA di markas Rengasdengklok terkunci gembok empat digit angka. Pada tutup kotak tertera ukiran bertuliskan: "Sandi komando adalah tanggal keramat ketika Bung Karno dan Bung Hatta diamankan tiba di tanah Rengasdengklok (Format: 2 Digit Hari + 2 Digit Bulan)."',
      clueReference: 'Peristiwa Rengasdengklok terjadi pada tanggal 16 Agustus 1945. Masukkan 2 digit hari (16) dan 2 digit bulan Agustus (08).',
      codeLength: 4,
      correctCode: '1608',
      explanation: 'Kode 1608 melambangkan tanggal 16 Agustus (bulan 08), hari bersejarah di mana Soekarno dan Hatta diamankan di Rengasdengklok sebelum kesepakatan Proklamasi dicapai.',
      hint1: 'Perhatikan tanggal berapa Soekarno dan Hatta dibawa keluar dari Jakarta.',
      hint2: 'Formatnya adalah DDMM (Hari dua digit, Bulan dua digit). Agustus adalah bulan ke-8.'
    },
    deductionQuestion: 'Berdasarkan bukti-bukti yang telah dikumpulkan dan dianalisis, apa hakikat sesungguhnya dari Peristiwa Rengasdengklok dan bagaimana dampaknya terhadap Proklamasi Kemerdekaan?',
    deductionOptions: [
      {
        id: 'opt-a',
        statement: 'Peristiwa Rengasdengklok adalah pemberontakan kriminal oleh pemuda bersenjata untuk menggulingkan kepemimpinan Soekarno-Hatta yang dinilai berkhianat kepada bangsa.',
        isCorrect: false,
        explanation: 'Kurang tepat. Bukti sejarah (ev-04, ev-06) membuktikan Soekarno-Hatta diperlakukan sangat hormat. Tidak ada motif menggulingkan, melainkan mendesak proklamasi mandiri.'
      },
      {
        id: 'opt-b',
        statement: 'Tindakan pengamanan politik oleh Golongan Muda untuk menjauhkan Soekarno-Hatta dari intimidasi dan pengaruh militer Jepang di Jakarta, sehingga kedua tokoh terdorong memproklamasikan kemerdekaan atas nama kekuatan bangsa sendiri di luar kehendak Jepang.',
        isCorrect: true,
        explanation: 'Tepat sekali! Dokumen dan kesaksian (ev-01 s/d ev-08) menegaskan bahwa tindakan ini dilandasi kekhawatiran bahwa Jepang akan menghalangi proklamasi atau menjadikan Republik sebagai hadiah PPKI. Kompromi di Rengasdengklok melahirkan kepastian pelaksanaan Proklamasi 17 Agustus 1945.'
      },
      {
        id: 'opt-c',
        statement: 'Peristiwa tersebut dirancang atas instruksi resmi tentara Jepang agar Soekarno dan Hatta bersembunyi dari incaran pasukan Sekutu yang baru mendarat di Pulau Jawa.',
        isCorrect: false,
        explanation: 'Salah. Pihak Jepang (Nishimura/Yamamoto) justru melarang proklamasi dan menuntut status quo dipatuhi. Pasukan Sekutu bahkan belum mendarat di Jakarta pada 16 Agustus 1945.'
      },
      {
        id: 'opt-d',
        statement: 'Sebuah perundingan biasa antar-anggota PPKI yang sengaja memilih lokasi sepi di desa Karawang untuk berlibur menyambut kemerdekaan.',
        isCorrect: false,
        explanation: 'Salah total. Suasana saat itu sangat tegang dan taruhan nyawanya amat nyata (ev-04, ev-07). Pemuda bertindak secara klandestin tanpa sepengetahuan pengurus resmi PPKI.'
      }
    ],
    requiredEvidenceForDeduction: ['ev-01', 'ev-03', 'ev-04', 'ev-05', 'ev-07'],
    historicalDebrief: {
      title: 'Kilas Balik Sejarah: Peristiwa Rengasdengklok 1945',
      whatActuallyHappened: [
        'Pada 15 Agustus 1945, tersiarnya kabar kekalahan Jepang menciptakan vacuum of power di Indonesia.',
        'Golongan Muda menghendaki proklamasi seketika tanpa melalui PPKI agar tidak dianggap bentukan Jepang, sementara Golongan Tua mengkhawatirkan bentrokan bersenjata dengan serdadu Dai Nippon.',
        'Tanggal 16 Agustus 1945 dini hari pukul 04.00 WIB, pemuda membawa Soekarno dan Hatta ke Rengasdengklok guna mengamankan mereka dari tekanan politik dan intimidasi tentara Jepang di Jakarta.',
        'Di Rengasdengklok, Bung Karno dan Bung Hatta ditempatkan di rumah warga etnis Tionghoa, Djiaw Kie Siong, di bawah pengawalan tentara PETA.',
        'Sore hari 16 Agustus 1945, Mr. Achmad Soebardjo tiba dan mempertaruhkan lehernya dengan jaminan bahwa Proklamasi akan dikumandangkan besok siang di Jakarta.',
        'Malam itu juga rombongan kembali ke Batavia dan merumuskan Naskah Proklamasi di kediaman Laksamana Tadashi Maeda di Jalan Meiji Dori (sekarang Jl. Imam Bonjol No. 1).'
      ],
      whyItMatters: 'Peristiwa Rengasdengklok membuktikan dialektika sejarah Indonesia yang luar biasa: keberanian revolusioner para pemuda berpadu harmonis dengan kebijaksanaan diplomatik dan kenegarawanan para tokoh senior. Kemerdekaan Indonesia bukan hadiah Jepang, melainkan hasil perjuangan dan kompromi luhur bangsa sendiri.',
      historicalDebates: 'Terdapat variasi istilah di kalangan sejarawan: sebagian memakai istilah "Penculikan Rengasdengklok" untuk menggambarkan keterkejutan publik saat itu, sementara sejarawan modern lebih condong menggunakan istilah "Pengamanan Politik" atau "Evakuasi Preventif" karena tidak ada kekerasan, pemerasan tebusan, maupun perlakuan merendahkan martabat kedua proklamator.',
      sources: [
        {
          title: 'Arsip Nasional Republik Indonesia (ANRI) - Khazanah Perang Pasifik & Menjelang Proklamasi',
          authorOrInstitution: 'ANRI',
          year: '1945'
        },
        {
          title: 'Memoir: Sekitar Proklamasi 17 Agustus 1945',
          authorOrInstitution: 'Drs. Mohammad Hatta',
          year: '1970'
        },
        {
          title: 'Kesadaran Nasional: Otobiografi Mr. Achmad Soebardjo Djoyoadisuryo',
          authorOrInstitution: 'Mr. Achmad Soebardjo',
          year: '1978'
        },
        {
          title: 'Riwayat Proklamasi Agustus 1945',
          authorOrInstitution: 'Adam Malik',
          year: '1962'
        },
        {
          title: 'Sejarah Nasional Indonesia Jilid VI: Zaman Jepang dan Revolusi Kemerdekaan',
          authorOrInstitution: 'Prof. Dr. Nugroho Notosusanto & Marwati Djoened Poesponegoro (Balai Pustaka)',
          year: '2008'
        },
        {
          title: 'A History of Modern Indonesia since c. 1200 (4th Edition)',
          authorOrInstitution: 'Prof. M.C. Ricklefs (Stanford University Press)',
          year: '2008'
        }
      ]
    },
    isLocked: false
  },
  {
    id: 'case-02',
    code: 'KASUS-02/1945',
    title: 'The Proclamation: Fajar Pegangsaan',
    subtitle: 'Detik-Detik Perumusan dan Kumandang Kemerdekaan Indonesia',
    year: 1945,
    difficulty: 'Menengah',
    summary: 'Bagaimana naskah sakral proklamasi disusun dalam ketegangan tengah malam di kediaman perwira Angkatan Laut Jepang, diketik tergesa-gesa oleh Sayuti Melik, hingga dibacakan di bawah tiang bambu Pegangsaan Timur 56?',
    learningGoals: [
      'Menelusuri proses perumusan kalimat demi kalimat naskah proklamasi oleh Soekarno, Hatta, dan Achmad Soebardjo.',
      'Memahami peran penting Sayuti Melik, BM Diah, Suhud, dan Latief Hendraningrat.',
      'Menganalisis pengibaran Sang Saka Merah Putih jahitan Ibu Fatmawati.'
    ],
    mainQuestion: 'Bagaimana kronologi penyusunan naskah proklamasi hingga pembacaannya, serta mengapa teks tersebut dibacakan di Pegangsaan Timur 56 dan bukan di Lapangan Ikada?',
    briefing: {
      coordinatorName: 'Nara Larasati',
      coordinatorRole: 'Koordinator Unit Investigasi',
      caseFileNumber: 'JN-CAS-1945-0817',
      historicalContext: 'Malam 16 Agustus 1945 hingga fajar 17 Agustus 1945 di Jalan Imam Bonjol No. 1 Jakarta. Di tengah ancaman serdadu Jepang, para pemimpin bangsa merumuskan kalimat kemerdekaan yang abadi.',
      coordinatorMessage: [
        'Kasus berikutnya akan menguji ketelitian Anda merekonstruksi detik-detik pengetikan teks proklamasi dan keputusan taktis memindahkan lokasi pembacaan demi menghindari bentrokan bersenjata di Lapangan Ikada.',
        'Selesaikan Kasus 01 terlebih dahulu untuk membuka akses penuh ke arsip ini.'
      ]
    },
    scenes: [],
    evidences: [],
    validConnections: [],
    timelineCards: [],
    matchingPairs: [],
    deductionQuestion: '',
    deductionOptions: [],
    requiredEvidenceForDeduction: [],
    historicalDebrief: {
      title: 'Proklamasi Kemerdekaan Indonesia',
      whatActuallyHappened: [],
      whyItMatters: '',
      historicalDebates: '',
      sources: []
    },
    isLocked: true
  },
  {
    id: 'case-03',
    code: 'KASUS-03/1945',
    title: 'The Battle of Surabaya: Api Arek Suroboyo',
    subtitle: 'Misteri Gugurnya Jenderal Mallaby dan Perang Terbesar Pasca-Kemerdekaan',
    year: 1945,
    difficulty: 'Tantangan Tinggi',
    summary: 'Oktober-November 1945: Ketegangan memuncak di Hotel Yamato saat bendera Belanda dirobek. Puncaknya, tewasnya Brigadir Jenderal A.W.S. Mallaby memicu ultimatum Sekutu dan pertempuran heroik 10 November.',
    learningGoals: [
      'Menyelidiki insiden perobekan bendera di Hotel Yamato.',
      'Menganalisis misteri mobil Buick dan baku tembak di Jembatan Merah yang menewaskan Mallaby.',
      'Memahami pidato Bung Tomo dan resolusi jihad dalam membakar semangat perlawanan rakyat.'
    ],
    mainQuestion: 'Apa pemicu sejati meletusnya Pertempuran Surabaya dan bagaimana peristiwa 10 November menjadi simbol keteguhan kedaulatan Republik di mata dunia internasional?',
    briefing: {
      coordinatorName: 'Nara Larasati',
      coordinatorRole: 'Koordinator Unit Investigasi',
      caseFileNumber: 'JN-CAS-1945-1110',
      historicalContext: 'Surabaya membara. Pasukan Inggris Divisi Infanteri India ke-23 mendarat di bawah bendera AFNEI. Ultimatum penyerahan senjata dibalas pekik merdeka atau mati.',
      coordinatorMessage: [
        'Arsip ini mencatat bukti-bukti balistik, peta pertahanan Jembatan Merah, dan rekaman audio radio pemberontakan Bung Tomo.',
        'Selesaikan kasus-kasus sebelumnya untuk membuka akses investigasi Surabaya.'
      ]
    },
    scenes: [],
    evidences: [],
    validConnections: [],
    timelineCards: [],
    matchingPairs: [],
    deductionQuestion: '',
    deductionOptions: [],
    requiredEvidenceForDeduction: [],
    historicalDebrief: {
      title: 'Pertempuran 10 November Surabaya',
      whatActuallyHappened: [],
      whyItMatters: '',
      historicalDebates: '',
      sources: []
    },
    isLocked: true
  },
  {
    id: 'case-04',
    code: 'KASUS-04/1946',
    title: 'Bandung Lautan Api: Pengorbanan Kota Kembang',
    subtitle: 'Strategi Bumi Hangus dan Kepahlawanan di Gudang Mesiu Dayeuhkolot',
    year: 1946,
    difficulty: 'Menengah',
    summary: 'Maret 1946: Menghadapi ultimatum Sekutu untuk mengosongkan kota Bandung, para pejuang TRI mengambil keputusan tragis namun heroik: membakar Bandung Selatan agar fasilitas penting tidak dijadikan markas musuh.',
    learningGoals: [
      'Memahami dilema militer Tentara Republik Indonesia (TRI) di bawah pimpinan Kolonel A.H. Nasution.',
      'Meneliti aksi heroik Mohammad Toha dan Ramdan yang meledakkan gudang mesiu Sekutu di Dayeuhkolot.',
      'Menganalisis lahirnya lagu perjuangan "Halo-Halo Bandung".'
    ],
    mainQuestion: 'Mengapa pembumihangusan Bandung Selatan dipilih sebagai strategi pertahanan militer, dan apa dampaknya terhadap konsolidasi gerilya di Jawa Barat?',
    briefing: {
      coordinatorName: 'Nara Larasati',
      coordinatorRole: 'Koordinator Unit Investigasi',
      caseFileNumber: 'JN-CAS-1946-0324',
      historicalContext: 'Bandung terbagi dua: Utara dikuasai Sekutu, Selatan dikuasai TRI dan laskar rakyat. Ultimatum kedua Sekutu menuntut penyerahan total, memicu lahirnya strategi bumi hangus.',
      coordinatorMessage: [
        'Kasus pembakaran kota ini sarat dokumen telegraf rahasia antara markas Yogyakarta dan Bandung Selatan.'
      ]
    },
    scenes: [],
    evidences: [],
    validConnections: [],
    timelineCards: [],
    matchingPairs: [],
    deductionQuestion: '',
    deductionOptions: [],
    requiredEvidenceForDeduction: [],
    historicalDebrief: {
      title: 'Bandung Lautan Api 1946',
      whatActuallyHappened: [],
      whyItMatters: '',
      historicalDebates: '',
      sources: []
    },
    isLocked: true
  },
  {
    id: 'case-05',
    code: 'KASUS-05/1928',
    title: 'The Youth Pledge: Ikrar Satu Jiwa',
    subtitle: 'Kongres Pemuda II dan Lahirnya Konsep Kebangsaan Indonesia',
    year: 1928,
    difficulty: 'Menengah',
    summary: 'Oktober 1928: Puluhan perkumpulan kedaerahan (Jong Java, Jong Sumatranen Bond, Jong Ambon, Jong Batak) berkumpul di Batavia. Bagaimana mereka meruntuhkan sekat primordialisme untuk melahirkan Sumpah Pemuda?',
    learningGoals: [
      'Menelaah dinamika Kongres Pemuda I (1926) hingga Kongres Pemuda II (1928).',
      'Memahami peran Soegondo Djojopoespito, Mohammad Yamin, dan Amir Sjarifuddin.',
      'Menyelidiki momen pertama kali lagu Indonesia Raya dimainkan dengan biola oleh W.R. Soepratman.'
    ],
    mainQuestion: 'Bagaimana perumusan teks Sumpah Pemuda oleh Mohammad Yamin berhasil mengikat keberagaman suku dan bahasa daerah menjadi satu identitas persatuan nusa, bangsa, dan bahasa?',
    briefing: {
      coordinatorName: 'Nara Larasati',
      coordinatorRole: 'Koordinator Unit Investigasi',
      caseFileNumber: 'JN-CAS-1928-1028',
      historicalContext: 'Batavia, 27-28 Oktober 1928 di Gedung Indonesische Clubgebouw Jl. Kramat Raya 106. Suatu tonggak sejarah pembentukan jati diri kebangsaan Indonesia.',
      coordinatorMessage: [
        'Arsip ini memuat naskah orisinil ejaan Van Ophuijsen, lembar notasi biola W.R. Soepratman, dan daftar delegasi pemuda Nusantara.'
      ]
    },
    scenes: [],
    evidences: [],
    validConnections: [],
    timelineCards: [],
    matchingPairs: [],
    deductionQuestion: '',
    deductionOptions: [],
    requiredEvidenceForDeduction: [],
    historicalDebrief: {
      title: 'Kongres Pemuda II & Sumpah Pemuda 1928',
      whatActuallyHappened: [],
      whyItMatters: '',
      historicalDebates: '',
      sources: []
    },
    isLocked: true
  }
];
