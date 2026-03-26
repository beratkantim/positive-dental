-- ================================================================
-- Positive Dental Studio — Supabase Database Migration
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ================================================================

-- ── 1. DOCTORS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT '',
  specialty   TEXT NOT NULL DEFAULT '',
  branch      TEXT NOT NULL CHECK (branch IN ('adana', 'istanbul')),
  branch_label TEXT NOT NULL DEFAULT '',
  photo       TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  education   TEXT[] NOT NULL DEFAULT '{}',
  expertise   TEXT[] NOT NULL DEFAULT '{}',
  booking_url TEXT NOT NULL DEFAULT 'https://randevu.positivedental.com',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. SERVICES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  color_from  TEXT NOT NULL DEFAULT '',
  color_to    TEXT NOT NULL DEFAULT '',
  image       TEXT NOT NULL DEFAULT '',
  price_range TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. BLOG POSTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  excerpt          TEXT NOT NULL DEFAULT '',
  category         TEXT NOT NULL DEFAULT '',
  category_color   TEXT NOT NULL DEFAULT '',
  author           TEXT NOT NULL DEFAULT '',
  author_title     TEXT NOT NULL DEFAULT '',
  content          TEXT NOT NULL DEFAULT '',
  image            TEXT NOT NULL DEFAULT '',
  keywords         TEXT[] NOT NULL DEFAULT '{}',
  meta_description TEXT NOT NULL DEFAULT '',
  read_time        TEXT NOT NULL DEFAULT '',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. BRANCHES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS branches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  city          TEXT NOT NULL DEFAULT '',
  address       TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  map_url       TEXT NOT NULL DEFAULT '',
  working_hours TEXT NOT NULL DEFAULT '',
  image         TEXT NOT NULL DEFAULT '',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. TESTIMONIALS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  text        TEXT NOT NULL DEFAULT '',
  rating      INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image       TEXT NOT NULL DEFAULT '',
  branch      TEXT NOT NULL DEFAULT '',
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. CONTACT MESSAGES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  branch     TEXT NOT NULL DEFAULT '',
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  is_replied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 7. SITE SETTINGS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  label      TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL DEFAULT 'text',
  group_name TEXT NOT NULL DEFAULT 'general'
);

-- ── 8. HERO SLIDES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag            TEXT NOT NULL DEFAULT '',
  tag_color      TEXT NOT NULL DEFAULT '',
  title          TEXT NOT NULL,
  title_gradient TEXT NOT NULL DEFAULT '',
  subtitle       TEXT NOT NULL DEFAULT '',
  badge          TEXT NOT NULL DEFAULT '',
  image          TEXT NOT NULL DEFAULT '',
  features       TEXT[] NOT NULL DEFAULT '{}',
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. PRICE ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category   TEXT NOT NULL DEFAULT '',
  name       TEXT NOT NULL,
  price_min  NUMERIC NOT NULL DEFAULT 0,
  price_max  NUMERIC NOT NULL DEFAULT 0,
  price_note TEXT NOT NULL DEFAULT '',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. ADMIN USERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Tüm tablolarda RLS'yi etkinleştir
ALTER TABLE doctors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides      ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- ── PUBLIC READ (anon kullanıcılar aktif kayıtları okuyabilir) ──
CREATE POLICY "Public read doctors"      ON doctors          FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read services"     ON services         FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read blog_posts"   ON blog_posts       FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read branches"     ON branches         FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read testimonials" ON testimonials     FOR SELECT USING (is_approved = TRUE AND is_active = TRUE);
CREATE POLICY "Public read site_settings" ON site_settings   FOR SELECT USING (TRUE);
CREATE POLICY "Public read hero_slides"  ON hero_slides      FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read price_items"  ON price_items      FOR SELECT USING (is_active = TRUE);

-- ── PUBLIC INSERT (iletişim formu) ──────────────────────────────
CREATE POLICY "Public insert messages"   ON contact_messages FOR INSERT WITH CHECK (TRUE);

-- ── AUTHENTICATED FULL ACCESS (admin paneli) ────────────────────
CREATE POLICY "Admin full doctors"      ON doctors          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full services"     ON services         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full blog_posts"   ON blog_posts       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full branches"     ON branches         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full testimonials" ON testimonials     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full messages"     ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full settings"     ON site_settings    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full hero_slides"  ON hero_slides      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full price_items"  ON price_items      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full admin_users"  ON admin_users      FOR ALL USING (auth.role() = 'authenticated');


