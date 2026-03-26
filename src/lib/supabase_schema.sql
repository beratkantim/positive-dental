-- ============================================================
-- POSITIVE DENTAL STUDIO — Supabase Database Schema
-- Supabase SQL Editor'e kopyalayıp çalıştırın
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. DOKTORLAR
-- ============================================================
create table doctors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  title text not null,
  specialty text not null,
  branch text not null check (branch in ('adana', 'istanbul')),
  branch_label text not null,
  photo text,
  bio text,
  education text[] default '{}',
  expertise text[] default '{}',
  booking_url text default 'https://randevu.positivedental.com',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 2. HİZMETLER
-- ============================================================
create table services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  color_from text default 'from-indigo-500',
  color_to text default 'to-violet-600',
  image text,
  price_range text,
  duration text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. BLOG YAZILARI
-- ============================================================
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text,
  category_color text default 'bg-indigo-100 text-indigo-700',
  author text,
  author_title text,
  content text,
  image text,
  keywords text[] default '{}',
  meta_description text,
  read_time text,
  is_featured boolean default false,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 4. ŞUBELER
-- ============================================================
create table branches (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  city text not null,
  address text,
  phone text,
  email text,
  map_url text,
  map_embed text,
  working_hours text,
  image text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. HASTA YORUMLARI
-- ============================================================
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  text text not null,
  rating integer default 5 check (rating between 1 and 5),
  image text,
  branch text,
  is_approved boolean default false,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 6. İLETİŞİM FORMU MESAJLARI
-- ============================================================
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  branch text,
  is_read boolean default false,
  is_replied boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. SİTE AYARLARI (hero, istatistikler, genel içerik)
-- ============================================================
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  label text,
  type text default 'text' check (type in ('text', 'textarea', 'image', 'json', 'boolean')),
  group_name text default 'genel',
  updated_at timestamptz default now()
);

-- ============================================================
-- 8. HERO SLİDER
-- ============================================================
create table hero_slides (
  id uuid primary key default uuid_generate_v4(),
  tag text,
  tag_color text default 'text-violet-300',
  title text not null,
  title_gradient text default 'from-indigo-400 via-violet-400 to-purple-400',
  subtitle text,
  badge text,
  image text,
  accent_from text default 'from-indigo-500',
  accent_to text default 'to-violet-600',
  features text[] default '{}',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 9. ANLAŞMALI SİGORTALAR
-- ============================================================
create table insurances (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo text,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 10. ANLAŞMALI KURUMLAR
-- ============================================================
create table partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo text,
  description text,
  discount_rate text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 11. FİYAT LİSTESİ
-- ============================================================
create table price_items (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  name text not null,
  price_min integer,
  price_max integer,
  price_note text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 12. ADMIN KULLANICILARI (roller: super_admin, editor)
-- ============================================================
create table admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  role text default 'editor' check (role in ('super_admin', 'editor')),
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger doctors_updated_at before update on doctors for each row execute function update_updated_at();
create trigger services_updated_at before update on services for each row execute function update_updated_at();
create trigger blog_posts_updated_at before update on blog_posts for each row execute function update_updated_at();
create trigger branches_updated_at before update on branches for each row execute function update_updated_at();
create trigger testimonials_updated_at before update on testimonials for each row execute function update_updated_at();
create trigger hero_slides_updated_at before update on hero_slides for each row execute function update_updated_at();
create trigger price_items_updated_at before update on price_items for each row execute function update_updated_at();

-- ============================================================
-- İLK VERİLER — Site Ayarları
-- ============================================================
insert into site_settings (key, value, label, type, group_name) values
  ('site_title', 'Positive Dental Studio', 'Site Başlığı', 'text', 'genel'),
  ('site_phone', '0850 123 45 67', 'Telefon', 'text', 'iletişim'),
  ('site_email', 'info@positivedental.com', 'Email', 'text', 'iletişim'),
  ('site_instagram', 'https://instagram.com/positivedental', 'Instagram', 'text', 'sosyal_medya'),
  ('site_facebook', 'https://facebook.com/positivedental', 'Facebook', 'text', 'sosyal_medya'),
  ('stat_patients', '15.000+', 'Mutlu Hasta Sayısı', 'text', 'istatistikler'),
  ('stat_doctors', '25+', 'Uzman Hekim Sayısı', 'text', 'istatistikler'),
  ('stat_branches', '4', 'Klinik Sayısı', 'text', 'istatistikler'),
  ('stat_rating', '4.9★', 'Google Puanı', 'text', 'istatistikler'),
  ('booking_url', 'https://randevu.positivedental.com', 'Randevu URL', 'text', 'genel');

-- ============================================================
-- RLS POLİTİKALARI (güvenlik)
-- ============================================================
alter table doctors enable row level security;
alter table services enable row level security;
alter table blog_posts enable row level security;
alter table branches enable row level security;
alter table testimonials enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;
alter table hero_slides enable row level security;
alter table insurances enable row level security;
alter table partners enable row level security;
alter table price_items enable row level security;
alter table admin_users enable row level security;

-- Herkese okuma izni (aktif kayıtlar)
create policy "public_read_doctors" on doctors for select using (is_active = true);
create policy "public_read_services" on services for select using (is_active = true);
create policy "public_read_blog" on blog_posts for select using (is_published = true);
create policy "public_read_branches" on branches for select using (is_active = true);
create policy "public_read_testimonials" on testimonials for select using (is_active = true and is_approved = true);
create policy "public_read_settings" on site_settings for select using (true);
create policy "public_read_hero" on hero_slides for select using (is_active = true);
create policy "public_read_insurances" on insurances for select using (is_active = true);
create policy "public_read_partners" on partners for select using (is_active = true);
create policy "public_read_prices" on price_items for select using (is_active = true);

-- İletişim formu: herkes yazabilir
create policy "public_insert_contact" on contact_messages for insert with check (true);

-- Admin: tam yetki (authenticated kullanıcılar)
create policy "admin_all_doctors" on doctors for all using (auth.role() = 'authenticated');
create policy "admin_all_services" on services for all using (auth.role() = 'authenticated');
create policy "admin_all_blog" on blog_posts for all using (auth.role() = 'authenticated');
create policy "admin_all_branches" on branches for all using (auth.role() = 'authenticated');
create policy "admin_all_testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin_all_contact" on contact_messages for all using (auth.role() = 'authenticated');
create policy "admin_all_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "admin_all_hero" on hero_slides for all using (auth.role() = 'authenticated');
create policy "admin_all_insurances" on insurances for all using (auth.role() = 'authenticated');
create policy "admin_all_partners" on partners for all using (auth.role() = 'authenticated');
create policy "admin_all_prices" on price_items for all using (auth.role() = 'authenticated');
create policy "admin_all_admin_users" on admin_users for all using (auth.role() = 'authenticated');
