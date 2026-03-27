-- Kullanıcı yönetimi güncelleme — Supabase SQL Editor'da çalıştır

-- role check constraint güncelle (viewer ekle)
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('super_admin', 'editor', 'viewer'));

-- user_id sütunu (auth.users ile bağlantı)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS user_id UUID;

-- email unique olsun
DO $$ BEGIN
  ALTER TABLE admin_users ADD CONSTRAINT admin_users_email_unique UNIQUE (email);
EXCEPTION WHEN duplicate_table THEN NULL;
WHEN duplicate_object THEN NULL;
END $$;
