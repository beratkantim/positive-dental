-- Analitik tablosu — Supabase SQL Editor'da çalıştır

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  referrer TEXT DEFAULT '',
  device TEXT DEFAULT 'desktop' CHECK (device IN ('mobile', 'tablet', 'desktop')),
  browser TEXT DEFAULT '',
  country TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Herkes yazabilsin (anonim trafik kaydı)
CREATE POLICY "public_insert_views" ON page_views FOR INSERT WITH CHECK (true);

-- Sadece admin okuyabilsin
CREATE POLICY "admin_read_views" ON page_views FOR ALL USING (auth.role() = 'authenticated');

-- Performans için indeksler
CREATE INDEX idx_page_views_created ON page_views (created_at DESC);
CREATE INDEX idx_page_views_path ON page_views (path);
CREATE INDEX idx_page_views_date ON page_views (DATE(created_at));
