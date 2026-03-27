DELETE FROM price_items;

-- Muayene Fiyatları
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Muayene Fiyatları', 'Genel Ağız Muayenesi', 0, 0, 'İlk değerlendirme', true, 1),
('Muayene Fiyatları', 'Konsültasyon (Uzman Hekim)', 500, 500, '', true, 2),
('Muayene Fiyatları', 'Panoramik Röntgen', 400, 400, '', true, 3),
('Muayene Fiyatları', 'Periapikal Röntgen (adet)', 150, 150, '', true, 4),
('Muayene Fiyatları', '3D / CBCT Çekim', 1500, 1500, 'Dijital tarama', true, 5),
('Muayene Fiyatları', 'Dijital Gülüş Tasarımı Analizi', 800, 800, 'DSD Planlama', true, 6);

-- Koruyucu Diş Hekimliği
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Koruyucu Diş Hekimliği', 'Diş Taşı Temizliği (Proflaksi)', 1200, 1200, 'Üst + alt çene', true, 1),
('Koruyucu Diş Hekimliği', 'Diş Eti Cilası (Polishing)', 600, 600, '', true, 2),
('Koruyucu Diş Hekimliği', 'Flor Uygulaması', 500, 500, 'Çürük önleyici', true, 3),
('Koruyucu Diş Hekimliği', 'Fissür Örtücü (diş başına)', 400, 400, '', true, 4),
('Koruyucu Diş Hekimliği', 'Ağız Bakım Eğitimi', 300, 300, '', true, 5);

-- Çocuk Diş Tedavileri
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Çocuk Diş Tedavileri', 'Çocuk Muayenesi (0–12 yaş)', 0, 0, 'İlk ziyaret', true, 1),
('Çocuk Diş Tedavileri', 'Süt Dişi Dolgusu', 600, 900, 'Renk ve yüzeye göre', true, 2),
('Çocuk Diş Tedavileri', 'Süt Dişi Çekimi', 500, 500, '', true, 3),
('Çocuk Diş Tedavileri', 'Çocuk Kanal Tedavisi', 1500, 1500, '', true, 4),
('Çocuk Diş Tedavileri', 'Paslanmaz Çelik Kron', 1200, 1200, 'Süt dişi', true, 5),
('Çocuk Diş Tedavileri', 'Çocuk Flor Uygulaması', 400, 400, '', true, 6),
('Çocuk Diş Tedavileri', 'Fissür Örtücü (diş başına)', 350, 350, '', true, 7),
('Çocuk Diş Tedavileri', 'Orthodontik Değerlendirme', 0, 0, '', true, 8),
('Çocuk Diş Tedavileri', 'Guided Film Therapy (seans)', 800, 800, 'Ağız alışkanlıkları', true, 9);

-- Dolgu ve Kanal Tedavileri
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Dolgu ve Kanal Tedavileri', 'Kompozit Dolgu – 1 Yüzey', 900, 900, '', true, 1),
('Dolgu ve Kanal Tedavileri', 'Kompozit Dolgu – 2 Yüzey', 1200, 1200, '', true, 2),
('Dolgu ve Kanal Tedavileri', 'Kompozit Dolgu – 3 Yüzey', 1600, 1600, '', true, 3),
('Dolgu ve Kanal Tedavileri', 'Kanal Tedavisi – Ön Diş', 2500, 2500, '', true, 4),
('Dolgu ve Kanal Tedavileri', 'Kanal Tedavisi – Küçük Azı', 3500, 3500, '', true, 5),
('Dolgu ve Kanal Tedavileri', 'Kanal Tedavisi – Büyük Azı', 5000, 5000, '', true, 6),
('Dolgu ve Kanal Tedavileri', 'Kanal Tedavisi Revizyonu', 4000, 7000, 'Zorluğa göre', true, 7),
('Dolgu ve Kanal Tedavileri', 'Post-Kor Uygulama', 1500, 1500, '', true, 8);

-- Diş Estetiği Tedavileri
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Diş Estetiği Tedavileri', 'Porselen Lamine (diş başına)', 8000, 12000, 'Materyal kalitesine göre', true, 1),
('Diş Estetiği Tedavileri', 'Zirkonyum Kron (diş başına)', 7000, 10000, '', true, 2),
('Diş Estetiği Tedavileri', 'E-max Kron (diş başına)', 9000, 13000, 'Tam seramik', true, 3),
('Diş Estetiği Tedavileri', 'Dijital Gülüş Tasarımı (DSD)', 15000, 15000, 'Full set fiyat teklifi verilir', true, 4),
('Diş Estetiği Tedavileri', 'Pembe Estetik / Diş Eti Estetiği', 3000, 6000, 'Lazer dahil', true, 5),
('Diş Estetiği Tedavileri', 'Gingivektomi (diş eti şekillendirme)', 2500, 2500, '', true, 6),
('Diş Estetiği Tedavileri', 'Bonding / Diastema Kapatma', 2500, 4000, 'Diş başına', true, 7);

-- Diş Beyazlatma
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Diş Beyazlatma', 'Klinik Beyazlatma (Office Bleaching)', 3500, 3500, 'Tek seans, ~1 saat', true, 1),
('Diş Beyazlatma', 'Ev Tipi Beyazlatma (Home Bleaching)', 2500, 2500, 'Plak + jel seti dahil', true, 2),
('Diş Beyazlatma', 'Kombine Beyazlatma', 5500, 5500, 'Klinik + ev seti', true, 3),
('Diş Beyazlatma', 'Karbamid Peroksit Jel (set)', 800, 800, 'Yenileme paketi', true, 4);

