-- ============================================================
-- LENTERA CINEMA — Supabase Schema
-- Jalankan SQL ini di Supabase SQL Editor (supabase.com → SQL)
-- ============================================================

-- 1. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. SERVICE BENEFITS (sub-layanan / paket)
CREATE TABLE IF NOT EXISTS service_benefits (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 3. BRANDS / MITRA
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 4. SCHOOL CLIENTS (Instansi Sekolah)
CREATE TABLE IF NOT EXISTS school_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 5. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  photo_url TEXT,
  content TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  is_featured BOOLEAN NOT NULL DEFAULT false
);

-- 6. PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  media_url TEXT NOT NULL DEFAULT '',
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_code TEXT NOT NULL DEFAULT '',
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT,
  service_id TEXT NOT NULL,
  benefit_id TEXT,
  event_date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled')),
  assigned_team JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. PROJECTS (Proyek Klien)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  qty INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL DEFAULT 0,
  total_value INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. PROJECT PAYMENTS (Termin Pembayaran)
CREATE TABLE IF NOT EXISTS project_payments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  term_name TEXT NOT NULL DEFAULT '',
  amount INTEGER NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
  paid_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. EXPENSES (Pengeluaran)
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  description TEXT NOT NULL DEFAULT '',
  amount INTEGER NOT NULL DEFAULT 0,
  expense_date TEXT NOT NULL DEFAULT '',
  expense_type TEXT NOT NULL DEFAULT 'universal' CHECK (expense_type IN ('project', 'universal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- STORAGE BUCKET (untuk upload logo, thumbnail, dll)
-- ============================================================
-- Buat bucket "uploads" di Supabase Storage dashboard
-- Set policies: public read, authenticated write

-- ============================================================
-- ROW LEVEL SECURITY — Public read, anon write (untuk demo)
-- Sesuaikan dengan kebutuhan produksi Anda
-- ============================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'services', 'service_benefits', 'brands', 'school_clients',
    'testimonials', 'portfolio_items', 'bookings',
    'projects', 'project_payments', 'expenses'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow public read on %1$s" ON %1$I', tbl);
    EXECUTE format('CREATE POLICY "Allow public read on %1$s" ON %1$I FOR SELECT USING (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon insert on %1$s" ON %1$I', tbl);
    EXECUTE format('CREATE POLICY "Allow anon insert on %1$s" ON %1$I FOR INSERT WITH CHECK (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon update on %1$s" ON %1$I', tbl);
    EXECUTE format('CREATE POLICY "Allow anon update on %1$s" ON %1$I FOR UPDATE USING (true) WITH CHECK (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon delete on %1$s" ON %1$I', tbl);
    EXECUTE format('CREATE POLICY "Allow anon delete on %1$s" ON %1$I FOR DELETE USING (true)', tbl);
  END LOOP;
END $$;
