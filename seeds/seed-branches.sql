-- Şube verilerini güncelle — Supabase SQL Editor'da çalıştır
-- Önce mevcut kayıtları sil (varsa)
DELETE FROM branches;

INSERT INTO branches (slug, name, city, address, phone, email, map_url, working_hours, is_active, sort_order)
VALUES
  (
    'istanbul-nisantasi',
    'İstanbul Nişantaşı',
    'İstanbul',
    'Teşvikiye Mah., Vali Konağı Cad. No:34/2, Nişantaşı / Şişli',
    '0212 555 01 01',
    'nisantasi@positivedental.com',
    'Positive+Dental+Studio+Nişantaşı+İstanbul',
    'Pzt–Cum: 09:00–20:00 | Cts: 09:00–18:00',
    true,
    1
  ),
  (
    'adana-turkmenbasi',
    'Adana Türkmenbaşı',
    'Adana',
    'Türkmenbaşı Mah., Atatürk Cad. No:89/1, Seyhan / Adana',
    '0322 555 02 02',
    'adana@positivedental.com',
    'Positive+Dental+Studio+Adana+Türkmenbaşı',
    'Pzt–Cum: 09:00–20:00 | Cts: 09:00–18:00',
    true,
    2
  );
