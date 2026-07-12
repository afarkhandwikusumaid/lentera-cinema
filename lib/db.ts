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

export interface ServiceBenefit {
  id: string;
  service_id: string;
  name: string;
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
  benefit_id?: string;
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

export interface Project {
  id: string;
  name: string;
  client_name: string;
  qty: number;
  price: number;
  total_value: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ProjectPayment {
  id: string;
  project_id: string;
  term_name: string;
  amount: number;
  due_date: string;
  status: 'unpaid' | 'paid';
  paid_date?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  project_id: string | null;
  description: string;
  amount: number;
  expense_date: string;
  expense_type: 'project' | 'universal';
  created_at: string;
}


// Instagram parser utility
export function parseInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Match Instagram reel or post links
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

const DEFAULT_SERVICES: Service[] = [
  { id: 'srv-yb', name: 'Yearbook Premium', slug: 'yearbook', subtitle: 'Buku Tahunan Eksklusif', description: 'Dokumentasi masa sekolah paling berkesan dengan konsep kreatif, estetik, dan sinematik. Lengkap dengan material cetak eksklusif dan drone b-roll.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4', image_url: '/images/yearbook.png', is_active: true },
  { id: 'srv-ws', name: 'Dokumentasi Wisuda', slug: 'wisuda', subtitle: 'Foto & Video Wisuda', description: 'Abadikan momen kelulusan Anda dengan sesi foto studio/outdoor dan dokumentasi video sinematik beresolusi tinggi.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', image_url: '/images/graduation.png', is_active: true },
  { id: 'srv-wd', name: 'Wedding Organizer & Documentation', slug: 'wedding', subtitle: 'Liputan Pernikahan Mewah', description: 'Abadikan momen sakral sekali seumur hidup dengan liputan video bergaya film bioskop yang menangkap setiap emosi.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4', image_url: '/images/wedding.png', is_active: true },
  { id: 'srv-ev', name: 'Dokumentasi Event', slug: 'foto-event', subtitle: 'Event Coverage', description: 'Liputan dokumentasi acara formal maupun non-formal (konser, seminar, ulang tahun) dengan konsep visual estetik.', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-holding-a-sparkler-at-night-42171-large.mp4', image_url: '/images/video_wisuda.png', is_active: true },
  { id: 'srv-km', name: 'Komersil & Produk', slug: 'dokumentasi-product', subtitle: 'Commercial & Corporate', description: 'Produksi video company profile, iklan komersial, dan foto produk berkualitas tinggi untuk meningkatkan citra brand Anda.', image_url: '/images/yearbook.png', is_active: true },
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
  if (!getStorageItem('lc_service_benefits')) {
    setStorageItem('lc_service_benefits', JSON.stringify([]));
  }
  if (!getStorageItem('lc_portfolio')) {
    setStorageItem('lc_portfolio', JSON.stringify([]));
  }
  if (!getStorageItem('lc_testimonials')) {
    setStorageItem('lc_testimonials', JSON.stringify([]));
  }
  if (!getStorageItem('lc_bookings')) {
    setStorageItem('lc_bookings', JSON.stringify([]));
  }
  if (!getStorageItem('lc_settings')) {
    setStorageItem('lc_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!getStorageItem('lc_projects')) {
    setStorageItem('lc_projects', JSON.stringify([]));
  }
  if (!getStorageItem('lc_payments')) {
    setStorageItem('lc_payments', JSON.stringify([]));
  }
  if (!getStorageItem('lc_expenses')) {
    setStorageItem('lc_expenses', JSON.stringify([]));
  }
}

// ---------------------------------------------------------
// SETTINGS METHODS
// ---------------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
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
  let result: Service[] = [];
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('services').select('*');
    if (!error && data) result = data as Service[];
  }
  
  if (result.length === 0) {
    initDB();
    const data = getStorageItem('lc_services');
    result = data ? JSON.parse(data) : DEFAULT_SERVICES;
  }

  // Sort by requested order: Yearbook, Wisuda, Wedding, Event, Komersil
  const getOrderIndex = (name: string, slug: string) => {
    const str = (name + ' ' + slug).toLowerCase();
    if (str.includes('yearbook')) return 1;
    if (str.includes('wisuda') || str.includes('graduation')) return 2;
    if (str.includes('wedding')) return 3;
    if (str.includes('event')) return 4;
    if (str.includes('komersil') || str.includes('product') || str.includes('komersial')) return 5;
    return 99;
  };

  result.sort((a, b) => getOrderIndex(a.name, a.slug) - getOrderIndex(b.name, b.slug));
  return result;
}

export async function saveService(service: Service): Promise<Service[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('services').upsert(service);
    if (!error) return getServices();
  }
  const services = await getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) services[index] = service;
  else services.push(service);
  setStorageItem('lc_services', JSON.stringify(services));
  return services;
}

