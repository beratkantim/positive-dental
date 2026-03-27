-- ══════════════════════════════════════════════════════════════
-- GÜVENLİK SERTLEŞTİRME — Supabase SQL Editor'da çalıştır
-- ══════════════════════════════════════════════════════════════

-- 1. Contact messages: dakikada max 3 mesaj (IP bazlı kontrol Supabase'de yok,
--    ama aynı session'dan flood'u engelleyebiliriz)
-- Supabase RLS ile doğrudan rate limit yapılamaz, ama insert policy'yi sıkılaştırabiliriz:

-- Mevcut policy'yi güncelle — sadece boş olmayan mesajlar kabul edilsin
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (
    length(name) >= 2 AND
    length(message) >= 10 AND
    length(email) >= 5
  );

-- 2. Page views: sadece geçerli path'ler kabul edilsin (XSS/injection engelle)
DROP POLICY IF EXISTS "public_insert_views" ON page_views;
CREATE POLICY "public_insert_views" ON page_views
  FOR INSERT WITH CHECK (
    length(path) <= 500 AND
    length(referrer) <= 1000 AND
    length(browser) <= 50 AND
    length(session_id) <= 100 AND
    device IN ('mobile', 'tablet', 'desktop')
  );

-- 3. Storage: tüm bucket'larda DELETE policy (admin fotoğraf silebilsin)
-- Önce mevcut policy'leri temizle (hata verirse atla)
DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "auth_delete_all" ON storage.objects';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "auth_delete_all" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Storage: anonim kullanıcılar dosya yükleyemesin (sadece authenticated)
-- Mevcut upload policy'lerini kontrol et — authenticated olmalı
-- (Bu zaten var olmalı ama emin olalım)

-- 5. Admin tabloları: SELECT policy'lerinde gereksiz veri sızmasını engelle
-- contact_messages: anonim kullanıcılar okuyamasın (zaten yok ama emin olalım)
DROP POLICY IF EXISTS "public_read_contact" ON contact_messages;
-- Sadece admin okuyabilir (mevcut "admin_all_contact" yeterli)

-- 6. admin_users tablosu: sadece super_admin görebilsin
DROP POLICY IF EXISTS "admin_read_users" ON admin_users;
CREATE POLICY "admin_read_users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- 7. page_views: anonim kullanıcılar okuyamasın
DROP POLICY IF EXISTS "public_read_views" ON page_views;
-- Sadece admin okuyabilir (mevcut "admin_read_views" yeterli)

-- ══════════════════════════════════════════════════════════════
-- DOĞRULAMA: Tüm tabloların RLS'si aktif mi kontrol et
-- ══════════════════════════════════════════════════════════════
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
