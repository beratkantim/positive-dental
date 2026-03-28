-- Tedavi detay sayfaları için sütunlar — Supabase SQL Editor'da çalıştır

ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';

-- Mevcut hizmetlere slug ata
UPDATE services SET slug = 'genel-dis-hekimligi' WHERE title = 'Genel Diş Hekimliği' AND slug IS NULL;
UPDATE services SET slug = 'implant-tedavisi' WHERE title = 'İmplant Tedavisi' AND slug IS NULL;
UPDATE services SET slug = 'estetik-dis-hekimligi' WHERE title = 'Estetik Diş Hekimliği' AND slug IS NULL;
UPDATE services SET slug = 'ortodonti' WHERE title = 'Ortodonti' AND slug IS NULL;
UPDATE services SET slug = 'cocuk-dis-hekimligi' WHERE title = 'Çocuk Diş Hekimliği' AND slug IS NULL;
UPDATE services SET slug = 'protez-kronlar' WHERE title ILIKE '%Protez%' AND slug IS NULL;
