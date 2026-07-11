// lib/data.ts — Static dummy data for Lentera Cinema
// All dummy data is statically defined here for easy reference and testing.

export interface Service {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
}

export interface Package {
  id: string;
  service_id: string;
  name: string;
  price: number; // 0 = custom / hubungi kami
  per_unit?: string; // e.g. "/ siswa", "/ paket"
  description: string;
  features: string[];
  is_popular?: boolean;
  is_active: boolean;
  order: number;
}

export interface PortfolioItem {
  id: string;
  service_id: string;
  title: string;
  subtitle: string;
  media_url: string;
  thumb_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  photo_url: string;
  content: string;
  rating: number;
  service_id: string;
  is_featured: boolean;
}

export interface Booking {
  id: string;
  booking_code: string;
  client_name: string;
  phone: string;
  email?: string;
  service_id: string;
  package_id: string;
  event_date: string;
  location: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  assigned_team: string[];
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    id: 'srv-yb',
    name: 'Yearbook',
    slug: 'yearbook',
    tagline: 'Buku Kenangan Sekolah',
    description: 'Dokumentasi masa sekolah paling berkesan. Desain konsep kreatif dari retro 90s hingga Korean minimalist, cetak hardcover premium.',
    icon: '📚',
    color: '#E8B84B',
    is_active: true,
  },
  {
    id: 'srv-wo',
    name: 'Wedding Organizer',
    slug: 'wedding',
    tagline: 'Dokumentasi Pernikahan',
    description: 'Abadikan hari paling sakral seumur hidup dengan liputan video cinematic multi-kamera dan foto bergaya film bioskop.',
    icon: '💍',
    color: '#7C5CFF',
    is_active: true,
  },
  {
    id: 'srv-fg',
    name: 'Foto Graduation',
    slug: 'foto-graduation',
    tagline: 'Foto Wisuda Studio',
    description: 'Sesi foto wisuda individu, kelompok, atau angkatan dengan setup studio profesional, backdrop premium, dan pengarah gaya.',
    icon: '🎓',
    color: '#3ECF8E',
    is_active: true,
  },
  {
    id: 'srv-vg',
    name: 'Video Graduation',
    slug: 'video-graduation',
    tagline: 'Dokumentasi Acara Wisuda',
    description: 'Liputan lengkap acara wisuda sekolah atau universitas dengan multi-camera setup, direct audio recording, dan highlight sinematik.',
    icon: '🎬',
    color: '#F5A623',
    is_active: true,
  },
];

