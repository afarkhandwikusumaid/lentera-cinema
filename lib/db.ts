// lib/db.ts
// Dual Engine Database: Supabase first, LocalStorage fallback.
// Safe for both SSR and CSR in Next.js.

import { supabase, isSupabaseConfigured } from './supabase';

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────

export function parseInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return null;
}

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Default settings (editable via admin)
const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: '',
  hero_subtitle: '',
  hero_video_url: ''
};

// Safe DB LocalStorage seed initializer — all data starts EMPTY
export function initDB() {
  if (typeof window === 'undefined') return;
  const keys = [
    'lc_services', 'lc_service_benefits', 'lc_portfolio',
    'lc_testimonials', 'lc_bookings', 'lc_settings',
    'lc_projects', 'lc_payments', 'lc_expenses',
    'lc_brands', 'lc_school_clients'
  ];
  for (const key of keys) {
    if (!getStorageItem(key)) {
      setStorageItem(key, JSON.stringify(key === 'lc_settings' ? DEFAULT_SETTINGS : []));
    }
  }
}

// ─────────────────────────────────────────────────────────────
// GENERIC CRUD HELPERS (Supabase-first, LocalStorage fallback)
// ─────────────────────────────────────────────────────────────

async function sbGet<T>(table: string, lsKey: string, orderCol?: string): Promise<T[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from(table).select('*');
      if (orderCol) query = query.order(orderCol, { ascending: true });
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as T[];
    } catch { /* fallback */ }
  }
  initDB();
  const raw = getStorageItem(lsKey);
  return raw ? JSON.parse(raw) : [];
}

async function sbUpsert<T extends { id: string }>(
  table: string, lsKey: string, item: T, orderCol?: string
): Promise<T[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from(table).upsert(item);
      if (!error) {
        // Re-fetch from Supabase to stay in sync
        let query = supabase.from(table).select('*');
        if (orderCol) query = query.order(orderCol, { ascending: true });
        const { data } = await query;
        if (data) return data as T[];
      }
    } catch { /* fallback */ }
  }
  // LocalStorage fallback
  initDB();
  const raw = getStorageItem(lsKey);
  const items: T[] = raw ? JSON.parse(raw) : [];
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) items[idx] = item; else items.push(item);
  setStorageItem(lsKey, JSON.stringify(items));
  return items;
}

async function sbDelete<T extends { id: string }>(
  table: string, lsKey: string, id: string, orderCol?: string
): Promise<T[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) {
        let query = supabase.from(table).select('*');
        if (orderCol) query = query.order(orderCol, { ascending: true });
        const { data } = await query;
        if (data) return data as T[];
      }
    } catch { /* fallback */ }
  }
  initDB();
  const raw = getStorageItem(lsKey);
  const items: T[] = raw ? JSON.parse(raw) : [];
  const filtered = items.filter(i => i.id !== id);
  setStorageItem(lsKey, JSON.stringify(filtered));
  return filtered;
}

// ─────────────────────────────────────────────────────────────
// SETTINGS METHODS
// ─────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) return data as SiteSettings;
    } catch { /* fallback */ }
  }
  initDB();
  const raw = getStorageItem('lc_settings');
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 'main', ...settings });
      if (!error) return settings;
    } catch { /* fallback */ }
  }
  setStorageItem('lc_settings', JSON.stringify(settings));
  return settings;
}

// ─────────────────────────────────────────────────────────────
// SERVICES METHODS
// ─────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const result = await sbGet<Service>('services', 'lc_services');
  return result.filter(s => s.is_active !== false);
}

export async function saveService(service: Service): Promise<Service[]> {
  return sbUpsert<Service>('services', 'lc_services', service);
}

export async function deleteService(id: string): Promise<Service[]> {
  return sbDelete<Service>('services', 'lc_services', id);
}

// ─────────────────────────────────────────────────────────────
// SERVICE BENEFITS METHODS
// ─────────────────────────────────────────────────────────────

export async function getServiceBenefits(): Promise<ServiceBenefit[]> {
  return sbGet<ServiceBenefit>('service_benefits', 'lc_service_benefits', 'order');
}

export async function saveServiceBenefit(benefit: ServiceBenefit): Promise<ServiceBenefit[]> {
  return sbUpsert<ServiceBenefit>('service_benefits', 'lc_service_benefits', benefit, 'order');
}

export async function deleteServiceBenefit(id: string): Promise<ServiceBenefit[]> {
  return sbDelete<ServiceBenefit>('service_benefits', 'lc_service_benefits', id, 'order');
}

// ─────────────────────────────────────────────────────────────
// BOOKINGS METHODS
// ─────────────────────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  return sbGet<Booking>('bookings', 'lc_bookings');
}

