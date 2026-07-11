// lib/db.ts
// Dual Engine Database: Communicates with Supabase if credentials exist, otherwise falls back to LocalStorage.
// Safe for both SSR and CSR in Next.js.

import { supabase, isSupabaseConfigured } from './supabase';

export interface Service {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  video_url?: string;
  image_url?: string;
  is_active: boolean;
}

export interface Package {
  id: string;
  service_id: string;
  name: string;
  price: number; // 0 means custom
  description: string;
  features: string[];
  is_active: boolean;
  order: number;
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

export interface PortfolioItem {
  id: string;
  service_id: string;
  title: string;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  order: number;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_video_url: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  photo_url?: string;
  content: string;
  rating: number;
  is_featured: boolean;
}

// Instagram parser utility
export function parseInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Match Instagram reel or post links
  // E.g. https://www.instagram.com/reel/C8v9z3xY/ or https://instagram.com/p/C8v9z3xY
  const match = trimmed.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// DEFAULT SEED DATA
// ─────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: 'Timeless Wedding & Cinematic Event',
  hero_subtitle: 'Merekam emosi, mengabadikan momen. Lentera Cinema adalah partner visual Anda untuk menciptakan mahakarya dari setiap detik berharga.',
  hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4'
};

// Initial Seed Data for LocalStorage fallbacks
const DEFAULT_SERVICES: Service[] = [
  { id: 'srv-yb', name: 'Yearbook (Buku Kenangan)', slug: 'yearbook', subtitle: 'Buku Tahunan Premium', description: 'Dokumentasi masa sekolah paling berkesan dengan konsep kreatif, estetik, dan sinematik.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4', image_url: '/images/yearbook.png', is_active: true },
  { id: 'srv-wo', name: 'Wedding Organizer & Documentation', slug: 'wedding', subtitle: 'Foto & Video Cinematic', description: 'Abadikan momen sakral sekali seumur hidup dengan liputan video bergaya film bioskop.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4', image_url: '/images/wedding.png', is_active: true },
  { id: 'srv-fg', name: 'Foto Graduation', slug: 'foto-graduation', subtitle: 'Foto Wisuda Studio', description: 'Foto wisuda studio-grade untuk kelulusan individu, kelompok, maupun angkatan.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', image_url: '/images/graduation.png', is_active: true },
  { id: 'srv-vg', name: 'Video Graduation', slug: 'video-graduation', subtitle: 'Cinematic Event B-Roll', description: 'Liputan dokumentasi graduation event sekolah / universitas dengan multi-camera setup.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4', image_url: '/images/video_wisuda.png', is_active: true }
];

