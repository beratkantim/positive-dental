-- Doktorlar çoklu şube desteği — Supabase SQL Editor'da çalıştır

-- branches text[] sütunu ekle
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS branches text[] DEFAULT '{}';

-- Mevcut branch değerini branches array'ine taşı
UPDATE doctors SET branches = ARRAY[branch] WHERE branches = '{}' AND branch IS NOT NULL AND branch != '';

-- branch_label'ı da branches_labels array'ine taşı
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS branches_labels text[] DEFAULT '{}';
UPDATE doctors SET branches_labels = ARRAY[branch_label] WHERE branches_labels = '{}' AND branch_label IS NOT NULL AND branch_label != '';
