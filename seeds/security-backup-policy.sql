-- ══════════════════════════════════════════════════════════════
-- VERİ GÜVENLİĞİ — Supabase SQL Editor'da çalıştır
-- ══════════════════════════════════════════════════════════════

-- 1. Eski audit log'ları otomatik temizle (90 günden eski)
-- Supabase cron extension aktif değilse bu manual yapılır
-- DELETE FROM audit_logs WHERE created_at < now() - interval '90 days';

-- 2. Eski page_views'ı otomatik temizle (180 günden eski)
-- DELETE FROM page_views WHERE created_at < now() - interval '180 days';

-- 3. Session güvenliği: auth.users tablosunda
-- Supabase Dashboard → Authentication → Settings:
--   - JWT expiry: 3600 (1 saat)
--   - Refresh token rotation: aktif
--   - Refresh token reuse interval: 10 saniye

-- 4. Rate limit: contact_messages tablosunda aynı email'den
--    son 1 dakika içinde max 1 mesaj
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
CREATE POLICY "public_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (
    length(name) >= 2 AND
    length(message) >= 10 AND
    length(email) >= 5 AND
    NOT EXISTS (
      SELECT 1 FROM contact_messages cm
      WHERE cm.email = email
      AND cm.created_at > now() - interval '1 minute'
    )
  );

-- 5. Admin tabloları güvenlik: pasif kullanıcılar erişemesin
-- (Bu RLS ile yapılır, Supabase auth seviyesinde değil)

-- 6. Hassas verileri loglamama
-- audit_logs'ta şifre, token gibi bilgiler ASLA loglanmaz
-- (Bu uygulama tarafında zaten yapılıyor — logAction details alanı kısıtlı)