const DEFAULT_PACKAGES: Package[] = [
  { id: 'pkg-yb-classic', service_id: 'srv-yb', name: 'Classic Memory', price: 185000, description: 'Paket dasar untuk dokumentasi kelas dengan cetak softcover.', features: ['1 Hari Sesi Foto (Outdoor/Indoor)', 'Cetak Buku Kenangan Softcover per Siswa', 'File Foto Edit (Digital Drive Access)', 'Fotografer & Pengarah Gaya Profesional'], is_active: true, order: 1 },
  { id: 'pkg-yb-cinematic', service_id: 'srv-yb', name: 'Cinematic Premium', price: 295000, description: 'Paket paling populer. Lengkap dengan cetak hardcover dan video cinematic b-roll kelas.', features: ['2 Hari Sesi Foto & Video', 'Cetak Buku Kenangan Premium Hardcover', 'Cinematic Drone Footage', 'Video Behind The Scene Kelas (3 Menit)', 'Gift box eksklusif untuk wali kelas'], is_active: true, order: 2 },
  { id: 'pkg-yb-custom', service_id: 'srv-yb', name: 'Pro-Studio Custom', price: 0, description: 'Konsep custom full angkatan dengan tema bebas dan cetak eksklusif.', features: ['Konsep Custom (Bebas Pilih Lokasi)', 'Cetakan Buku Box Set & Merchandise', 'Cinematic Trailer Angkatan (5-10 Menit)', '3 Hari Dokumentasi Foto/Video', 'Akses Studio Lentera Cinema Unlimited'], is_active: true, order: 3 },
  { id: 'pkg-wo-bronze', service_id: 'srv-wo', name: 'Eternal Love (Bronze)', price: 4500000, description: 'Dokumentasi akad nikah/pemberkatan esensial.', features: ['1 Fotografer + 1 Videografer', 'Sesi Akademi & Resepsi (Max 6 Jam)', '1 Min Cinematic Teaser (Instagram)', '150 Edited Photos on Drive', 'Semua Raw Files diserahkan'], is_active: true, order: 1 },
  { id: 'pkg-wo-gold', service_id: 'srv-wo', name: 'Royal Cinematic (Gold)', price: 8500000, description: 'Liputan lengkap akad dan resepsi dengan highlight film sinematik kelas atas.', features: ['2 Fotografer + 2 Videografer', 'Sesi Pre-wedding Foto/Video Singkat', '3-5 Menit Cinematic Wedding Film', 'Cetak Album Kolase 20 Halaman', 'Drone Aerial Video Shoot', 'Penyerahan file via custom flashdisk'], is_active: true, order: 2 },
  { id: 'pkg-fg-studio', service_id: 'srv-fg', name: 'Solo & Family Graduation', price: 350000, description: 'Sesi foto wisuda personal di studio kami bersama keluarga.', features: ['Sesi Foto Studio 45 Menit', 'Maksimal 6 Anggota Keluarga', '10 File Foto Retouched', 'Cetak Frame Minimalis 12R', 'Pilihan Backdrop Premium'], is_active: true, order: 1 },
  { id: 'pkg-fg-group', service_id: 'srv-fg', name: 'Graduation Squad Pack', price: 950000, description: 'Sesi foto wisuda rame-rame dengan sahabat terdekat.', features: ['Sesi Foto Studio 90 Menit', 'Hingga 10 Orang Teman/Sahabat', '25 File Foto Retouched', 'Cetak Foto Grup 12R (2 Pcs)', 'Semua file asli (Unedited) via Link'], is_active: true, order: 2 },
  { id: 'pkg-vg-event', service_id: 'srv-vg', name: 'Full Event Documentation', price: 6000000, description: 'Liputan lengkap acara wisuda dari awal hingga akhir.', features: ['3 Kamera Setup (FHD)', 'Liputan Sambutan & Prosesi Wisuda Lengkap', 'Video Highlight Acara 5 Menit', 'Pemberian Harddisk Eksternal berisi Full Video', 'Audio Direct Recording dari Sound System'], is_active: true, order: 1 }
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: 'port-1', service_id: 'srv-yb', title: 'SMA Cendrawasih - Retro 90s Yearbook', media_url: '/images/yearbook.png', media_type: 'image', is_featured: true, order: 1 },
  { id: 'port-2', service_id: 'srv-yb', title: 'Cinematic High School Vibe', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4', media_type: 'video', is_featured: true, order: 2 },
  { id: 'port-3', service_id: 'srv-wo', title: 'The Wedding of Dian & Rian - Glasshouse', media_url: '/images/wedding.png', media_type: 'image', is_featured: true, order: 3 },
  { id: 'port-4', service_id: 'srv-wo', title: 'Romantic Sunset Walk Wedding', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4', media_type: 'video', is_featured: true, order: 4 },
  { id: 'port-5', service_id: 'srv-fg', title: 'University Graduate Portrait', media_url: '/images/graduation.png', media_type: 'image', is_featured: false, order: 5 },
  { id: 'port-6', service_id: 'srv-vg', title: 'Graduation Ceremony Joy', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', media_type: 'video', is_featured: true, order: 6 }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', client_name: 'Sarah Amalia (Panitia SMA 5)', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', content: 'Kerja bareng Lentera Cinema seru banget! Konsep yearbook kelas kami dapet banget retro-nya. Hasil cetak hardcover-nya tebel & video cinematic BTS-nya diputer pas prom night bikin nangis seangkatan.', rating: 5, is_featured: true },
  { id: 'test-2', client_name: 'Rian & Dian (Wedding Client)', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', content: 'Videografernya super sabar ngarahin gaya yang ga kaku. Cinematic wedding film-nya bener-bener kaya film bioskop! Ga bosen di-replay terus. Sangat direkomendasikan paket Royal Gold-nya.', rating: 5, is_featured: true },
  { id: 'test-3', client_name: 'Budi Hartono (Lulusan Unair)', photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', content: 'Foto studionya cepet tapi hasilnya pro-grade banget. Editingnya natural ga lebay. Bingkai frame minimalisnya sekarang terpajang rapi di ruang tamu orang tua saya.', rating: 4, is_featured: true }
];

const DEFAULT_BOOKINGS: Booking[] = [
  { id: 'book-1', booking_code: 'LC-7382', client_name: 'Ahmad Fauzi', phone: '081234567890', email: 'ahmad@example.com', service_id: 'srv-yb', package_id: 'pkg-yb-cinematic', event_date: '2026-07-20', location: 'SMA Negeri 1 Jakarta', notes: 'Pemotretan di area taman sekolah & ruang kelas utama. Harap drone disiapkan.', status: 'confirmed', assigned_team: ['Dika (Fotografer)', 'Bagas (Videografer)', 'Rafi (Drone Operator)'], created_at: '2026-07-05T09:30:00Z', updated_at: '2026-07-06T14:20:00Z' },
  { id: 'book-2', booking_code: 'LC-9284', client_name: 'Clarissa Putri', phone: '087799882233', email: 'clarissa.p@example.com', service_id: 'srv-wo', package_id: 'pkg-wo-gold', event_date: '2026-08-15', location: 'Glasshouse Ritz Carlton Jakarta', notes: 'Akad jam 8 pagi, resepsi jam 7 malam. Butuh 2 team full liputan.', status: 'confirmed', assigned_team: ['Budi (Lead Photo)', 'Santi (Second Photo)', 'Hendra (Lead Video)', 'Fajar (Second Video)'], created_at: '2026-07-08T10:15:00Z', updated_at: '2026-07-08T11:00:00Z' },
  { id: 'book-3', booking_code: 'LC-1928', client_name: 'Muhammad Reynald', phone: '085211223344', email: 'rey@example.com', service_id: 'srv-fg', package_id: 'pkg-fg-studio', event_date: '2026-07-12', location: 'Lentera Cinema Studio Cilandak', notes: 'Foto wisuda bersama 4 anggota keluarga. Harap siapkan backdrop warna abu-abu.', status: 'pending', assigned_team: [], created_at: '2026-07-10T15:40:00Z', updated_at: '2026-07-10T15:40:00Z' }
];

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Safe DB LocalStorage seed initializer
export function initDB() {
  if (typeof window === 'undefined') return;

  if (!getStorageItem('lc_services')) {
    setStorageItem('lc_services', JSON.stringify(DEFAULT_SERVICES));
  }
  if (!getStorageItem('lc_packages')) {
    setStorageItem('lc_packages', JSON.stringify(DEFAULT_PACKAGES));
  }
  if (!getStorageItem('lc_portfolio')) {
    setStorageItem('lc_portfolio', JSON.stringify(DEFAULT_PORTFOLIO));
  }
  if (!getStorageItem('lc_testimonials')) {
    setStorageItem('lc_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!getStorageItem('lc_bookings')) {
    setStorageItem('lc_bookings', JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!getStorageItem('lc_settings')) {
    setStorageItem('lc_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
}

// ---------------------------------------------------------
// SETTINGS METHODS
// ---------------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  // In a real app, this would query a settings table in Supabase
  initDB();
  const data = getStorageItem('lc_settings');
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  setStorageItem('lc_settings', JSON.stringify(settings));
  return settings;
}

// ---------------------------------------------------------
// SERVICES METHODS
// ---------------------------------------------------------
export async function getServices(): Promise<Service[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('services').select('*');
    if (!error && data) return data as Service[];
    console.error('Supabase getServices error, falling back to storage:', error);
  }

  // Fallback
  initDB();
  const data = getStorageItem('lc_services');
  return data ? JSON.parse(data) : DEFAULT_SERVICES;
}

export async function saveService(service: Service): Promise<Service[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('services').upsert(service);
    if (!error) return getServices();
    console.error('Supabase saveService error, falling back to storage:', error);
  }

  const services = await getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  setStorageItem('lc_services', JSON.stringify(services));
  return services;
}

export async function deleteService(id: string): Promise<Service[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) return getServices();
    console.error('Supabase deleteService error, falling back to storage:', error);
  }

  const services = (await getServices()).filter(s => s.id !== id);
  setStorageItem('lc_services', JSON.stringify(services));
  return services;
}

// ---------------------------------------------------------
// PACKAGES METHODS
// ---------------------------------------------------------
export async function getPackages(): Promise<Package[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('packages').select('*');
    if (!error && data) return data as Package[];
    console.error('Supabase getPackages error, falling back to storage:', error);
  }

  initDB();
  const data = getStorageItem('lc_packages');
  return data ? JSON.parse(data) : DEFAULT_PACKAGES;
}

export async function savePackage(pkg: Package): Promise<Package[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('packages').upsert(pkg);
    if (!error) return getPackages();
    console.error('Supabase savePackage error, falling back to storage:', error);
  }

  const packages = await getPackages();
  const index = packages.findIndex(p => p.id === pkg.id);
  if (index >= 0) {
    packages[index] = pkg;
  } else {
    packages.push(pkg);
  }
  setStorageItem('lc_packages', JSON.stringify(packages));
  return packages;
}

export async function deletePackage(id: string): Promise<Package[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (!error) return getPackages();
    console.error('Supabase deletePackage error, falling back to storage:', error);
  }

  const packages = (await getPackages()).filter(p => p.id !== id);
  setStorageItem('lc_packages', JSON.stringify(packages));
  return packages;
}

