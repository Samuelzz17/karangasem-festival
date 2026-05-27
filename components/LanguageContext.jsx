"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export const translations = {
  id: {
    preloader: {
      welcome: "selamat datang di karangasem_festival",
      rights: "©2026 hak cipta dilindungi.",
      credits: "desain & pengembangan oleh tim kreatif karfest",
      made: "dibuat dengan cinta.",
      enter: "[klik untuk masuk]",
      tagline: "karangasem® tidak mudah, tapi harus bisa",
    },
    homepage: {
      introTitle: "karangasem_festival_2026",
      introText: "Karangasem Festival 2026 adalah perhelatan akbar tahunan yang menyatukan pameran budaya, kreativitas seni, ekonomi kreatif, dan hiburan rakyat. Mengusung tema 'Tidak Mudah, Tapi Harus Bisa', kami merayakan kebangkitan bersama dan optimisme masyarakat untuk membangun daerah menuju masa depan yang sejahtera.",
      introTextSad: "Di balik keindahan budaya yang bersinar terang, terdapat malam-malam panjang perjuangan tanpa henti. Karangasem Festival adalah tentang ketabahan, kesunyian yang megah, dan tekad baja yang menolak untuk patah di tengah badai.",
      musicalTitle: "musikal",
      psychoTitle: "psikoterapi",
      culturalTitle: "kebudayaan",
      playlistTitle: "daftar putar",
      playlistDesc: "Dengarkan musik bernuansa etnik Bali modern yang menemani malam-malam festival.",
      merchTitle: "merch festival",
      merchDesc: "Koleksi cinderamata resmi bercita rasa tinggi dengan konsep visual eksklusif Karangasem Festival.",
      quoteNormal: "tidak mudah, tapi harus bisa",
      quoteSad: "dalam sunyi, kita bertahan",
    },
    nav: {
      home: "Home",
      about: "About",
      history: "History",
      rundown: "Rundown",
      merchandise: "Merchandise",
      gallery: "Gallery",
      cart: "Cart",
      ctaFunRun: "Daftar Fun Run/Rally",
      ctaContact: "Hubungi Kami",
      ctaPesanMerch: "Pesan Merch",
    },
    countdown: {
      days: "Hari",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
      title: "Hitung Mundur Menuju Festival",
      finished: "Festival Telah Dimulai!"
    },
    hero: {
      title: "Karangasem Festival 2026",
      subtitle: "Menyambut Hari Jadi Kota Amlapura ke-386",
      tagline: '"Tidak Mudah, Tapi Harus Bisa"',
      dateTime: "19 – 22 Juni 2026 | Taman Budaya Candra Bhuana, Amlapura",
      ctaRundown: "Lihat Jadwal Rundown",
      ctaTicket: "Beli Tiket East Run",
      ctaMerch: "Pesan Merchandise"
    },
    news: {
      title: "Berita & Pengumuman Terbaru",
      item1Date: "7 Juni 2026",
      item1Text: "Pendaftaran Karangasem East Run resmi dibuka! Slot terbatas.",
      item2Date: "19 Mei 2026",
      item2Text: "Pre Order Merchandise Karangasem Festival dibuka! Navicula dan Donnie Sibarani (Ex Ada Band) dikonfirmasi siap menggetarkan panggung utama!",
      item3Date: "10 Mei 2026",
      item3Text: "Denah stan UMKM Kuliner dan Kriya resmi dirilis."
    },
    highlights: {
      title: "Sekilas Pameran Festival",
      subtitle: "Rangkaian keseruan seni, budaya, ekonomi kreatif, dan hiburan musik terbaik.",
      art: {
        title: "Seni & Budaya Bali",
        desc: "Parade budaya otentik dan pementasan wayang nusantara."
      },
      creative: {
        title: "Ekonomi Kreatif",
        desc: "Didukung oleh ratusan stan UMKM lokal, kuliner tradisional, dan pameran mode daerah."
      },
      music: {
        title: "Konser Musik & Hiburan",
        desc: "Penampilan musisi nasional, lokal Bali, serta malam pemilihan Jegeg Bagus."
      }
    },
    about: {
      eyebrow: "Tentang Festival",
      title: "Karangasem Festival 2026",
      desc: "Karangasem Festival 2026 adalah perhelatan akbar tahunan yang mengintegrasikan festival budaya, seni, ekonomi kreatif, dan panggung hiburan masyarakat. Acara ini diselenggarakan secara resmi sebagai bagian dari perayaan Hari Ulang Tahun Kota Amlapura ke-386.",
      philosophyTitle: "Filosofi Tema & Semangat",
      philosophyTheme: "Tema: \"Tidak Mudah, Tapi Harus Bisa\"",
      philosophyMeaning: "Sebuah manifestasi dari rasa optimisme, ketangguhan, dan mentalitas pantang menyerah yang dimiliki oleh segenap masyarakat Karangasem dalam menghadapi tantangan zaman demi membangun daerah menuju masa depan yang lebih baik, makmur, dan berkelanjutan.",
      goalsTitle: "Maksud & Tujuan Utama",
      goal1Title: "Pelestarian Nilai Tradisi",
      goal1Desc: "Menjaga eksistensi seni, budaya, dan kearifan lokal Bali, khususnya di Kabupaten Karangasem.",
      goal2Title: "Inkubator Ekonomi Kreatif",
      goal2Desc: "Menjadi motor penggerak bagi pelaku UMKM dan industri kreatif setempat untuk naik kelas.",
      goal3Title: "Magnet Pariwisata",
      goal3Desc: "Meningkatkan volume kunjungan wisatawan domestik maupun mancanegara.",
      goal4Title: "Pilar Kebersamaan",
      goal4Desc: "Menjadi ruang inklusif untuk mempererat persatuan dan kegotongroyongan masyarakat.",
      visualIdentityTitle: "Panduan Identitas Visual",
      visualIdentityDesc: "Panduan elemen visual dan palet warna yang menjadi landasan artistik Karangasem Festival 2026.",
      cardDarkBlueTitle: "Latar Biru Gelap",
      cardDarkBlueDesc: "Biru gelap yang dipadukan dengan tekstur noise berwarna lebih cerah/gelap atau warna lain dalam palet warna yang sudah ditentukan.",
      cardGoldTitle: "Aksen Gold",
      cardGoldDesc: "Selalu masukkan elemen berwarna gradasi emas supaya tetap koheren dengan visual key.",
      cardAltBgTitle: "Latar Warna Lain",
      cardAltBgDesc: "Warna lain masih bisa jadi latar utama selama masih menggunakan elemen visual yang sudah ditentukan.",
      sampleTextLabel: "Contoh Teks / Sample Text",
      sampleText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nulla ipsum, placerat sed cursus quis, sodales sit amet lacus."
    },
    history: {
      eyebrow: "Sejarah",
      title: "Catatan Singkat Kota Amlapura",
      desc: "Kota Amlapura berdiri kokoh di atas fondasi sejarah yang panjang, kaya, dan sarat akan nilai budaya adiluhung. Peringatan hari ulang tahun yang jatuh setiap tanggal 22 Juni menjadi momentum krusial bagi daerah untuk merefleksikan perjalanan pembangunan, mengenang warisan leluhur, serta menegaskan identitas daerah di mata dunia.",
      sub1Title: "Dari Kuta Negara Menuju Amlapura",
      sub1Desc: "Pada mulanya, pusat pemerintahan Kabupaten Karangasem ini dikenal dengan nama Kuta Negara. Namun, sebuah babak baru sejarah ditulis pasca-peristiwa erupsi agung Gunung Agung pada tahun 1963. Sebagai simbol pemulihan, ketangguhan, dan harapan baru untuk bangkit kembali dari masa-masa sulit, nama ibu kota ini secara resmi diubah menjadi Amlapura.",
      sub2Title: "Identitas Kota Pusaka",
      sub2Desc: "Hingga saat ini, Amlapura terus merawat identitasnya sebagai kawasan pusaka (heritage). Berbagai peninggalan megah—mulai dari arsitektur puri, taman air bersejarah, hingga desa adat purba—menjadi saksi bisu kejayaan masa lalu yang kini bersinergi dengan modernisasi secara harmonis."
    },
    rundown: {
      eyebrow: "Rangkaian Kegiatan",
      title: "Jadwal Resmi Karangasem Festival 2026",
      subtitle: "Pastikan Anda tidak melewatkan momen keseruan budaya, hiburan, dan olahraga. Gunakan pengingat Google Calendar di setiap jadwal.",
      downloadCta: "Unduh Rundown PDF",
      calendarCta: "Ingatkan via Google Calendar",
      notifySuccess: "Telah diset pengingat untuk: ",
      groups: {
        pre: "PRA-ACARA (PRE-EVENT)",
        main: "ACARA UTAMA (MAIN EVENT)"
      },
      days: {
        sun7: "Minggu, 7 Juni 2026",
        fri19: "Jumat, 19 Juni 2026 (Hari ke-1: Pembukaan)",
        sat20: "Sabtu, 20 Juni 2026 (Hari ke-2: Malam Penobatan)",
        sun21: "Minggu, 21 Juni 2026 (Hari ke-3: Olahraga & Ragam Pesona)",
        mon22: "Senin, 22 Juni 2026 (Hari ke-4: Puncak Hari Jadi)"
      },
      events: {
        funRally: {
          title: "Karangasem Fun Rally 2026",
          desc: "Diselenggarakan oleh IMI Karangasem. Rute menantang menyusuri keindahan panorama Karangasem."
        },
        parade: {
          title: "Parade Budaya Nusantara",
          desc: "Parade budaya kolosal yang menampilkan adat, musik tradisional, dan busana otentik nusantara."
        },
        theatrical: {
          title: "Kolaborasi Seni Teatrikal: Oblivious Oath & Sandikala",
          desc: "Pertunjukan teater megah yang menggabungkan legenda lokal dengan visual modern."
        },
        concert1: {
          title: "Live Concert: Super Beatz & Navicula",
          desc: "Navicula siap menggetarkan panggung utama dengan rock ekologis bersanding dengan DJ lokal terbaik."
        },
        jegegBagus: {
          title: "Grand Final Jegeg Bagus Karangasem 2026",
          desc: "Malam penobatan duta pariwisata dan budaya terbaik Kabupaten Karangasem."
        },
        dangdut: {
          title: "Panggung Dangdut/Koplo: Semaya Koplo",
          desc: "Malam pesta rakyat berjoget bersama irama koplo modern yang asyik."
        },
        funRun: {
          title: "East Bali Fun Run 2026",
          desc: "Diselenggarakan oleh Amlapura Running Club. Lari pagi menyusuri sawah dan pantai Karangasem."
        },
        fashion: {
          title: "Dekranasda Fashion Show (Peragaan Kain Tenun Khas Karangasem)",
          desc: "Peragaan busana modifikasi yang mengangkat keindahan kain Tenun Ikat tradisional Karangasem."
        },
        popBali: {
          title: "Panggung Pop Bali: Ary Kencana & Tika Pagraky",
          desc: "Harmoni lagu pop romantis Bali yang sangat populer menghibur sore Anda."
        },
        sacred: {
          title: "Pertunjukan Sakral: Tari Puspa Hredaya & Wayang Sunar",
          desc: "Tarian penyambutan suci dan pertunjukan bayang wayang kulit nusantara yang magis."
        },
        peakDay: {
          title: "Malam Puncak Perayaan Hari Jadi Kota Amlapura ke-386",
          desc: "Seremoni kenegaraan resmi, pesta kembang api, dan pidato kehormatan hari jadi."
        },
        specialDonnie: {
          title: "Special Performance: Donnie Sibarani (Ex. Ada Band)",
          desc: "Penampilan panggung penuh nostalgia menyanyikan lagu-lagu hits romantis terbaik tanah air."
        }
      }
    },
    merchandise: {
      eyebrow: "Suvenir Resmi",
      title: "Koleksi Eksklusif Karangasem Festival 2026",
      desc: "Tunjukkan kontribusi nyata Anda dalam mendukung kebangkitan ekonomi kreatif lokal! Seluruh keuntungan dari penjualan cinderamata resmi ini akan dialokasikan kembali untuk pemberdayaan pelaku UMKM dan komunitas seniman di Karangasem.",
      flowTitle: "Alur Pembelian & Pemesanan",
      offlineTitle: "Pembelian Offline (Di Tempat)",
      offlineDesc: "Kunjungi Booth Official Merchandise di Jalur 11 Setiap sabtu dan minggu serta area Taman Budaya Candra Bhuana selama acara berlangsung (19–22 Juni 2026).",
      onlineTitle: "Pembelian Online (Pre-Order)",
      onlineDesc: "Tekan tombol di bawah ini untuk memesan merchandise pilihan Anda secara langsung melalui layanan WhatsApp admin resmi kami.",
      ctaWa: "Pesan via WhatsApp Sekarang",
      catalogTitle: "Katalog Toko Online",
      catalogDesc: "Atau pesan secara interaktif di bawah ini dan checkout melalui web kami.",
    },
    gallery: {
      eyebrow: "Galeri",
      title: "Dokumentasi & Kilas Balik Festival",
      desc: "Saksikan rangkuman visual kebersamaan, tradisi, dan kemeriahan perayaan yang terekam dalam lensa kamera. Galeri ini akan diperbarui secara real-time oleh tim dokumentasi panitia sepanjang jalannya acara.",
      albums: {
        culture: "Album Acara Budaya",
        cultureDesc: "Foto-foto prosesi Parade Budaya, Kostum Adat, dan pementasan seni tradisi.",
        sports: "Album Olahraga & Komunitas",
        sportsDesc: "Dokumentasi keseruan para peserta Fun Rally dan pelari East Bali Fun Run.",
        stage: "Album Panggung Hiburan",
        stageDesc: "Aksi panggung memukau para musisi mulai dari Navicula, Semaya Koplo, hingga Donnie Sibarani.",
        multimedia: "Ruang Multimedia (Video)",
        multimediaDesc: "Video Teaser, liputan harian (daily highlights), dan video Aftermovie resmi Karangasem Festival 2026."
      }
    },
    footer: {
      mapsTitle: "Peta Lokasi Interaktif",
      address: "Taman Budaya Candra Bhuana\nJalan Sultan Agung, Amlapura, Kabupaten Karangasem, Bali, Indonesia",
      contactTitle: "Sekretariat & Hubungi Kami",
      contactDesc: "Jika Anda memiliki pertanyaan seputar stan UMKM, pendaftaran kompetisi, sponsorship, atau kemitraan media, silakan hubungi saluran berikut:",
      office: "Kantor Penyelenggara: Dinas Kebudayaan dan Pariwisata Kabupaten Karangasem.",
      followUs: "Ikuti info terkini secara instan via akun media sosial resmi kami:",
      rights: "Hak Cipta Dilindungi Undang-Undang. Perayaan Resmi Hari Jadi Kota Amlapura ke-386."
    },
    cart: {
      title: "Keranjang Belanja",
      subtitle: "Selesaikan transaksi Anda untuk memesan merchandise resmi Karangasem Festival.",
      listTitle: "Daftar Belanja",
      empty: "Keranjang belanja Anda masih kosong.",
      backBtn: "Kembali ke Toko Merch",
      successMsg: "Transaksi selesai. Silakan cek detail pemesanan di kolom kanan.",
      deleteBtn: "Hapus",
      subtotal: "Subtotal",
      proceedBtn: "Lanjutkan Pemesanan",
      proceedDesc: "Silakan periksa belanjaan Anda terlebih dahulu. Jika sudah sesuai, klik tombol di bawah untuk mengisi data diri pembeli.",
      formTitle: "Data Diri Pembeli",
      formCancel: "Batal",
      fieldName: "Nama pembeli",
      namePlaceholder: "Masukkan nama lengkap Anda",
      fieldWa: "WhatsApp (Nomor HP)",
      waPlaceholder: "Contoh: 08123456789",
      fieldNote: "Catatan (Opsional)",
      notePlaceholder: "Instruksi tambahan atau detail lainnya...",
      payBtn: "Bayar dengan QRIS",
      successTitle: "Pemesanan Berhasil!",
      txId: "ID Transaksi Anda:",
      successDesc: "Bukti pembayaran telah kami terima dan sedang diverifikasi oleh admin. Terima kasih!",
      backStore: "Kembali ke Toko",
      scanQris: "Scan QRIS Pembayaran",
      billTotal: "Total tagihan Anda",
      uploadProof: "Upload Bukti Transfer",
      confirmPay: "Konfirmasi Pembayaran",
      loadingPay: "Memproses..."
    }
  },
  en: {
    preloader: {
      welcome: "welcome to karangasem_festival",
      rights: "©2026 all rights reserved.",
      credits: "design & development by ava digital",
      made: "made with love.",
      enter: "[click to enter]",
      tagline: "karangasem® not easy, but we can do it",
    },
    homepage: {
      introTitle: "karangasem_festival_2026",
      introText: "Karangasem Festival 2026 is a grand annual event uniting cultural showcases, artistic creativity, creative economy, and community entertainment. Embodying the theme 'Not Easy, But We Can Do It', we celebrate resilience and community optimism to build a prosperous future.",
      introTextSad: "Behind the bright glowing culture, lie the long nights of relentless struggle. Karangasem Festival is about fortitude, majestic silence, and the iron will that refuses to break amidst the storms.",
      musicalTitle: "musical",
      psychoTitle: "psychotherapy",
      culturalTitle: "cultural",
      playlistTitle: "playlist",
      playlistDesc: "Listen to modern Balinese ethnic tunes that accompany the festival nights.",
      merchTitle: "festival merch",
      merchDesc: "A high-taste collection of official souvenirs with the exclusive visual concepts of Karangasem Festival.",
      quoteNormal: "not easy, but we can do it",
      quoteSad: "in silence, we stand",
    },
    nav: {
      home: "Home",
      about: "About",
      history: "History",
      rundown: "Rundown",
      merchandise: "Merchandise",
      gallery: "Gallery",
      cart: "Cart",
      ctaFunRun: "Register Fun Run/Rally",
      ctaContact: "Contact Us",
      ctaPesanMerch: "Order Merch",
    },
    countdown: {
      days: "Days",
      hours: "Hours",
      minutes: "Mins",
      seconds: "Secs",
      title: "Countdown to Festival",
      finished: "The Festival Has Begun!"
    },
    hero: {
      title: "Karangasem Festival 2026",
      subtitle: "Welcoming the 386th Anniversary of Amlapura City",
      tagline: '"Not Easy, But We Can Do It."',
      dateTime: "June 19 – 22, 2026 | Candra Bhuana Cultural Park, Amlapura",
      ctaRundown: "View Rundown Schedule",
      ctaTicket: "Buy East Run Tickets",
      ctaMerch: "Order Merchandise"
    },
    news: {
      title: "Latest News & Announcements",
      item1Date: "June 7, 2026",
      item1Text: "Registration for Karangasem East Run is officially open! Limited slots available.",
      item2Date: "May 19, 2026",
      item2Text: "Pre-Order for Karangasem Festival Merchandise is open! Navicula and Donnie Sibarani (Ex Ada Band) are confirmed ready to rock the main stage!",
      item3Date: "May 10, 2026",
      item3Text: "Culinary and Crafts MSME booth maps have been officially released."
    },
    highlights: {
      title: "Festival Highlights Showcase",
      subtitle: "A series of excitement in arts, culture, creative economy, and the best music entertainment.",
      art: {
        title: "Balinese Arts & Culture",
        desc: "Authentic cultural parades and national Wayang shadow puppet performances."
      },
      creative: {
        title: "Creative Economy",
        desc: "Supported by hundreds of local MSME stalls, traditional culinary, and regional fashion showcases."
      },
      music: {
        title: "Concerts & Entertainment",
        desc: "Performances by national & local Balinese musicians, as well as the Jegeg Bagus pageant final night."
      }
    },
    about: {
      eyebrow: "About the Festival",
      title: "Karangasem Festival 2026",
      desc: "Karangasem Festival 2026 is a major annual celebration integrating cultural festivals, art, creative economy, and community entertainment. This event is officially organized as part of the 386th Anniversary celebration of Amlapura City.",
      philosophyTitle: "Theme Philosophy & Spirit",
      philosophyTheme: "Theme: \"Not Easy, But We Can Do It.\"",
      philosophyMeaning: "A manifestation of optimism, resilience, and an indomitable spirit of the Karangasem people in facing modern challenges to build a better, prosperous, and sustainable region.",
      goalsTitle: "Main Purposes & Goals",
      goal1Title: "Preservation of Traditional Values",
      goal1Desc: "Maintaining the existence of Balinese arts, culture, and local wisdom, especially in Karangasem Regency.",
      goal2Title: "Creative Economy Incubator",
      goal2Desc: "Acting as a driving force for local MSMEs and creative industries to upscale and grow.",
      goal3Title: "Tourism Magnet",
      goal3Desc: "Increasing the volume of visits by domestic and international tourists.",
      goal4Title: "Pillar of Togetherness",
      goal4Desc: "Providing an inclusive space to strengthen unity and mutual cooperation among communities.",
      visualIdentityTitle: "Visual Identity Guidelines",
      visualIdentityDesc: "Guidelines for visual elements and the color palette that form the artistic foundation of Karangasem Festival 2026.",
      cardDarkBlueTitle: "Dark Blue Background",
      cardDarkBlueDesc: "Dark blue combined with a noise texture, in brighter/darker shades or other colors within the specified color palette.",
      cardGoldTitle: "Gold Accent",
      cardGoldDesc: "Always include golden gradient elements to remain coherent with the visual key.",
      cardAltBgTitle: "Other Background Color",
      cardAltBgDesc: "Other colors can still serve as the main background as long as they use the designated visual elements.",
      sampleTextLabel: "Sample Text",
      sampleText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nulla ipsum, placerat sed cursus quis, sodales sit amet lacus."
    },
    history: {
      eyebrow: "History",
      title: "A Brief Narrative of Amlapura City",
      desc: "Amlapura City stands solid upon a long, rich, and highly cultured historical foundation. The anniversary celebration held every June 22 is a crucial momentum for the region to reflect on the development journey, commemorate ancestral heritage, and assert regional identity in the global eyes.",
      sub1Title: "From Kuta Negara to Amlapura",
      sub1Desc: "Originally, this capital of Karangasem Regency was known as Kuta Negara. However, a new chapter of history was written after the monumental eruption of Mount Agung in 1963. As a symbol of recovery, resilience, and a new hope to rise from difficult times, the capital was officially renamed to Amlapura.",
      sub2Title: "Heritage City Identity",
      sub2Desc: "To this day, Amlapura continues to cherish its heritage identity. Grand relics—from royal puri architecture, historic water parks, to ancient traditional villages—stand as silent witnesses of past glory, harmoniously synergizing with modern progress."
    },
    rundown: {
      eyebrow: "Schedule of Events",
      title: "Official Schedule - Karangasem Festival 2026",
      subtitle: "Ensure you don't miss out on cultural, entertainment, and sports activities. Use Google Calendar reminders for each schedule slot.",
      downloadCta: "Download Rundown PDF",
      calendarCta: "Remind me via Google Calendar",
      notifySuccess: "Reminder set for: ",
      groups: {
        pre: "PRE-EVENT ACTIVITIES",
        main: "MAIN EVENT ACTIVITIES"
      },
      days: {
        sun7: "Sunday, June 7, 2026",
        fri19: "Friday, June 19, 2026 (Day 1: Opening)",
        sat20: "Saturday, June 20, 2026 (Day 2: Pageant Coronation Night)",
        sun21: "Sunday, June 21, 2026 (Day 3: Sports & Variety Pageant)",
        mon22: "Monday, June 22, 2026 (Day 4: Peak Anniversary)"
      },
      events: {
        funRally: {
          title: "Karangasem Fun Rally 2026",
          desc: "Organized by IMI Karangasem. A challenging route exploring the scenic beauty of Karangasem."
        },
        parade: {
          title: "Nusantara Cultural Parade",
          desc: "A colossal cultural parade showcasing customs, traditional music, and authentic clothing from across the nation."
        },
        theatrical: {
          title: "Theatrical Art Collaboration: Oblivious Oath & Sandikala",
          desc: "A grand theatrical performance combining local folklore with modern visual production."
        },
        concert1: {
          title: "Live Concert: Super Beatz & Navicula",
          desc: "Navicula is ready to rock the main stage with green rock alongside outstanding local DJs."
        },
        jegegBagus: {
          title: "Grand Final Jegeg Bagus Karangasem 2026",
          desc: "The coronation night for the finest tourism and cultural ambassadors of Karangasem Regency."
        },
        dangdut: {
          title: "Dangdut/Koplo Stage: Semaya Koplo",
          desc: "A public party dancing together to the catchy beats of modern koplo music."
        },
        funRun: {
          title: "East Bali Fun Run 2026",
          desc: "Organized by Amlapura Running Club. A morning jog along the beautiful rice fields and beaches of Karangasem."
        },
        fashion: {
          title: "Dekranasda Fashion Show (Karangasem Traditional Weaving Pageant)",
          desc: "A fashion show highlighting the elegance and creativity of traditional Karangasem Endek weaving."
        },
        popBali: {
          title: "Balinese Pop Stage: Ary Kencana & Tika Pagraky",
          desc: "Warm and romantic Balinese pop songs to entertain your beautiful evening."
        },
        sacred: {
          title: "Sacred Performance: Puspa Hredaya Dance & Wayang Sunar",
          desc: "A sacred welcoming dance and a mystical national Wayang shadow puppet show."
        },
        peakDay: {
          title: "386th Amlapura City Anniversary Peak Celebration Night",
          desc: "Official government ceremony, spectacular fireworks display, and anniversary honorary speeches."
        },
        specialDonnie: {
          title: "Special Performance: Donnie Sibarani (Ex. Ada Band)",
          desc: "A nostalgic stage performance singing the best legendary romantic hits of the country."
        }
      }
    },
    merchandise: {
      eyebrow: "Official Merchandise",
      title: "Karangasem Festival 2026 Exclusive Collection",
      desc: "Show your real support in boosting local creative economy! All profits from these official souvenirs will be reinvested to empower MSMEs and artist communities in Karangasem.",
      flowTitle: "How to Order & Purchase",
      offlineTitle: "Offline Purchase (On-Site)",
      offlineDesc: "Visit the Official Merchandise Booth at Jalur 11 every Saturday and Sunday, or at the Candra Bhuana Cultural Park during the festival (June 19–22, 2026).",
      onlineTitle: "Online Purchase (Pre-Order)",
      onlineDesc: "Click the button below to order your merchandise directly through our official WhatsApp administration service.",
      ctaWa: "Order via WhatsApp Now",
      catalogTitle: "Online Shop Catalog",
      catalogDesc: "Or order interactively below and checkout via our website.",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Documentation & Festival Retrospective",
      desc: "Witness the visual summary of togetherness, tradition, and grand celebrations captured through the camera lens. This gallery will be updated in real-time by the documentation team.",
      albums: {
        culture: "Cultural Events Album",
        cultureDesc: "Photos of Cultural Parades, Traditional Costumes, and traditional performance arts.",
        sports: "Sports & Community Album",
        sportsDesc: "Documentation of the excitement from Fun Rally participants and East Bali Fun Run runners.",
        stage: "Entertainment Stage Album",
        stageDesc: "Stunning stage actions from musicians like Navicula, Semaya Koplo, and Donnie Sibarani.",
        multimedia: "Multimedia Room (Video)",
        multimediaDesc: "Teaser videos, daily highlight clips, and the official Karangasem Festival 2026 aftermovie."
      }
    },
    footer: {
      mapsTitle: "Interactive Location Map",
      address: "Candra Bhuana Cultural Park\nSultan Agung Street, Amlapura, Karangasem Regency, Bali, Indonesia",
      contactTitle: "Secretariat & Contact Us",
      contactDesc: "If you have any questions regarding MSME booths, competition registrations, sponsorships, or media partnerships, please reach out to us:",
      office: "Organizing Office: Tourism and Culture Office of Karangasem Regency.",
      followUs: "Follow our latest updates instantly on our official social media channels:",
      rights: "All Rights Reserved. Official Celebration of the 386th Anniversary of Amlapura City."
    },
    cart: {
      title: "Shopping Cart",
      subtitle: "Complete your transaction to order official Karangasem Festival merchandise.",
      listTitle: "Shopping List",
      empty: "Your shopping cart is empty.",
      backBtn: "Back to Merch Store",
      successMsg: "Transaction completed. Please check your order details in the right column.",
      deleteBtn: "Delete",
      subtotal: "Subtotal",
      proceedBtn: "Proceed to Checkout",
      proceedDesc: "Please double check your items. If they are correct, click the button below to fill in your personal details.",
      formTitle: "Buyer Information",
      formCancel: "Cancel",
      fieldName: "Buyer name",
      namePlaceholder: "Enter your full name",
      fieldWa: "WhatsApp (Phone Number)",
      waPlaceholder: "Example: 08123456789",
      fieldNote: "Note (Optional)",
      notePlaceholder: "Additional instructions or details...",
      payBtn: "Pay with QRIS",
      successTitle: "Order Successful!",
      txId: "Your Transaction ID:",
      successDesc: "Your proof of payment has been received and is being verified by our admin. Thank you!",
      backStore: "Back to Shop",
      scanQris: "Scan QRIS for Payment",
      billTotal: "Your total bill",
      uploadProof: "Upload Payment Proof",
      confirmPay: "Confirm Payment",
      loadingPay: "Processing..."
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");
  const [isFestivalMode, setIsFestivalMode] = useState(false);

  // Load language from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kf-lang");
      if (stored && (stored === "id" || stored === "en")) {
        setLang(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Load Festival Mode from localStorage if available
  useEffect(() => {
    try {
      const storedFestival = localStorage.getItem("kf-festivalmode");
      if (storedFestival === "true") {
        setIsFestivalMode(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Apply .festival-mode class to body
  useEffect(() => {
    if (isFestivalMode) {
      document.body.classList.add("festival-mode");
    } else {
      document.body.classList.remove("festival-mode");
    }
  }, [isFestivalMode]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const changeLang = (newLang) => {
    if (newLang === "id" || newLang === "en") {
      setLang(newLang);
      try {
        localStorage.setItem("kf-lang", newLang);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleFestivalMode = () => {
    setIsFestivalMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kf-festivalmode", next ? "true" : "false");
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, isFestivalMode, toggleFestivalMode, isAudioPlaying, setIsAudioPlaying }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