export async function deleteService(id: string): Promise<Service[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) return getServices();
  }
  const services = (await getServices()).filter(s => s.id !== id);
  setStorageItem('lc_services', JSON.stringify(services));
  return services;
}

// ---------------------------------------------------------
// SERVICE BENEFITS METHODS
// ---------------------------------------------------------
export async function getServiceBenefits(): Promise<ServiceBenefit[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('service_benefits').select('*').order('order', { ascending: true });
    if (!error && data) return data as ServiceBenefit[];
  }
  initDB();
  const data = getStorageItem('lc_service_benefits');
  return data ? JSON.parse(data) : [];
}

export async function saveServiceBenefit(benefit: ServiceBenefit): Promise<ServiceBenefit[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('service_benefits').upsert(benefit);
    if (!error) return getServiceBenefits();
  }
  const benefits = await getServiceBenefits();
  const index = benefits.findIndex(p => p.id === benefit.id);
  if (index >= 0) benefits[index] = benefit;
  else benefits.push(benefit);
  setStorageItem('lc_service_benefits', JSON.stringify(benefits));
  return benefits;
}

export async function deleteServiceBenefit(id: string): Promise<ServiceBenefit[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('service_benefits').delete().eq('id', id);
    if (!error) return getServiceBenefits();
  }
  const benefits = (await getServiceBenefits()).filter(p => p.id !== id);
  setStorageItem('lc_service_benefits', JSON.stringify(benefits));
  return benefits;
}

// ---------------------------------------------------------
// BOOKINGS METHODS
// ---------------------------------------------------------
export async function getBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('bookings').select('*');
    if (!error && data) return data as Booking[];
  }
  initDB();
  const data = getStorageItem('lc_bookings');
  return data ? JSON.parse(data) : [];
}

export async function saveBooking(booking: Booking): Promise<Booking[]> {
  if (isSupabaseConfigured() && supabase) {
    const dataToSave = { ...booking, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('bookings').upsert(dataToSave);
    if (!error) return getBookings();
  }
  const bookings = await getBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = { ...booking, updated_at: new Date().toISOString() };
  } else {
    bookings.push({ ...booking, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  setStorageItem('lc_bookings', JSON.stringify(bookings));
  return bookings;
}

export async function getBookingByCodeOrPhone(query: string): Promise<Booking | undefined> {
  if (isSupabaseConfigured() && supabase) {
    const cleanQuery = query.trim();
    const { data, error } = await supabase.from('bookings').select('*').or(`booking_code.eq.${cleanQuery},phone.eq.${cleanQuery}`);
    if (!error && data && data.length > 0) return data[0] as Booking;
  }
  const bookings = await getBookings();
  const cleanQuery = query.trim().toLowerCase();
  return bookings.find(b => b.booking_code.toLowerCase() === cleanQuery || b.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, ''));
}

// ---------------------------------------------------------
// PORTFOLIO METHODS
// ---------------------------------------------------------
export async function getPortfolio(): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('portfolio_items').select('*');
    if (!error && data) return data as PortfolioItem[];
  }
  initDB();
  const data = getStorageItem('lc_portfolio');
  return data ? JSON.parse(data) : [];
}