-- Diş Çekimi Fiyatları
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Diş Çekimi Fiyatları', 'Basit Diş Çekimi', 1000, 1000, '', true, 1),
('Diş Çekimi Fiyatları', 'Cerrahi Diş Çekimi', 2000, 3500, 'Güçlüğe göre', true, 2),
('Diş Çekimi Fiyatları', 'Gömük 20 Yaş Dişi Çekimi', 3500, 6000, 'CT + duruma göre', true, 3),
('Diş Çekimi Fiyatları', 'Yarı Gömük 20 Yaş Çekimi', 2500, 4000, '', true, 4),
('Diş Çekimi Fiyatları', 'Sedasyon ile Çekim (ek ücret)', 3000, 3000, 'Anestezi dahil', true, 5);

-- İmplant Tedavisi
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('İmplant Tedavisi', 'Straumann İmplant (adet)', 25000, 25000, 'İsviçre menşei, 15 yıl garanti', true, 1),
('İmplant Tedavisi', 'Nobel Biocare İmplant (adet)', 22000, 22000, '', true, 2),
('İmplant Tedavisi', 'MIS İmplant (adet)', 15000, 15000, '', true, 3),
('İmplant Tedavisi', 'Osstem İmplant (adet)', 12000, 12000, '', true, 4),
('İmplant Tedavisi', 'İmplant Üstü Zirkonyum Kron', 8000, 8000, 'İmplant fiyatına ayrıca', true, 5),
('İmplant Tedavisi', 'Kemik Tozu / Membran (ek)', 5000, 10000, 'Gerektiğinde', true, 6),
('İmplant Tedavisi', 'Sinüs Lifting (tek taraf)', 12000, 12000, '', true, 7),
('İmplant Tedavisi', 'All-on-4 (tam çene)', 120000, 120000, 'Teklif alınız', true, 8),
('İmplant Tedavisi', 'All-on-6 (tam çene)', 150000, 150000, 'Teklif alınız', true, 9);

-- Ortodontik Tedaviler
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Ortodontik Tedaviler', 'Metal Braket Ortodonti', 25000, 35000, 'Üst + alt çene', true, 1),
('Ortodontik Tedaviler', 'Seramik Braket Ortodonti', 35000, 50000, '', true, 2),
('Ortodontik Tedaviler', 'Telsiz Ortodonti – Orthero', 40000, 55000, 'Yerli şeffaf plak', true, 3),
('Ortodontik Tedaviler', 'Telsiz Ortodonti – Invisalign', 60000, 90000, 'Orijinal Invisalign', true, 4),
('Ortodontik Tedaviler', 'Tek Çene Ortodonti', 15000, 25000, '', true, 5),
('Ortodontik Tedaviler', 'Ortodontik Tutucu (Retainer)', 2500, 2500, 'Sabit veya hareketli', true, 6),
('Ortodontik Tedaviler', 'Hareketli Plak (çocuk)', 4000, 6000, '', true, 7);

-- Protez Tedavileri
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Protez Tedavileri', 'Tam Hareketli Protez (tek çene)', 8000, 12000, 'Materyale göre', true, 1),
('Protez Tedavileri', 'Kısmi Hareketli Protez', 6000, 9000, '', true, 2),
('Protez Tedavileri', 'İskeletli Protez', 10000, 14000, '', true, 3),
('Protez Tedavileri', 'Geçici (Akrilik) Kron (adet)', 1500, 1500, '', true, 4),
('Protez Tedavileri', 'Metal Destekli Porselen Kron (adet)', 5000, 5000, '', true, 5),
('Protez Tedavileri', 'Zirkonyum Kron (adet)', 7000, 10000, '', true, 6),
('Protez Tedavileri', 'Köprü (3 üyeli)', 18000, 28000, 'Materyale göre', true, 7);

-- Ağız ve Çene Cerrahisi
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Ağız ve Çene Cerrahisi', 'Kist Operasyonu', 6000, 12000, 'Büyüklüğe göre', true, 1),
('Ağız ve Çene Cerrahisi', 'Apikal Rezeksiyon', 5000, 8000, '', true, 2),
('Ağız ve Çene Cerrahisi', 'Frenulum Düzeltme (Frenektomi)', 3000, 3000, 'Lazer seçeneği mevcut', true, 3),
('Ağız ve Çene Cerrahisi', 'Çene Eklemi Tedavisi (TME Splint)', 8000, 15000, '', true, 4),
('Ağız ve Çene Cerrahisi', 'Uyku Apnesi Aparatı', 10000, 10000, '', true, 5),
('Ağız ve Çene Cerrahisi', 'Diş Eti Grefti', 7000, 12000, 'Bölgeye göre', true, 6);

-- Dijital Diş Hekimliği
INSERT INTO price_items (category, name, price_min, price_max, price_note, is_active, sort_order) VALUES
('Dijital Diş Hekimliği', 'İntraoral Dijital Tarama', 1000, 1000, 'CEREC / iTero', true, 1),
('Dijital Diş Hekimliği', 'Dijital Anestezi (Wand)', 500, 500, 'Ağrısız enjeksiyon', true, 2),
('Dijital Diş Hekimliği', 'Lazer Diş Eti Tedavisi (seans)', 2500, 5000, '', true, 3),
('Dijital Diş Hekimliği', 'CEREC Tek Seans Kron', 10000, 10000, 'Aynı gün teslim', true, 4);
