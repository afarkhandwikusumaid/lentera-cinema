-- Lentera Cinema Database Schema
-- Run this in your Supabase SQL Editor to set up the database tables and enable security rules.

-- ==========================================
-- 1. DROP EXISTING TABLES IF ANY (CAUTION)
-- ==========================================
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS school_clients CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS service_benefits CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS project_payments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- Brands / Mitra
CREATE TABLE brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Klien Sekolah
CREATE TABLE school_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Layanan Utama (Misal: Yearbook, Wedding)
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    description TEXT,
    video_url TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sub-Layanan / Benefit Layanan (Tanpa Harga)
CREATE TABLE service_benefits (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Booking / Reservasi
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    booking_code TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
    benefit_id TEXT REFERENCES service_benefits(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled')),
    assigned_team TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. FINANCIAL & PROJECT MANAGEMENT TABLES
-- ==========================================

-- Manajemen Proyek
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    qty INTEGER DEFAULT 1,
    price BIGINT DEFAULT 0,
    total_value BIGINT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Termin Pembayaran Proyek
CREATE TABLE project_payments (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    term_name TEXT NOT NULL,
    amount BIGINT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pengeluaran Operasional & Proyek
CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount BIGINT NOT NULL,
    expense_date DATE NOT NULL,
    expense_type TEXT DEFAULT 'project' CHECK (expense_type IN ('project', 'universal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. CONTENT TABLES
-- ==========================================

-- Portofolio
CREATE TABLE portfolio_items (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    is_featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimoni
CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    photo_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read School Clients" ON school_clients FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Service Benefits" ON service_benefits FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Admin All Services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Service Benefits" ON service_benefits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Portfolio" ON portfolio_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Payments" ON project_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 6. INITIAL SEED DATA
-- ==========================================

-- Insert Default Services ONLY
INSERT INTO services (id, name, slug, subtitle, description, image_url, is_active) VALUES
('srv-yb', 'Yearbook Premium', 'yearbook', 'Buku Tahunan Eksklusif', 'Dokumentasi masa sekolah paling berkesan dengan konsep kreatif, estetik, dan sinematik. Lengkap dengan material cetak eksklusif dan drone b-roll.', '/images/yearbook.png', true),
('srv-ws', 'Dokumentasi Wisuda', 'wisuda', 'Foto & Video Wisuda', 'Abadikan momen kelulusan Anda dengan sesi foto studio/outdoor dan dokumentasi video sinematik beresolusi tinggi.', '/images/graduation.png', true),
('srv-wd', 'Wedding Organizer & Documentation', 'wedding', 'Liputan Pernikahan Mewah', 'Abadikan momen sakral sekali seumur hidup dengan liputan video bergaya film bioskop yang menangkap setiap emosi.', '/images/wedding.png', true),
('srv-ev', 'Dokumentasi Event', 'foto-event', 'Event Coverage', 'Liputan dokumentasi acara formal maupun non-formal (konser, seminar, ulang tahun) dengan konsep visual estetik.', '/images/video_wisuda.png', true),
('srv-km', 'Komersil & Produk', 'dokumentasi-product', 'Commercial & Corporate', 'Produksi video company profile, iklan komersial, dan foto produk berkualitas tinggi untuk meningkatkan citra brand Anda.', '/images/yearbook.png', true);

-- Insert Default Benefit Examples
INSERT INTO service_benefits (id, service_id, name, description, features, is_active, "order") VALUES
('ben-yb-1', 'srv-yb', 'Sesi Foto & Video Tematik', 'Konsep foto indoor/outdoor tematik per kelas sesuai request.', ARRAY['1-2 Hari Sesi', 'Pengarahan Gaya', 'Peralatan Lighting Standar Studio'], true, 1),
('ben-yb-2', 'srv-yb', 'Pencetakan Hardcover', 'Pencetakan kualitas premium untuk buku tahunan.', ARRAY['Kertas Art Paper 150gr', 'Laminasi Doff/Glossy', 'Binding Kuat'], true, 2);

-- ==========================================
-- 7. STORAGE BUCKETS
-- ==========================================

-- Pastikan ekstensi yang dibutuhkan aktif (hanya info, dikelola supabase secara otomatis)
-- Insert new bucket "uploads"
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO NOTHING;

-- Policies for "uploads" bucket
-- Berikan hak akses baca untuk publik
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Berikan hak akses unggah (Insert)
CREATE POLICY "Anon Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'uploads' );

