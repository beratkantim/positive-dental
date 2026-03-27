-- Sigortalar tablosuna indirim oranı ekle — Supabase SQL Editor'da çalıştır
ALTER TABLE insurances ADD COLUMN IF NOT EXISTS discount_rate INTEGER DEFAULT 0;

-- Partners tablosunda discount_rate zaten string, integer'a çevirelim
-- (discount_rate text → integer olması daha iyi ama mevcut yapıyı bozmayalım)