export async function savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('portfolio_items').upsert(item);
    if (!error) return getPortfolio();
  }
  const portfolio = await getPortfolio();
  const index = portfolio.findIndex(p => p.id === item.id);
  if (index >= 0) portfolio[index] = item;
  else portfolio.push(item);
  setStorageItem('lc_portfolio', JSON.stringify(portfolio));
  return portfolio;
}

export async function deletePortfolioItem(id: string): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (!error) return getPortfolio();
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
  }
  initDB();
  const data = getStorageItem('lc_testimonials');
  return data ? JSON.parse(data) : [];
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('testimonials').upsert(testimonial);
    if (!error) return getTestimonials();
  }
  const testimonials = await getTestimonials();
  const index = testimonials.findIndex(t => t.id === testimonial.id);
  if (index >= 0) testimonials[index] = testimonial;
  else testimonials.push(testimonial);
  setStorageItem('lc_testimonials', JSON.stringify(testimonials));
  return testimonials;
}

export async function deleteTestimonial(id: string): Promise<Testimonial[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) return getTestimonials();
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

// ---------------------------------------------------------
// PROJECTS METHODS
// ---------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) return data as Project[];
  }
  initDB();
  const data = getStorageItem('lc_projects');
  return data ? JSON.parse(data) : [];
}

export async function saveProject(project: Project): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('projects').upsert(project);
    if (!error) return getProjects();
  }
  const projects = await getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) projects[index] = project;
  else projects.push(project);
  setStorageItem('lc_projects', JSON.stringify(projects));
  return projects;
}

export async function deleteProject(id: string): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) return getProjects();
  }
  const projects = (await getProjects()).filter(p => p.id !== id);
  setStorageItem('lc_projects', JSON.stringify(projects));
  return projects;
}

// ---------------------------------------------------------
// PAYMENTS METHODS
// ---------------------------------------------------------
export async function getPayments(): Promise<ProjectPayment[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('project_payments').select('*').order('due_date', { ascending: true });
    if (!error && data) return data as ProjectPayment[];
  }
  initDB();
  const data = getStorageItem('lc_payments');
  return data ? JSON.parse(data) : [];
}

export async function savePayment(payment: ProjectPayment): Promise<ProjectPayment[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('project_payments').upsert(payment);
    if (!error) return getPayments();
  }
  const payments = await getPayments();
  const index = payments.findIndex(p => p.id === payment.id);
  if (index >= 0) payments[index] = payment;
  else payments.push(payment);
  setStorageItem('lc_payments', JSON.stringify(payments));
  return payments;
}

export async function deletePayment(id: string): Promise<ProjectPayment[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('project_payments').delete().eq('id', id);
    if (!error) return getPayments();
  }
  const payments = (await getPayments()).filter(p => p.id !== id);
  setStorageItem('lc_payments', JSON.stringify(payments));
  return payments;
}

// ---------------------------------------------------------
// EXPENSES METHODS
// ---------------------------------------------------------
export async function getExpenses(): Promise<Expense[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (!error && data) return data as Expense[];
  }
  initDB();
  const data = getStorageItem('lc_expenses');
  return data ? JSON.parse(data) : [];
}

export async function saveExpense(expense: Expense): Promise<Expense[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('expenses').upsert(expense);
    if (!error) return getExpenses();
  }
  const expenses = await getExpenses();
  const index = expenses.findIndex(p => p.id === expense.id);
  if (index >= 0) expenses[index] = expense;
  else expenses.push(expense);
  setStorageItem('lc_expenses', JSON.stringify(expenses));
  return expenses;
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) return getExpenses();
  }
  const expenses = (await getExpenses()).filter(p => p.id !== id);
  setStorageItem('lc_expenses', JSON.stringify(expenses));
  return expenses;
}
