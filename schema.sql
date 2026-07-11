-- Lentera Cinema Database Schema
-- Run this in your Supabase SQL Editor to set up the database tables and enable security rules.

-- 1. DROP EXISTING TABLES IF ANY (CAUTION)
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS school_clients CASCADE;
DROP TABLE IF EXISTS booking_status_history CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
-- Use cascade to drop FK references
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- 2. CREATE TABLE: BRANDS
CREATE TABLE brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE TABLE: SCHOOL CLIENTS
CREATE TABLE school_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE TABLE: SERVICES
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

-- 3. CREATE TABLE: PACKAGES
CREATE TABLE packages (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price BIGINT DEFAULT 0,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE TABLE: BOOKINGS
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    booking_code TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
    package_id TEXT REFERENCES packages(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled')),
    assigned_team TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE TABLE: PORTFOLIO ITEMS
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

-- 6. CREATE TABLE: TESTIMONIALS
CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    photo_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ENABLE ROW LEVEL SECURITY (RLS) FOR SECURITY
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 10. DEFINE PUBLIC READ POLICIES (All users can view services, packages, portfolio, testimonials, & search bookings)
CREATE POLICY "Public Read Brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read School Clients" ON school_clients FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Packages" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);

-- 9. DEFINE ADMIN FULL MANAGEMENT POLICIES (For Site 2 admin panel access)
-- Note: Simplified rules for direct anon/admin auth integration. Can be tightened further as needed.
CREATE POLICY "Admin All Services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Packages" ON packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Portfolio" ON portfolio_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

-- 10. PRE-SEED SAMPLE SEED DATA

-- Insert Services
INSERT INTO services (id, name, slug, description, is_active) VALUES
('srv-yb', 'Yearbook (Buku Kenangan)', 'yearbook', 'Dokumentasi masa sekolah paling berkesan dengan konsep kreatif, estetik, dan sinematik.', true),
('srv-wo', 'Wedding Organizer & Documentation', 'wedding', 'Abadikan momen sakral sekali seumur hidup dengan liputan video bergaya film bioskop.', true),
('srv-fg', 'Foto Graduation', 'foto-graduation', 'Foto wisuda studio-grade untuk kelulusan individu, kelompok, maupun angkatan.', true),
('srv-vg', 'Video Graduation', 'video-graduation', 'Liputan dokumentasi graduation event sekolah / universitas dengan multi-camera setup.', true);

-- Insert Packages
INSERT INTO packages (id, service_id, name, price, description, features, is_active, "order") VALUES
('pkg-yb-classic', 'srv-yb', 'Classic Memory', 185000, 'Paket dasar untuk dokumentasi kelas dengan cetak softcover.', ARRAY['1 Hari Sesi Foto (Outdoor/Indoor)', 'Cetak Buku Kenangan Softcover per Siswa', 'File Foto Edit (Digital Drive Access)', 'Fotografer & Pengarah Gaya Profesional'], true, 1),
('pkg-yb-cinematic', 'srv-yb', 'Cinematic Premium', 295000, 'Paket paling populer. Lengkap dengan cetak hardcover dan video cinematic b-roll kelas.', ARRAY['2 Hari Sesi Foto & Video', 'Cetak Buku Kenangan Premium Hardcover', 'Cinematic Drone Footage', 'Video Behind The Scene Kelas (3 Menit)', 'Gift box eksklusif untuk wali kelas'], true, 2),
('pkg-yb-custom', 'srv-yb', 'Pro-Studio Custom', 0, 'Konsep custom full angkatan dengan tema bebas dan cetak eksklusif.', ARRAY['Konsep Custom (Bebas Pilih Lokasi)', 'Cetakan Buku Box Set & Merchandise', 'Cinematic Trailer Angkatan (5-10 Menit)', '3 Hari Dokumentasi Foto/Video', 'Akses Studio Lentera Cinema Unlimited'], true, 3),
('pkg-wo-bronze', 'srv-wo', 'Eternal Love (Bronze)', 4500000, 'Dokumentasi akad nikah/pemberkatan esensial.', ARRAY['1 Fotografer + 1 Videografer', 'Sesi Akademi & Resepsi (Max 6 Jam)', '1 Min Cinematic Teaser (Instagram)', '150 Edited Photos on Drive', 'Semua Raw Files diserahkan'], true, 1),
('pkg-wo-gold', 'srv-wo', 'Royal Cinematic (Gold)', 8500000, 'Liputan lengkap akad dan resepsi dengan highlight film sinematik kelas atas.', ARRAY['2 Fotografer + 2 Videografer', 'Sesi Pre-wedding Foto/Video Singkat', '3-5 Menit Cinematic Wedding Film', 'Cetak Album Kolase 20 Halaman', 'Drone Aerial Video Shoot', 'Penyerahan file via custom flashdisk'], true, 2),
('pkg-fg-studio', 'srv-fg', 'Solo & Family Graduation', 350000, 'Sesi foto wisuda personal di studio kami bersama keluarga.', ARRAY['Sesi Foto Studio 45 Menit', 'Maksimal 6 Anggota Keluarga', '10 File Foto Retouched', 'Cetak Frame Minimalis 12R', 'Pilihan Backdrop Premium'], true, 1),
('pkg-fg-group', 'srv-fg', 'Graduation Squad Pack', 950000, 'Sesi foto wisuda rame-rame dengan sahabat terdekat.', ARRAY['Sesi Foto Studio 90 Menit', 'Hingga 10 Orang Teman/Sahabat', '25 File Foto Retouched', 'Cetak Foto Grup 12R (2 Pcs)', 'Semua file asli (Unedited) via Link'], true, 2),
('pkg-vg-event', 'srv-vg', 'Full Event Documentation', 6000000, 'Liputan lengkap acara wisuda dari awal hingga akhir.', ARRAY['3 Kamera Setup (FHD)', 'Liputan Sambutan & Prosesi Wisuda Lengkap', 'Video Highlight Acara 5 Menit', 'Pemberian Harddisk Eksternal berisi Full Video', 'Audio Direct Recording dari Sound System'], true, 1);

-- Insert Portfolios
INSERT INTO portfolio_items (id, service_id, title, media_url, media_type, is_featured, "order") VALUES
('port-1', 'srv-yb', 'SMA Cendrawasih - Retro 90s Yearbook', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800', 'image', true, 1),
('port-2', 'srv-yb', 'Cinematic High School Vibe', 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-fun-at-graduation-43407-large.mp4', 'video', true, 2),
('port-3', 'srv-wo', 'The Wedding of Dian & Rian - Glasshouse', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', 'image', true, 3),
('port-4', 'srv-wo', 'Romantic Sunset Walk Wedding', 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-enjoying-a-romantic-date-in-a-canyon-41584-large.mp4', 'video', true, 4),
('port-5', 'srv-fg', 'University Graduate Portrait', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800', 'image', false, 5),
('port-6', 'srv-vg', 'Graduation Ceremony Joy', 'https://assets.mixkit.co/videos/preview/mixkit-excited-students-throwing-caps-in-the-air-43405-large.mp4', 'video', true, 6);

-- Insert Testimonials
INSERT INTO testimonials (id, client_name, photo_url, content, rating, is_featured) VALUES
('test-1', 'Sarah Amalia (Panitia SMA 5)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', 'Kerja bareng Lentera Cinema seru banget! Konsep yearbook kelas kami dapet banget retro-nya. Hasil cetak hardcover-nya tebel & video cinematic BTS-nya diputer pas prom night bikin nangis seangkatan.', 5, true),
('test-2', 'Rian & Dian (Wedding Client)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', 'Videografernya super sabar ngarahin gaya yang ga kaku. Cinematic wedding film-nya bener-bener kaya film bioskop! Ga bosen di-replay terus. Sangat direkomendasikan paket Royal Gold-nya.', 5, true),
('test-3', 'Budi Hartono (Lulusan Unair)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', 'Foto studionya cepet tapi hasilnya pro-grade banget. Editingnya natural ga lebay. Bingkai frame minimalisnya sekarang terpajang rapi di ruang tamu orang tua saya.', 4, true);

-- Insert Bookings
INSERT INTO bookings (id, booking_code, client_name, phone, email, service_id, package_id, event_date, location, notes, status, assigned_team) VALUES
('book-1', 'LC-7382', 'Ahmad Fauzi', '081234567890', 'ahmad@example.com', 'srv-yb', 'pkg-yb-cinematic', '2026-07-20', 'SMA Negeri 1 Jakarta', 'Pemotretan di area taman sekolah & ruang kelas utama. Harap drone disiapkan.', 'confirmed', ARRAY['Dika (Fotografer)', 'Bagas (Videografer)', 'Rafi (Drone Operator)']),
('book-2', 'LC-9284', 'Clarissa Putri', '087799882233', 'clarissa.p@example.com', 'srv-wo', 'pkg-wo-gold', '2026-08-15', 'Glasshouse Ritz Carlton Jakarta', 'Akad jam 8 pagi, resepsi jam 7 malam. Butuh 2 team full liputan.', 'confirmed', ARRAY['Budi (Lead Photo)', 'Santi (Second Photo)', 'Hendra (Lead Video)', 'Fajar (Second Video)']),
('book-3', 'LC-1928', 'Muhammad Reynald', '085211223344', 'rey@example.com', 'srv-fg', 'pkg-fg-studio', '2026-07-12', 'Lentera Cinema Studio Cilandak', 'Foto wisuda bersama 4 anggota keluarga. Harap siapkan backdrop warna abu-abu.', 'pending', ARRAY[]::TEXT[]);