// ---------------------------------------------------------
// BOOKINGS METHODS
// ---------------------------------------------------------
export async function getBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('bookings').select('*');
    if (!error && data) return data as Booking[];
    console.error('Supabase getBookings error, falling back to storage:', error);
  }

  initDB();
  const data = getStorageItem('lc_bookings');
  return data ? JSON.parse(data) : DEFAULT_BOOKINGS;
}

export async function saveBooking(booking: Booking): Promise<Booking[]> {
  if (isSupabaseConfigured() && supabase) {
    const dataToSave = {
      ...booking,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('bookings').upsert(dataToSave);
    if (!error) return getBookings();
    console.error('Supabase saveBooking error, falling back to storage:', error);
  }

  const bookings = await getBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = { ...booking, updated_at: new Date().toISOString() };
  } else {
    bookings.push({
      ...booking,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  setStorageItem('lc_bookings', JSON.stringify(bookings));
  return bookings;
}

export async function getBookingByCodeOrPhone(query: string): Promise<Booking | undefined> {
  if (isSupabaseConfigured() && supabase) {
    const cleanQuery = query.trim();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`booking_code.eq.${cleanQuery},phone.eq.${cleanQuery}`);
    if (!error && data && data.length > 0) return data[0] as Booking;
  }

  const bookings = await getBookings();
  const cleanQuery = query.trim().toLowerCase();
  return bookings.find(
    b => b.booking_code.toLowerCase() === cleanQuery || b.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
  );
}

// ---------------------------------------------------------
// PORTFOLIO METHODS
// ---------------------------------------------------------
export async function getPortfolio(): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('portfolio_items').select('*');
    if (!error && data) return data as PortfolioItem[];
    console.error('Supabase getPortfolio error, falling back to storage:', error);
  }

  initDB();
  const data = getStorageItem('lc_portfolio');
  return data ? JSON.parse(data) : DEFAULT_PORTFOLIO;
}

