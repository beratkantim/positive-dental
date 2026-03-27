-- Doktorlara tedavi/hizmet atama — Supabase SQL Editor'da çalıştır
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS service_ids text[] DEFAULT '{}';
-- Boş array = tüm hizmetleri yapar