-- ================================================================
-- SEED DATA — Mevcut doktorları ekle
-- ================================================================

INSERT INTO doctors (id, name, title, specialty, branch, branch_label, photo, bio, education, expertise, booking_url, sort_order)
VALUES
  (gen_random_uuid(), 'Dt. Elif Kaya', 'Diş Hekimi', 'Genel Diş Hekimliği & Estetik', 'adana', 'Adana Türkmenbaşı',
   'https://images.unsplash.com/photo-1754715203698-70c7ad3a879d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   '10 yılı aşkın deneyimiyle estetik diş hekimliği ve gülüş tasarımı konusunda uzmanlaşmış, hasta memnuniyetini her şeyin önünde tutan bir hekim.',
   ARRAY['Çukurova Üniversitesi Diş Hekimliği Fakültesi', 'İmplantoloji Sertifika Programı – Türk İmplant Derneği'],
   ARRAY['Gülüş Tasarımı', 'Zirkonyum Kaplama', 'Diş Beyazlatma', 'Kompozit Bonding'],
   'https://randevu.positivedental.com', 1),

  (gen_random_uuid(), 'Dt. Murat Demir', 'Uzman Diş Hekimi', 'İmplantoloji & Cerrahi', 'adana', 'Adana Türkmenbaşı',
   'https://images.unsplash.com/photo-1631596577204-53ad0d6e6978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'İmplant cerrahisi ve ileri cerrahi prosedürler konusunda uzman olan Dt. Demir, 1.500''ün üzerinde başarılı implant uygulamasına sahiptir.',
   ARRAY['Ankara Üniversitesi Diş Hekimliği Fakültesi', 'Oral İmplantoloji Uzmanlık – ITI Türkiye'],
   ARRAY['Dental İmplant', 'Sinüs Lifting', 'Kemik Grefti', 'All-on-4 / All-on-6'],
   'https://randevu.positivedental.com', 2),

  (gen_random_uuid(), 'Dt. Selin Arslan', 'Ortodonti Uzmanı', 'Ortodonti & Invisalign', 'adana', 'Adana Türkmenbaşı',
   'https://images.unsplash.com/photo-1772987057599-2f1088c1e993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'Şeffaf plak tedavisi ve geleneksel braket sistemleri konusunda uzmanlaşmış, her yaş grubuna yönelik ortodontik çözümler sunan hekim.',
   ARRAY['Ege Üniversitesi Ortodonti Anabilim Dalı – Uzmanlık', 'Invisalign Sertifikalı Sağlayıcı – Diamond Provider'],
   ARRAY['Invisalign', 'Metal Braket', 'Seramik Braket', 'Çocuk Ortodonti'],
   'https://randevu.positivedental.com', 3),

  (gen_random_uuid(), 'Dt. Can Yılmaz', 'Uzman Diş Hekimi', 'Periodontoloji & İmplant', 'istanbul', 'İstanbul Nişantaşı',
   'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'Diş eti hastalıkları ve implant cerrahisinde uzman olan Dt. Yılmaz, minimal invazif yaklaşımlarıyla tanınmakta ve yılda 200+ başarılı uygulama gerçekleştirmektedir.',
   ARRAY['İstanbul Üniversitesi Diş Hekimliği Fakültesi', 'Periodontoloji Uzmanlığı – Marmara Üniversitesi'],
   ARRAY['Periodontoloji', 'Lazer Diş Eti Tedavisi', 'İmplant', 'Kemik Rejenerasyonu'],
   'https://randevu.positivedental.com', 4),

  (gen_random_uuid(), 'Dt. Ayşe Çelik', 'Estetik Diş Hekimi', 'Estetik Diş Hekimliği & Lamine', 'istanbul', 'İstanbul Nişantaşı',
   'https://images.unsplash.com/photo-1565090567208-c8038cfcf6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'Lamine veneer ve porselenden gülüş tasarımı alanında öncü isimlerden biri olan Dt. Çelik, uluslararası estetik diş hekimliği kongrelerinde konuşmacı olarak yer almaktadır.',
   ARRAY['Hacettepe Üniversitesi Diş Hekimliği Fakültesi', 'Estetik Diş Hekimliği – EAED Üyesi'],
   ARRAY['Lamine Veneer', 'Porelen Kaplama', 'Gülüş Tasarımı', 'Ofis Beyazlatma'],
   'https://randevu.positivedental.com', 5),

  (gen_random_uuid(), 'Dt. Berk Şahin', 'Ortodonti & Pedodonti', 'Çocuk Diş Hekimliği & Ortodonti', 'istanbul', 'İstanbul Nişantaşı',
   'https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'Çocuk ve ergen hastalarda ortodontik tedavi ile koruyucu diş hekimliği konusunda uzmanlaşmış; çocukların kliniğe olan kaygılarını azaltma konusunda özel eğitim almış hekim.',
   ARRAY['İstanbul Üniversitesi Pedodonti Uzmanlığı', 'Çocuk Ortodontisi – Türk Ortodonti Derneği'],
   ARRAY['Çocuk Diş Hekimliği', 'Koruyucu Ortodonti', 'Fissür Örtücü', 'Florür Uygulaması'],
   'https://randevu.positivedental.com', 6),

  (gen_random_uuid(), 'Dt. Naz Yıldız', 'Diş Hekimi', 'Endodonti & Restoratif', 'istanbul', 'İstanbul Nişantaşı',
   'https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
   'Kanal tedavisi ve restoratif diş hekimliğinde uzmanlaşmış olan Dt. Yıldız, modern endodontik teknolojilerle ağrısız ve hızlı tedavi protokolleri uygulamaktadır.',
   ARRAY['Gazi Üniversitesi Diş Hekimliği Fakültesi', 'Endodonti İleri Eğitim – Türk Endodonti Derneği'],
   ARRAY['Kanal Tedavisi', 'Kompozit Dolgu', 'Porselen İnley', 'Restorasyon'],
   'https://randevu.positivedental.com', 7);