// ─────────────────────────────────────────────────────────────
// PACKAGES
// ─────────────────────────────────────────────────────────────
export const PACKAGES: Package[] = [
  // Yearbook
  {
    id: 'pkg-yb-01',
    service_id: 'srv-yb',
    name: 'Classic Memory',
    price: 185000,
    per_unit: '/ siswa',
    description: 'Paket esensial untuk buku kenangan kelas dengan finishing rapi dan berkelas.',
    features: [
      '1 Hari Sesi Foto (Outdoor & Indoor)',
      'Cetak Buku Kenangan Softcover per Siswa',
      'File Foto Edit (Google Drive)',
      'Fotografer & Pengarah Gaya Profesional',
      'Min. 30 siswa',
    ],
    is_active: true,
    order: 1,
  },
  {
    id: 'pkg-yb-02',
    service_id: 'srv-yb',
    name: 'Cinematic Premium',
    price: 295000,
    per_unit: '/ siswa',
    description: 'Paket paling populer. Lengkap dengan hardcover dan video cinematic b-roll angkatan.',
    features: [
      '2 Hari Sesi Foto & Video',
      'Cetak Buku Kenangan Premium Hardcover',
      'Cinematic Drone Footage Angkatan',
      'Video B-Roll Kelas (3 Menit)',
      'Gift box eksklusif wali kelas',
      'Min. 30 siswa',
    ],
    is_popular: true,
    is_active: true,
    order: 2,
  },
  {
    id: 'pkg-yb-03',
    service_id: 'srv-yb',
    name: 'Pro-Studio Custom',
    price: 0,
    per_unit: '/ angkatan',
    description: 'Konsep full-custom angkatan dengan tema bebas dan cetak eksklusif.',
    features: [
      'Konsep Custom (Lokasi Bebas)',
      'Cetak Buku Box Set & Merchandise',
      'Cinematic Trailer Angkatan (5-10 Menit)',
      '3 Hari Dokumentasi Foto & Video',
      'Akses Studio Lentera Cinema Unlimited',
    ],
    is_active: true,
    order: 3,
  },
  // Wedding
  {
    id: 'pkg-wo-01',
    service_id: 'srv-wo',
    name: 'Eternal Love',
    price: 4500000,
    per_unit: '/ paket',
    description: 'Dokumentasi akad nikah atau pemberkatan esensial yang elegan.',
    features: [
      '1 Fotografer + 1 Videografer',
      'Liputan Akad & Resepsi (Max 6 Jam)',
      '1 Menit Cinematic Teaser Instagram',
      '150 Edited Photos via Google Drive',
      'Semua Raw Files diserahkan',
    ],
    is_active: true,
    order: 1,
  },
  {
    id: 'pkg-wo-02',
    service_id: 'srv-wo',
    name: 'Royal Cinematic',
    price: 8500000,
    per_unit: '/ paket',
    description: 'Liputan lengkap akad dan resepsi dengan highlight film sinematik kelas atas.',
    features: [
      '2 Fotografer + 2 Videografer',
      'Sesi Pre-wedding Foto & Video Singkat',
      '3-5 Menit Cinematic Wedding Film',
      'Cetak Album Kolase 20 Halaman',
      'Drone Aerial Video Shoot',
      'Penyerahan file via custom flashdisk eksklusif',
    ],
    is_popular: true,
    is_active: true,
    order: 2,
  },
  // Foto Graduation
  {
    id: 'pkg-fg-01',
    service_id: 'srv-fg',
    name: 'Solo & Family',
    price: 350000,
    per_unit: '/ sesi',
    description: 'Sesi foto wisuda personal di studio kami bersama keluarga tercinta.',
    features: [
      'Sesi Foto Studio 45 Menit',
      'Maksimal 6 Anggota Keluarga',
      '10 File Foto Retouched',
      'Cetak Frame Minimalis 12R',
      'Pilihan 3 Backdrop Premium',
    ],
    is_active: true,
    order: 1,
  },
  {
    id: 'pkg-fg-02',
    service_id: 'srv-fg',
    name: 'Graduation Squad',
    price: 950000,
    per_unit: '/ sesi',
    description: 'Sesi foto wisuda bareng sahabat-sahabat terbaik.',
    features: [
      'Sesi Foto Studio 90 Menit',
      'Hingga 10 Orang',
      '25 File Foto Retouched',
      'Cetak Foto Grup 12R (2 Pcs)',
      'Semua file unedited via Link',
    ],
    is_popular: true,
    is_active: true,
    order: 2,
  },
  // Video Graduation
  {
    id: 'pkg-vg-01',
    service_id: 'srv-vg',
    name: 'Full Event Documentation',
    price: 6000000,
    per_unit: '/ acara',
    description: 'Liputan lengkap acara wisuda dari awal hingga selesai.',
    features: [
      '3 Kamera Setup (FHD)',
      'Liputan Sambutan & Prosesi Wisuda',
      'Video Highlight Acara 5 Menit',
      'Pemberian Harddisk berisi Full Video',
      'Audio Direct Recording dari Sound System',
    ],
    is_active: true,
    order: 1,
  },
];

