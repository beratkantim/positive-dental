-- Doktorlara Dentsoft ID alanı ekle — Supabase SQL Editor'da çalıştır
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS dentsoft_id TEXT DEFAULT '';
