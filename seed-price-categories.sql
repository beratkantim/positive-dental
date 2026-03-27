-- Fiyat kategorileri tablosu — Supabase SQL Editor'da çalıştır

CREATE TABLE IF NOT EXISTS price_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT 'from-indigo-500 to-violet-600',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE price_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_price_cats" ON price_categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_price_cats" ON price_categories FOR ALL USING (auth.role() = 'authenticated');

-- Mevcut kategorileri ekle
INSERT INTO price_categories (name, icon, color, sort_order) VALUES
  ('Muayene Fiyatları',        '', 'from-indigo-500 to-violet-600', 1),
  ('Koruyucu Diş Hekimliği',   '', 'from-teal-500 to-cyan-600', 2),
  ('Çocuk Diş Tedavileri',     '', 'from-pink-500 to-rose-600', 3),
  ('Dolgu ve Kanal Tedavileri', '', 'from-amber-500 to-orange-500', 4),
  ('Diş Estetiği Tedavileri',  '', 'from-violet-500 to-purple-600', 5),
  ('Diş Beyazlatma',           '', 'from-sky-500 to-blue-600', 6),
  ('Diş Çekimi Fiyatları',     '', 'from-rose-500 to-red-600', 7),
  ('İmplant Tedavisi',         '', 'from-slate-600 to-slate-800', 8),
  ('Ortodontik Tedaviler',     '', 'from-green-500 to-emerald-600', 9),
  ('Protez Tedavileri',        '', 'from-orange-500 to-amber-600', 10),
  ('Ağız ve Çene Cerrahisi',   '', 'from-red-600 to-rose-700', 11),
  ('Dijital Diş Hekimliği',    '', 'from-indigo-600 to-blue-700', 12)
ON CONFLICT (name) DO NOTHING;