// ─────────────────────────────────────────────────────────────
// PORTFOLIO ITEMS
// ─────────────────────────────────────────────────────────────
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // 1. Yearbook (exp-yb) - Foto & Video
  {
    id: 'port-yb-1', service_id: 'exp-yb',
    title: 'SMA Cendrawasih — Retro 90s', subtitle: 'Buku Tahunan • 2024',
    media_url: '/images/yearbook.png', thumb_url: '/images/yearbook.png',
    media_type: 'image', is_featured: true, order: 1,
  },
  {
    id: 'port-yb-2', service_id: 'exp-yb',
    title: 'Behind The Scenes — SMA Labschool', subtitle: 'BTS Video • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4', thumb_url: '/images/yearbook.png',
    media_type: 'video', is_featured: true, order: 2,
  },

  // 2. Video Angkatan (exp-va) - HANYA VIDEO
  {
    id: 'port-va-1', service_id: 'exp-va',
    title: 'Angkatan 2024 Cinematic Trailer', subtitle: 'Trailer Film • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4', thumb_url: '/images/video_wisuda.png',
    media_type: 'video', is_featured: true, order: 1,
  },
  {
    id: 'port-va-2', service_id: 'exp-va',
    title: 'Drone Footage & Flashmob', subtitle: 'Highlight Video • 2023',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', thumb_url: '/images/video_wisuda.png',
    media_type: 'video', is_featured: false, order: 2,
  },

  // 3. Wisuda (exp-wisuda) - Foto & Video
  {
    id: 'port-wis-1', service_id: 'exp-wisuda',
    title: 'Wisuda Universitas Indonesia', subtitle: 'Foto Studio • 2024',
    media_url: '/images/graduation.png', thumb_url: '/images/graduation.png',
    media_type: 'image', is_featured: true, order: 1,
  },
  {
    id: 'port-wis-2', service_id: 'exp-wisuda',
    title: 'Highlight Wisuda ITB', subtitle: 'Multi-cam Video • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', thumb_url: '/images/graduation.png',
    media_type: 'video', is_featured: true, order: 2,
  },

  // 4. Wedding Organizer (exp-wo) - Foto & Video
  {
    id: 'port-wo-1', service_id: 'exp-wo',
    title: 'Pernikahan Dian & Rian — Glasshouse', subtitle: 'Foto Eksklusif • 2024',
    media_url: '/images/wedding.png', thumb_url: '/images/wedding.png',
    media_type: 'image', is_featured: true, order: 1,
  },
  {
    id: 'port-wo-2', service_id: 'exp-wo',
    title: 'The Royal Wedding Cinematic', subtitle: 'Short Film • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4', thumb_url: '/images/wedding.png',
    media_type: 'video', is_featured: true, order: 2,
  },

  // 5. Fotografer Event (exp-foto-event) - HANYA FOTO
  {
    id: 'port-fe-1', service_id: 'exp-foto-event',
    title: 'Konser Musik Jakarta Fest', subtitle: 'Live Photography • 2024',
    media_url: '/images/yearbook.png', thumb_url: '/images/yearbook.png',
    media_type: 'image', is_featured: true, order: 1,
  },
  {
    id: 'port-fe-2', service_id: 'exp-foto-event',
    title: 'Tech Startup Seminar', subtitle: 'Corporate Photo • 2024',
    media_url: '/images/wedding.png', thumb_url: '/images/wedding.png',
    media_type: 'image', is_featured: false, order: 2,
  },

  // 6. Videografer Event (exp-video-event) - HANYA VIDEO
  {
    id: 'port-ve-1', service_id: 'exp-video-event',
    title: 'Aftermovie Konser Musik Raya', subtitle: 'Event Highlight • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-dj-mixing-music-in-a-club-party-1049-large.mp4', thumb_url: '/images/video_wisuda.png',
    media_type: 'video', is_featured: true, order: 1,
  },
  {
    id: 'port-ve-2', service_id: 'exp-video-event',
    title: 'Corporate Gathering 2024', subtitle: 'Documentation • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-in-a-modern-office-room-41901-large.mp4', thumb_url: '/images/video_wisuda.png',
    media_type: 'video', is_featured: false, order: 2,
  },

  // 7. Dokumentasi Product (exp-product) - Foto & Video
  {
    id: 'port-prod-1', service_id: 'exp-product',
    title: 'Fashion Brand — Summer Collection', subtitle: 'Product Photography',
    media_url: '/images/graduation.png', thumb_url: '/images/graduation.png',
    media_type: 'image', is_featured: true, order: 1,
  },
  {
    id: 'port-prod-2', service_id: 'exp-product',
    title: 'Commercial Ads — Coffee Beans', subtitle: 'Product Videography',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-person-pouring-coffee-into-a-cup-3245-large.mp4', thumb_url: '/images/graduation.png',
    media_type: 'video', is_featured: true, order: 2,
  },

  // 8. Company Profile (exp-compro) - HANYA VIDEO
  {
    id: 'port-cp-1', service_id: 'exp-compro',
    title: 'PT. Maju Bersama — Corporate Video', subtitle: 'Company Profile • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-in-a-modern-office-room-41901-large.mp4', thumb_url: '/images/wedding.png',
    media_type: 'video', is_featured: true, order: 1,
  },
  {
    id: 'port-cp-2', service_id: 'exp-compro',
    title: 'Tech Innovators — StartUp Intro', subtitle: 'Brand Story • 2023',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4', thumb_url: '/images/wedding.png',
    media_type: 'video', is_featured: false, order: 2,
  },

  // 9. Kreatif Media Sosial (exp-social) - HANYA VIDEO
  {
    id: 'port-soc-1', service_id: 'exp-social',
    title: 'TikTok Viral Campaign — Fashion', subtitle: 'Vertical Video (Reels) • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-recording-a-video-for-social-media-42416-large.mp4', thumb_url: '/images/yearbook.png',
    media_type: 'video', is_featured: true, order: 1,
  },
  {
    id: 'port-soc-2', service_id: 'exp-social',
    title: 'Instagram Challenge — Tech Brand', subtitle: 'Vertical Video (Reels) • 2024',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-person-pouring-coffee-into-a-cup-3245-large.mp4', thumb_url: '/images/yearbook.png',
    media_type: 'video', is_featured: false, order: 2,
  }
];

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Sarah Amalia',
    role: 'Ketua Panitia Yearbook, SMA Negeri 5',
    photo_url: '/testimonials/t1.jpg',
    content: 'Sangat puas dengan hasil yearbook angkatan kami! Tim Lentera sangat kreatif dan sabar menghadapi ratusan siswa. Konsep cinematic yang ditawarkan benar-benar beda dari vendor lain.',
    rating: 5,
    service_id: 'srv-yearbook',
    is_featured: true
  },
  {
    id: 't2',
    client_name: 'Rian & Dian Pratiwi',
    role: 'Wedding Client, Juli 2024',
    photo_url: '/testimonials/t2.jpg',
    content: 'Tim videografernya super sabar ngarahin gaya yang ga kaku. Film pernikahan sinematik kami bener-bener kayak film bioskop! Ga bosen di-replay terus. Sangat direkomendasikan untuk paket Royal Cinematic-nya.',
    rating: 5,
    service_id: 'srv-wo',
    is_featured: true,
  },
  {
    id: 'test-03',
    client_name: 'Budi Hartono',
    role: 'Lulusan Universitas Airlangga 2024',
    photo_url: '/testimonials/t3.jpg',
    content: 'Foto studionya cepet tapi hasilnya pro-grade banget. Editing natural ga lebay. Bingkai frame minimalis yang disertakan sekarang terpajang rapi di ruang tamu keluarga. Thank you Lentera Cinema!',
    rating: 5,
    service_id: 'srv-fg',
    is_featured: true,
  },
  {
    id: 'test-04',
    client_name: 'Dr. Andri Kusuma',
    role: 'Koordinator Wisuda, Universitas Indonesia',
    photo_url: '/testimonials/t4.jpg',
    content: 'Kami sudah 3 tahun berturut-turut mempercayakan dokumentasi wisuda fakultas ke Lentera Cinema. Profesional, tepat waktu, dan hasil videonya selalu memuaskan. Bahkan audio dari soundcard sangat jernih!',
    rating: 5,
    service_id: 'srv-vg',
    is_featured: true,
  },
];