-- ── SEED: Şubeler ───────────────────────────────────────────────
INSERT INTO branches (slug, name, city, address, phone, email, working_hours, image)
VALUES
  ('adana-turkmenbasi', 'Adana Türkmenbaşı', 'Adana',
   'Türkmenbaşı Mah. Atatürk Cad. No:123, Seyhan/Adana',
   '0322 123 45 67', 'adana@positivedental.com',
   'Pzt-Cmt: 09:00-19:00', ''),
  ('istanbul-nisantasi', 'İstanbul Nişantaşı', 'İstanbul',
   'Nişantaşı Mah. Valikonağı Cad. No:45, Şişli/İstanbul',
   '0212 987 65 43', 'istanbul@positivedental.com',
   'Pzt-Cmt: 09:00-19:00', '');


-- ── SEED: Site Ayarları ─────────────────────────────────────────
INSERT INTO site_settings (key, value, label, type, group_name) VALUES
  ('site_name',    'Positive Dental Studio', 'Site Adı',        'text',  'general'),
  ('site_phone',   '0322 123 45 67',        'Telefon',          'text',  'contact'),
  ('site_email',   'info@positivedental.com','Email',            'text',  'contact'),
  ('site_address', 'Türkmenbaşı Mah. Atatürk Cad. No:123, Seyhan/Adana', 'Adres', 'textarea', 'contact'),
  ('working_hours','Pzt-Cmt: 09:00-19:00',  'Çalışma Saatleri', 'text',  'contact'),
  ('instagram_url','https://instagram.com/positivedental', 'Instagram', 'text', 'social'),
  ('facebook_url', '',                        'Facebook',         'text', 'social'),
  ('twitter_url',  '',                        'Twitter/X',        'text', 'social'),
  ('whatsapp_no',  '905321234567',            'WhatsApp No',      'text', 'social');


-- ================================================================
-- İNDEKSLER
-- ================================================================
CREATE INDEX idx_doctors_branch       ON doctors (branch);
CREATE INDEX idx_doctors_sort         ON doctors (sort_order);
CREATE INDEX idx_blog_posts_slug      ON blog_posts (slug);
CREATE INDEX idx_blog_posts_published ON blog_posts (is_published, published_at DESC);
CREATE INDEX idx_messages_created     ON contact_messages (created_at DESC);
CREATE INDEX idx_hero_slides_sort     ON hero_slides (sort_order);
CREATE INDEX idx_price_items_category ON price_items (category);
