-- Doktor ve Klinik detay sayfaları — Supabase SQL Editor'da çalıştır

-- Doktorlara detay sütunları
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';

-- Şubelere detay sütunları
ALTER TABLE branches ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';

-- Doktor slug'larını isimlerinden otomatik oluştur
-- Türkçe karakter dönüşümü: ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u
UPDATE doctors SET slug = lower(
  replace(replace(replace(replace(replace(replace(
  replace(replace(replace(replace(replace(replace(
    trim(name),
    'ç','c'),'ğ','g'),'ı','i'),'ö','o'),'ş','s'),'ü','u'),
    'Ç','c'),'Ğ','g'),'İ','i'),'Ö','o'),'Ş','s'),'Ü','u')
) WHERE slug IS NULL OR slug = '';

-- Boşlukları tire yap, özel karakterleri kaldır
UPDATE doctors SET slug = regexp_replace(
  regexp_replace(lower(slug), '[^a-z0-9]+', '-', 'g'),
  '^-|-$', '', 'g'
) WHERE slug IS NOT NULL;

-- Klinik slug'ları zaten var (branches.slug), kontrol et
UPDATE branches SET slug = regexp_replace(
  regexp_replace(lower(
    replace(replace(replace(replace(replace(replace(
    replace(replace(replace(replace(replace(replace(
      trim(name),
      'ç','c'),'ğ','g'),'ı','i'),'ö','o'),'ş','s'),'ü','u'),
      'Ç','c'),'Ğ','g'),'İ','i'),'Ö','o'),'Ş','s'),'Ü','u')
  ), '[^a-z0-9]+', '-', 'g'),
  '^-|-$', '', 'g'
) WHERE slug IS NULL OR slug = '';