// ─────────────────────────────────────────────────────────────
// SAMPLE BOOKINGS
// ─────────────────────────────────────────────────────────────
export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'book-01',
    booking_code: 'LC-7382',
    client_name: 'Ahmad Fauzi',
    phone: '081234567890',
    email: 'ahmad@example.com',
    service_id: 'srv-yb',
    package_id: 'pkg-yb-02',
    event_date: '2026-08-20',
    location: 'SMA Negeri 1 Jakarta, Jl. Budi Utomo No.7',
    notes: 'Pemotretan di area taman sekolah & ruang kelas utama. Harap drone disiapkan.',
    status: 'confirmed',
    assigned_team: ['Dika (Fotografer)', 'Bagas (Videografer)', 'Rafi (Drone Operator)'],
    created_at: '2026-07-05T09:30:00Z',
    updated_at: '2026-07-06T14:20:00Z',
  },
  {
    id: 'book-02',
    booking_code: 'LC-9284',
    client_name: 'Clarissa Putri',
    phone: '087799882233',
    email: 'clarissa.p@example.com',
    service_id: 'srv-wo',
    package_id: 'pkg-wo-02',
    event_date: '2026-09-15',
    location: 'Glasshouse Ritz Carlton Jakarta Selatan',
    notes: 'Akad jam 8 pagi, resepsi jam 7 malam. Butuh 2 team full liputan.',
    status: 'confirmed',
    assigned_team: ['Budi (Lead Photo)', 'Santi (2nd Photo)', 'Hendra (Lead Video)', 'Fajar (2nd Video)'],
    created_at: '2026-07-08T10:15:00Z',
    updated_at: '2026-07-08T11:00:00Z',
  },
  {
    id: 'book-03',
    booking_code: 'LC-1928',
    client_name: 'Muhammad Reynald',
    phone: '085211223344',
    email: 'rey@example.com',
    service_id: 'srv-fg',
    package_id: 'pkg-fg-01',
    event_date: '2026-08-12',
    location: 'Lentera Cinema Studio, Cilandak Jakarta Selatan',
    notes: 'Foto wisuda bersama 4 anggota keluarga. Harap siapkan backdrop warna abu-abu.',
    status: 'pending',
    assigned_team: [],
    created_at: '2026-07-10T15:40:00Z',
    updated_at: '2026-07-10T15:40:00Z',
  },
];

