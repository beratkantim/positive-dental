-- Hizmetler seed — Supabase SQL Editor'da çalıştır

-- Önce features sütunu ekle (yoksa)
ALTER TABLE services ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';

DELETE FROM services;

INSERT INTO services (title, description, icon, color_from, color_to, features, is_featured, is_active, sort_order)
VALUES
  ('Genel Diş Hekimliği',
   'Rutin kontroller ve temel tedavilerle ağız sağlığınızı koruyun',
   '🦷', 'from-teal-500', 'to-cyan-600',
   ARRAY['Dijital tarama ve muayene', 'Laser destekli diş taşı temizliği', 'Kompozit dolgu tedavisi', 'Kanal tedavisi', 'Diş çekimi'],
   false, true, 1),

  ('İmplant Tedavisi',
   '3D planlama ile hassas ve kalıcı implant uygulamaları',
   '🔩', 'from-indigo-500', 'to-violet-600',
   ARRAY['3D implant planlaması', 'Aynı gün implant yükleme', 'Kemik augmentasyonu', 'Dijital ölçü ve protez', 'Uzun vadeli garanti'],
   true, true, 2),

  ('Estetik Diş Hekimliği',
   'Digital Smile Design ile hayalinizdeki gülüşü yaratıyoruz',
   '✨', 'from-violet-500', 'to-purple-600',
   ARRAY['Digital Smile Design (DSD)', 'Laser diş beyazlatma', 'Porselen laminalar', 'Gülüş simülasyonu', 'Diş eti estetiği'],
   true, true, 3),

  ('Ortodonti',
   'Şeffaf plak ve tel tedavisi ile mükemmel diş dizilimi',
   '😁', 'from-sky-500', 'to-blue-600',
   ARRAY['3D ortodonti planlaması', 'Şeffaf plak tedavisi', 'Metal / seramik braket', 'Sanal tedavi önizleme', 'Online tedavi takibi'],
   false, true, 4),

  ('Çocuk Diş Hekimliği',
   'Çocuklara özel güven veren ve eğlenceli tedavi ortamı',
   '🌟', 'from-pink-500', 'to-rose-500',
   ARRAY['Çocuk dostu klinik tasarımı', 'Koruyucu fissür örtücü', 'Florür uygulaması', 'Süt dişi takibi', 'Ebeveyn bilgilendirme'],
   false, true, 5),

  ('Protez & Kronlar',
   'Bilgisayar destekli tasarım ile aynı gün protez imkanı',
   '💎', 'from-amber-500', 'to-orange-500',
   ARRAY['Aynı gün porselen kron', 'Dijital köprü tasarımı', 'Hassas protezler', 'Dijital renk eşleştirme', 'Zirkonyum kronlar'],
   false, true, 6);
