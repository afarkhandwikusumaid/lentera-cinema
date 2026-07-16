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
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS project_payments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- Pengaturan Web
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY,
    hero_title TEXT NOT NULL DEFAULT '',
    hero_subtitle TEXT NOT NULL DEFAULT '',
    hero_video_url TEXT NOT NULL DEFAULT ''
);

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
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
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
CREATE POLICY "Admin All Site Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 6. INITIAL SEED DATA
-- ==========================================

INSERT INTO site_settings (id, hero_title, hero_subtitle, hero_video_url) VALUES 
('1', 'Timeless Wedding & Cinematic Event', 'Merekam emosi, mengabadikan momen. Lentera Cinema adalah partner visual Anda untuk menciptakan mahakarya dari setiap detik berharga.', 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4')
ON CONFLICT DO NOTHING;

-- Insert Default Services ONLY
INSERT INTO services (id, name, slug, subtitle, description, image_url, is_active) VALUES
('srv-yb', 'Yearbook Premium', 'yearbook', 'Buku Tahunan Eksklusif', 'Dokumentasi masa sekolah paling berkesan dengan konsep kreatif, estetik, dan sinematik. Lengkap dengan material cetak eksklusif dan drone b-roll.', '/images/yearbook.png', true),
('srv-ws', 'Dokumentasi Wisuda', 'wisuda', 'Foto & Video Wisuda', 'Abadikan momen kelulusan Anda dengan sesi foto studio/outdoor dan dokumentasi video sinematik beresolusi tinggi.', '/images/graduation.png', true),
('srv-wd', 'Wedding Organizer & Documentation', 'wedding', 'Liputan Pernikahan Mewah', 'Abadikan momen sakral sekali seumur hidup dengan liputan video bergaya film bioskop yang menangkap setiap emosi.', '/images/wedding.png', true),
('srv-ev', 'Dokumentasi Event', 'foto-event', 'Event Coverage', 'Liputan dokumentasi acara formal maupun non-formal (konser, seminar, ulang tahun) dengan konsep visual estetik.', '/images/video_wisuda.png', true),
('srv-km', 'Komersil & Produk', 'dokumentasi-product', 'Commercial & Corporate', 'Produksi video company profile, iklan komersial, dan foto produk berkualitas tinggi untuk meningkatkan citra brand Anda.', '/images/yearbook.png', true)
ON CONFLICT DO NOTHING;

-- Insert Default Benefit Examples
INSERT INTO service_benefits (id, service_id, name, description, features, is_active, "order") VALUES
('ben-yb-1', 'srv-yb', 'Sesi Foto & Video Tematik', 'Konsep foto indoor/outdoor tematik per kelas sesuai request.', ARRAY['1-2 Hari Sesi', 'Pengarahan Gaya', 'Peralatan Lighting Standar Studio'], true, 1),
('ben-yb-2', 'srv-yb', 'Pencetakan Hardcover', 'Pencetakan kualitas premium untuk buku tahunan.', ARRAY['Kertas Art Paper 150gr', 'Laminasi Doff/Glossy', 'Binding Kuat'], true, 2)
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
('p-1', 'srv-wd', 'Wedding Andi & Sarah', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 'image', true, 1),
('p-2', 'srv-wd', 'Prewedding Bali', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'image', true, 2),
('p-3', 'srv-yb', 'SMAN 1 Yearbook', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800', 'image', true, 3),
('p-4', 'srv-ws', 'Graduation 2024', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 'image', true, 4)
ON CONFLICT DO NOTHING;

INSERT INTO projects (id, name, client_name, qty, price, total_value, status) VALUES 
('prj-1', 'Dokumentasi Wedding Andi & Sarah', 'Andi', 1, 15000000, 15000000, 'active'),
('prj-2', 'Video Yearbook SMAN 1 Malang', 'Panitia SMAN 1', 1, 25000000, 25000000, 'completed')
ON CONFLICT DO NOTHING;

INSERT INTO project_payments (id, project_id, term_name, amount, due_date, status, paid_date) VALUES 
('pay-1', 'prj-1', 'DP 50%', 7500000, '2024-01-01', 'paid', '2024-01-02'),
('pay-2', 'prj-1', 'Pelunasan', 7500000, '2024-02-01', 'unpaid', NULL),
('pay-3', 'prj-2', 'Lunas', 25000000, '2023-12-01', 'paid', '2023-12-05')
ON CONFLICT DO NOTHING;

INSERT INTO expenses (id, project_id, description, amount, expense_date, expense_type) VALUES 
('exp-1', 'prj-1', 'Sewa Lensa Tambahan', 500000, '2024-01-15', 'project'),
('exp-2', 'prj-2', 'Transportasi Tim', 300000, '2023-12-10', 'project'),
('exp-3', NULL, 'Langganan Adobe CC', 600000, '2024-01-05', 'universal')
ON CONFLICT DO NOTHING;

INSERT INTO bookings (id, booking_code, client_name, phone, email, service_id, benefit_id, event_date, location, notes, status, assigned_team) VALUES
('bk-1', 'BK-2024-001', 'Budi Santoso', '081234567890', 'budi@example.com', 'srv-wd', NULL, '2024-05-20', 'Hotel Majapahit Surabaya', 'Mohon tim standby jam 06.00 pagi', 'confirmed', ARRAY['Andi (Videografer)', 'Budi (Fotografer)']),
('bk-2', 'BK-2024-002', 'SMA Negeri 5', '089876543210', 'info@sman5.sch.id', 'srv-yb', 'ben-yb-1', '2024-06-15', 'Gedung Graha Cakrawala', 'Tema acara: Vintage', 'pending', ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;

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
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Berikan hak akses unggah (Insert)
DROP POLICY IF EXISTS "Anon Insert" ON storage.objects;
CREATE POLICY "Anon Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'uploads' );

