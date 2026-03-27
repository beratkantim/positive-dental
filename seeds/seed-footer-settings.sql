-- Footer ayarları — Supabase SQL Editor'da çalıştır
INSERT INTO site_settings (key, value, label, type, group_name) VALUES
  ('footer_about', 'Gülüşünüz bizim için değerli. İstanbul Nişantaşı ve Adana Türkmenbaşı şubelerimizde modern teknoloji ve uzman kadroyla yanınızdayız.', 'Footer Açıklama', 'textarea', 'footer'),
  ('footer_slogan', 'Where positivity begins', 'Footer Slogan', 'text', 'footer'),
  ('footer_copyright', '© 2026 Positive Dental Studio. Tüm hakları saklıdır.', 'Copyright Metni', 'text', 'footer'),
  ('footer_phone', '0850 123 45 67', 'Telefon', 'text', 'footer'),
  ('footer_email', 'info@positivedental.com', 'Email', 'text', 'footer'),
  ('footer_hours', 'Pzt – Cmt: 09:00 – 20:00', 'Çalışma Saatleri', 'text', 'footer'),
  ('footer_hours_note', 'Cumartesi: 09:00 – 18:00', 'Çalışma Saatleri Notu', 'text', 'footer'),
  ('social_facebook', '#', 'Facebook URL', 'text', 'footer_social'),
  ('social_x', '#', 'X (Twitter) URL', 'text', 'footer_social'),
  ('social_youtube', '#', 'YouTube URL', 'text', 'footer_social'),
  ('social_instagram', '#', 'Instagram URL', 'text', 'footer_social'),
  ('social_linkedin', '#', 'LinkedIn URL', 'text', 'footer_social'),
  ('social_whatsapp', 'https://wa.me/905001234567', 'WhatsApp URL', 'text', 'footer_social'),
  ('footer_links', '[{"to":"/","label":"Ana Sayfa"},{"to":"/hizmetlerimiz","label":"Hizmetlerimiz"},{"to":"/fiyat-listesi","label":"Fiyat Listesi"},{"to":"/hakkimizda","label":"Hakkımızda"},{"to":"/kliniklerimiz","label":"Kliniklerimiz"},{"to":"/blog","label":"Blog"},{"to":"/iletisim","label":"İletişim"},{"to":"/anlasmali-kurumlar","label":"Anlaşmalı Kurumlar"},{"to":"/anlasmali-sigortalar","label":"Anlaşmalı Sigortalar"}]', 'Hızlı Erişim Linkleri', 'json', 'footer'),
  ('footer_services', '["Genel Diş Hekimliği","İmplant Tedavisi","Estetik Diş Hekimliği","Ortodonti","Çocuk Diş Hekimliği"]', 'Footer Hizmet Listesi', 'json', 'footer')
ON CONFLICT (key) DO NOTHING;