// ─────────────────────────────────────────────────────────────
// CLIENT LOGOS (for marquee)
// ─────────────────────────────────────────────────────────────
export const CLIENTS_BY_YEAR = [
  {
    year: '2026',
    clients: [
      'SMA NEGERI 1 JAKARTA',
      'UNIVERSITAS INDONESIA',
      'SMA LABSCHOOL JAKARTA',
      'INSTITUT TEKNOLOGI BANDUNG',
      'SMA NEGERI 8 JAKARTA',
    ]
  },
  {
    year: '2025',
    clients: [
      'UNIVERSITAS AIRLANGGA',
      'SMA CENDRAWASIH',
      'BINUS UNIVERSITY',
      'SMAN 3 BANDUNG',
      'UNPAD BANDUNG',
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// EXPLORE SERVICES (for homepage Section 2)
// ─────────────────────────────────────────────────────────────
export const EXPLORE_SERVICES = [
  {
    id: 'exp-yb',
    title: 'Yearbook',
    subtitle: 'Buku Tahunan Premium',
    desc: 'Buku tahunan sekolah dan kampus dengan konsep unik, desain modern, serta kualitas cetak premium.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4',
    image: '/images/yearbook.png',
    href: '/layanan/yearbook',
  },
  {
    id: 'exp-va',
    title: 'Video Angkatan',
    subtitle: 'Cinematic School B-Roll',
    desc: 'Pembuatan video cinematic untuk satu angkatan sekolah/kampus dengan hasil seperti trailer film profesional.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4',
    image: '/images/video_wisuda.png',
    href: '/layanan/video-angkatan',
  },
  {
    id: 'exp-wisuda',
    title: 'Wisuda',
    subtitle: 'Foto & Video Wisuda',
    desc: 'Layanan lengkap dokumentasi acara wisuda, meliputi foto dan video profesional baik di studio maupun outdoor.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4',
    image: '/images/graduation.png',
    href: '/layanan/wisuda',
  },
  {
    id: 'exp-wo',
    title: 'Wedding Organizer (WO)',
    subtitle: 'Foto & Video Cinematic',
    desc: 'Layanan dokumentasi pernikahan eksklusif meliputi foto dan video sinematik untuk akad hingga resepsi mewah.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4',
    image: '/images/wedding.png',
    href: '/layanan/wedding',
  },
  {
    id: 'exp-foto-event',
    title: 'Fotografer Event',
    subtitle: 'Professional Event Photography',
    desc: 'Liputan fotografer profesional untuk berbagai acara seperti seminar, konser, pameran, hingga corporate gathering.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4',
    image: '/images/yearbook.png',
    href: '/layanan/foto-event',
  },
  {
    id: 'exp-video-event',
    title: 'Videografer Event',
    subtitle: 'Event Aftermovie & Highlight',
    desc: 'Produksi video highlight atau aftermovie yang menangkap momen-momen penting dari event besar Anda.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4',
    image: '/images/video_wisuda.png',
    href: '/layanan/video-event',
  },
  {
    id: 'exp-product',
    title: 'Dokumentasi Product',
    subtitle: 'Foto & Video Komersial',
    desc: 'Layanan foto dan video produk yang sangat menarik untuk keperluan promosi, e-commerce, dan periklanan digital.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4',
    image: '/images/graduation.png',
    href: '/layanan/dokumentasi-product',
  },
  {
    id: 'exp-compro',
    title: 'Company Profile',
    subtitle: 'Corporate Branding Video',
    desc: 'Pembuatan video company profile profesional untuk meningkatkan kredibilitas dan brand image perusahaan Anda.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4',
    image: '/images/wedding.png',
    href: '/layanan/company-profile',
  },
  {
    id: 'exp-social',
    title: 'Kreatif Media Sosial',
    subtitle: 'Manajemen Konten Digital',
    desc: 'Pembuatan aset visual foto dan video vertikal (Reels/TikTok) untuk kebutuhan kampanye kreatif di media sosial.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4',
    image: '/images/video_wisuda.png',
    href: '/layanan/media-sosial',
  }
];

export const PARTNERS = [
  'PERTAMINA',
  'TRANS7',
  'KAI',
  'BANK MANDIRI',
  'TELKOMSEL',
  'BCA',
  'AQUA',
  'WIKA'
];

// ─────────────────────────────────────────────────────────────
// HERO VIDEOS (for homepage Section 1 glassy bar)
// ─────────────────────────────────────────────────────────────
export const HERO_ITEMS = [
  {
    label: 'Yearbook',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4',
  },
  {
    label: 'Wedding',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4',
  },
  {
    label: 'Foto Wisuda',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4',
  },
  {
    label: 'Video Wisuda',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4',
  },
  {
    label: 'Video Angkatan',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4',
  },
  {
    label: 'Creative Studio',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4',
  },
];

export const COMPANY_STATS = [
  { v: '200+', l: 'Proyek Selesai' },
  { v: '50+', l: 'Sekolah & Universitas' },
  { v: '98%', l: 'Klien Puas' },
  { v: '5+', l: 'Tahun Pengalaman' },
];

export const TEAM_MEMBERS = [
  { name: 'Rizal Fahmi', role: 'Creative Director', photo: '/team/team1.jpg', bio: 'Filmmaker 8 tahun di industri dokumenter & iklan.' },
  { name: 'Ayu Setiawati', role: 'Lead Photographer', photo: '/team/team2.jpg', bio: 'Spesialis foto wisuda & wedding sinematik modern.' },
  { name: 'Bagas Wicaksono', role: 'Videographer & Editor', photo: '/team/team3.jpg', bio: 'Color grading & editing, spesialis wedding film.' },
  { name: 'Sinta Dewi', role: 'Production Manager', photo: '/team/team4.jpg', bio: 'Koordinasi produksi & klien tanpa hambatan.' },
];
