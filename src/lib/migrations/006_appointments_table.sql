-- ============================================================
-- 006: Appointments (Online Randevu Kayıtları)
-- Website'den alınan randevuları hem Dentsoft'a hem Supabase'e kaydeder
-- ============================================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dentsoft referansları
  dentsoft_id TEXT,                    -- Dentsoft randevu ID'si
  dentsoft_pnr TEXT,                   -- Dentsoft PNR numarası

  -- Klinik & Doktor
  branch_id UUID,                     -- Supabase branch ID
  branch_name TEXT DEFAULT '',        -- Klinik adı (snapshot)
  doctor_name TEXT DEFAULT '',        -- Doktor adı (snapshot)
  doctor_dentsoft_id TEXT,            -- Doktorun Dentsoft ID'si

  -- Tedavi
  treatment_category TEXT DEFAULT '', -- Seçilen tedavi kategorisi

  -- Tarih & Saat
  appointment_date DATE NOT NULL,     -- Randevu tarihi
  appointment_time TEXT NOT NULL,     -- Randevu saati (HH:MM)

  -- Hasta bilgileri
  patient_first_name TEXT NOT NULL,
  patient_last_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_tckn TEXT,                  -- TC Kimlik No
  patient_email TEXT,

  -- Durum
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'walkin', 'dentsoft')),
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_dentsoft ON appointments(dentsoft_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Public read (admin panelden okunacak)
DROP POLICY IF EXISTS "appointments_public_read" ON appointments;
CREATE POLICY "appointments_public_read" ON appointments FOR SELECT USING (true);

-- Public insert (website'den randevu oluşturulacak)
DROP POLICY IF EXISTS "appointments_public_insert" ON appointments;
CREATE POLICY "appointments_public_insert" ON appointments FOR INSERT WITH CHECK (true);

-- Public update (status güncellemesi için)
DROP POLICY IF EXISTS "appointments_public_update" ON appointments;
CREATE POLICY "appointments_public_update" ON appointments FOR UPDATE USING (true);
