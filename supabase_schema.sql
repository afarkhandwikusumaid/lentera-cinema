-- ============================================================
-- LENTERA CINEMA — Supabase Schema
-- Jalankan SQL ini di Supabase SQL Editor (supabase.com → SQL)
-- ============================================================

-- 1. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  hero_title TEXT NOT NULL DEFAULT '',
  hero_subtitle TEXT NOT NULL DEFAULT '',
  hero_video_url TEXT NOT NULL DEFAULT ''
);

-- 2. SERVICES
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
    'site_settings', 'services', 'service_benefits', 'brands', 'school_clients',
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

-- ============================================================
-- INITIAL DATA (SEED)
-- ============================================================

INSERT INTO site_settings (id, hero_title, hero_subtitle, hero_video_url) VALUES 
('1', 'Timeless Wedding & Cinematic Event', 'Merekam emosi, mengabadikan momen. Lentera Cinema adalah partner visual Anda untuk menciptakan mahakarya dari setiap detik berharga.', 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4')
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, slug, subtitle, description, is_active) VALUES 
('srv-1', 'Wedding Cinematic', 'wedding', 'Abadikan momen sekali seumur hidup', 'Layanan dokumentasi wedding premium dengan tim profesional dan peralatan cinematic.', true),
('srv-2', 'Yearbook Video', 'yearbook', 'Kenangan masa sekolah', 'Video dokumentasi perpisahan sekolah yang epic dan tak terlupakan.', true),
('srv-3', 'Graduation', 'wisuda', 'Momen kelulusan berharga', 'Dokumentasi wisuda eksklusif untuk personal maupun instansi perguruan tinggi.', true),
('srv-4', 'Corporate & Studio', 'corporate', 'Profil profesional', 'Pembuatan video company profile, commercial, dan foto studio berkualitas tinggi.', true)
ON CONFLICT DO NOTHING;

INSERT INTO service_benefits (id, service_id, name, description, features, is_active, "order") VALUES 
('sb-1', 'srv-1', 'Paket Gold', 'Paket hemat untuk dokumentasi lengkap', '["1 Videographer", "1 Photographer", "1 Menit Cinematic Video", "100+ Edited Photos"]'::jsonb, true, 1),
('sb-2', 'srv-1', 'Paket Platinum', 'Paket premium dengan drone', '["2 Videographer", "2 Photographer", "Drone Pilot", "3 Menit Cinematic", "All Photos Color Graded", "Exclusive Album"]'::jsonb, true, 2),
('sb-3', 'srv-2', 'Paket Epic', 'Dokumentasi yearbook 1 angkatan', '["Konsep Storyline", "Sutradara & DOP", "Drone & Gimbal", "Behind The Scene"]'::jsonb, true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO brands (id, name, logo_url, is_active, "order") VALUES 
('br-1', 'Pertamina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Logo_Pertamina_%28Persero%29.svg/1200px-Logo_Pertamina_%28Persero%29.svg.png', true, 1),
('br-2', 'Bank Jatim', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bank_Jatim_logo.svg/1200px-Bank_Jatim_logo.svg.png', true, 2),
('br-3', 'Telkom Indonesia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Telkom_Indonesia_2013.svg/1200px-Telkom_Indonesia_2013.svg.png', true, 3),
('br-4', 'KAI', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Logo_PT_Kereta_Api_Indonesia_%28Persero%29_2020.svg/1200px-Logo_PT_Kereta_Api_Indonesia_%28Persero%29_2020.svg.png', true, 4)
ON CONFLICT DO NOTHING;

INSERT INTO school_clients (id, name, year, "order") VALUES 
('sc-1', 'SMAN 1 Malang', '2023', 1),
('sc-2', 'SMAN 3 Malang', '2023', 2),
('sc-3', 'SMAK Cor Jesu', '2024', 3),
('sc-4', 'Universitas Brawijaya', '2024', 4)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (id, client_name, photo_url, content, rating, is_featured) VALUES 
('t-1', 'Andi & Sarah', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Sangat puas dengan hasil video wedding kami! Tim Lentera Cinema sangat profesional dan mengerti angle terbaik.', 5, true),
('t-2', 'Panitia SMAN 1', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Yearbook video angkatan kami pecah banget! Teman-teman pada suka semua. Konsepnya dapet banget.', 5, true),
('t-3', 'Bapak Budi (Corporate)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Video company profile yang dibuat sangat merepresentasikan visi misi perusahaan kami dengan elegan.', 5, true)
ON CONFLICT DO NOTHING;

INSERT INTO portfolio_items (id, service_id, title, media_url, media_type, is_featured, "order") VALUES 
('p-1', 'srv-1', 'Wedding Andi & Sarah', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'image', true, 1),
('p-2', 'srv-1', 'Prewedding Bali', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'image', true, 2),
('p-3', 'srv-2', 'SMAN 1 Yearbook', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800', 'image', true, 3),
('p-4', 'srv-3', 'Graduation 2024', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 'image', true, 4)
ON CONFLICT DO NOTHING;