export async function saveBooking(booking: Booking): Promise<Booking[]> {
  const enriched = { ...booking, updated_at: new Date().toISOString() };
  if (!enriched.created_at) enriched.created_at = new Date().toISOString();
  return sbUpsert<Booking>('bookings', 'lc_bookings', enriched);
}

export async function getBookingByCodeOrPhone(query: string): Promise<Booking | undefined> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const clean = query.trim();
      const { data, error } = await supabase.from('bookings').select('*')
        .or(`booking_code.eq.${clean},phone.eq.${clean}`);
      if (!error && data && data.length > 0) return data[0] as Booking;
    } catch { /* fallback */ }
  }
  const bookings = await getBookings();
  const clean = query.trim().toLowerCase();
  return bookings.find(b =>
    b.booking_code.toLowerCase() === clean ||
    b.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
  );
}

// ─────────────────────────────────────────────────────────────
// PORTFOLIO METHODS
// ─────────────────────────────────────────────────────────────

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return sbGet<PortfolioItem>('portfolio_items', 'lc_portfolio', 'order');
}

export async function savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem[]> {
  return sbUpsert<PortfolioItem>('portfolio_items', 'lc_portfolio', item, 'order');
}

export async function deletePortfolioItem(id: string): Promise<PortfolioItem[]> {
  return sbDelete<PortfolioItem>('portfolio_items', 'lc_portfolio', id, 'order');
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS METHODS
// ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  return sbGet<Testimonial>('testimonials', 'lc_testimonials');
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial[]> {
  return sbUpsert<Testimonial>('testimonials', 'lc_testimonials', testimonial);
}

export async function deleteTestimonial(id: string): Promise<Testimonial[]> {
  return sbDelete<Testimonial>('testimonials', 'lc_testimonials', id);
}

// ─────────────────────────────────────────────────────────────
// BRANDS METHODS
// ─────────────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  return sbGet<Brand>('brands', 'lc_brands', 'order');
}

export async function saveBrand(brand: Brand): Promise<Brand[]> {
  return sbUpsert<Brand>('brands', 'lc_brands', brand, 'order');
}

export async function deleteBrand(id: string): Promise<Brand[]> {
  return sbDelete<Brand>('brands', 'lc_brands', id, 'order');
}

// ─────────────────────────────────────────────────────────────
// SCHOOL CLIENTS METHODS
// ─────────────────────────────────────────────────────────────

export async function getSchoolClients(): Promise<SchoolClient[]> {
  return sbGet<SchoolClient>('school_clients', 'lc_school_clients', 'order');
}

export async function saveSchoolClient(client: SchoolClient): Promise<SchoolClient[]> {
  return sbUpsert<SchoolClient>('school_clients', 'lc_school_clients', client, 'order');
}

export async function deleteSchoolClient(id: string): Promise<SchoolClient[]> {
  return sbDelete<SchoolClient>('school_clients', 'lc_school_clients', id, 'order');
}

// ─────────────────────────────────────────────────────────────
// PROJECTS METHODS
// ─────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Project[];
    } catch { /* fallback */ }
  }
  initDB();
  const raw = getStorageItem('lc_projects');
  return raw ? JSON.parse(raw) : [];
}

export async function saveProject(project: Project): Promise<Project[]> {
  return sbUpsert<Project>('projects', 'lc_projects', project);
}

export async function deleteProject(id: string): Promise<Project[]> {
  return sbDelete<Project>('projects', 'lc_projects', id);
}

// ─────────────────────────────────────────────────────────────
// PAYMENTS METHODS
// ─────────────────────────────────────────────────────────────

export async function getPayments(): Promise<ProjectPayment[]> {
  return sbGet<ProjectPayment>('project_payments', 'lc_payments', 'due_date');
}

export async function savePayment(payment: ProjectPayment): Promise<ProjectPayment[]> {
  return sbUpsert<ProjectPayment>('project_payments', 'lc_payments', payment, 'due_date');
}

export async function deletePayment(id: string): Promise<ProjectPayment[]> {
  return sbDelete<ProjectPayment>('project_payments', 'lc_payments', id, 'due_date');
}

// ─────────────────────────────────────────────────────────────
// EXPENSES METHODS
// ─────────────────────────────────────────────────────────────

export async function getExpenses(): Promise<Expense[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
      if (!error && data) return data as Expense[];
    } catch { /* fallback */ }
  }
  initDB();
  const raw = getStorageItem('lc_expenses');
  return raw ? JSON.parse(raw) : [];
}

export async function saveExpense(expense: Expense): Promise<Expense[]> {
  return sbUpsert<Expense>('expenses', 'lc_expenses', expense);
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  return sbDelete<Expense>('expenses', 'lc_expenses', id);
}