export async function savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('portfolio_items').upsert(item);
    if (!error) return getPortfolio();
    console.error('Supabase savePortfolioItem error, falling back to storage:', error);
  }

  const portfolio = await getPortfolio();
  const index = portfolio.findIndex(p => p.id === item.id);
  if (index >= 0) {
    portfolio[index] = item;
  } else {
    portfolio.push(item);
  }
  setStorageItem('lc_portfolio', JSON.stringify(portfolio));
  return portfolio;
}

export async function deletePortfolioItem(id: string): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (!error) return getPortfolio();
    console.error('Supabase deletePortfolioItem error, falling back to storage:', error);
  }

  const portfolio = (await getPortfolio()).filter(p => p.id !== id);
  setStorageItem('lc_portfolio', JSON.stringify(portfolio));
  return portfolio;
}

// ---------------------------------------------------------
// TESTIMONIALS METHODS
// ---------------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (!error && data) return data as Testimonial[];
    console.error('Supabase getTestimonials error, falling back to storage:', error);
  }

  initDB();
  const data = getStorageItem('lc_testimonials');
  return data ? JSON.parse(data) : DEFAULT_TESTIMONIALS;
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('testimonials').upsert(testimonial);
    if (!error) return getTestimonials();
    console.error('Supabase saveTestimonial error, falling back to storage:', error);
  }

  const testimonials = await getTestimonials();
  const index = testimonials.findIndex(t => t.id === testimonial.id);
  if (index >= 0) {
    testimonials[index] = testimonial;
  } else {
    testimonials.push(testimonial);
  }
  setStorageItem('lc_testimonials', JSON.stringify(testimonials));
  return testimonials;
}

export async function deleteTestimonial(id: string): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) return getTestimonials();
    console.error('Supabase deleteTestimonial error, falling back to storage:', error);
  }

  const testimonials = (await getTestimonials()).filter(t => t.id !== id);
  setStorageItem('lc_testimonials', JSON.stringify(testimonials));
  return testimonials;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  order: number;
}

export interface SchoolClient {
  id: string;
  name: string;
  year: string;
  order: number;
}

export async function getBrands(): Promise<Brand[]> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase!.from('brands').select('*').order('order', { ascending: true });
    return data || [];
  }
  return [];
}

export async function saveBrand(brand: Brand): Promise<Brand[]> {
  if (isSupabaseConfigured()) {
    await supabase!.from('brands').upsert(brand);
    return getBrands();
  }
  return [];
}

export async function deleteBrand(id: string): Promise<Brand[]> {
  if (isSupabaseConfigured()) {
    await supabase!.from('brands').delete().eq('id', id);
    return getBrands();
  }
  return [];
}

export async function getSchoolClients(): Promise<SchoolClient[]> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase!.from('school_clients').select('*').order('order', { ascending: true });
    return data || [];
  }
  return [];
}

export async function saveSchoolClient(client: SchoolClient): Promise<SchoolClient[]> {
  if (isSupabaseConfigured()) {
    await supabase!.from('school_clients').upsert(client);
    return getSchoolClients();
  }
  return [];
}

export async function deleteSchoolClient(id: string): Promise<SchoolClient[]> {
  if (isSupabaseConfigured()) {
    await supabase!.from('school_clients').delete().eq('id', id);
    return getSchoolClients();
  }
  return [];
}
