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
