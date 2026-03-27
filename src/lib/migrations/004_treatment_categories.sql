-- ============================================================
-- 004: Tedavi Kategorileri (Ana Tedavi Grupları)
-- ============================================================

-- 1. treatment_categories tablosu
CREATE TABLE IF NOT EXISTS treatment_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🦷',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE treatment_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "treatment_categories_public_read" ON treatment_categories
  FOR SELECT USING (true);

-- 2. services tablosuna category_id ekle
ALTER TABLE services ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES treatment_categories(id) ON DELETE SET NULL;

-- 3. Seed: Ana tedavi grupları
INSERT INTO treatment_categories (name, slug, icon, sort_order) VALUES
  ('Tedavi ve Endodonti',          'tedavi-ve-endodonti',          '🦷', 1),
  ('Pedodonti',                    'pedodonti',                    '👶', 2),
  ('Protez',                       'protez',                       '🔧', 3),
  ('Periodontoloji',               'periodontoloji',               '🩺', 4),
  ('Ortodonti',                    'ortodonti',                    '😁', 5),
  ('Beyazlatma',                   'beyazlatma',                   '✨', 6),
  ('Botoks',                       'botoks',                       '💉', 7),
  ('Cerrahi',                      'cerrahi',                      '🔪', 8),
  ('Diş Temizliği',               'dis-temizligi',                '🪥', 9),
  ('İmplantoloji',                'implantoloji',                 '🔩', 10),
  ('Oral Diagnoz',                 'oral-diagnoz',                 '🔍', 11),
  ('Protez İmplantüstü',          'protez-implant-ustu',          '⚙️', 12),
  ('Teşhis ve Tedavi Planlaması', 'teshis-ve-tedavi-planlamasi',  '📋', 13),
  ('Ağız-Diş ve Çene Cerrahisi',  'agiz-dis-ve-cene-cerrahisi',   '🏥', 14)
ON CONFLICT (slug) DO NOTHING;
