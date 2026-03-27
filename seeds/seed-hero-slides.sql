-- Hero Slider seed data — Supabase SQL Editor'da çalıştır
INSERT INTO hero_slides (tag, tag_color, title, title_gradient, subtitle, badge, image, features, is_active, sort_order)
VALUES
  (
    'Ağrısız Diş Hekimliği',
    'text-violet-300',
    E'Dijital\nAnestezi',
    'from-indigo-400 via-violet-400 to-purple-400',
    'Iğne hissi olmadan, tamamen konforlu bir tedavi deneyimi. STA (Single Tooth Anesthesia) sistemiyle mikroişlemci kontrollü, kademeli ilaç verilimi.',
    'STA Sistemi',
    'https://images.unsplash.com/photo-1623867821208-c4d8025f8194?w=900&q=85',
    ARRAY['Mikro-kontrollü ilaç dozajı', 'Titreşim ile algı azaltma', 'Çocuklar ve kaygılı hastalar için ideal', 'İşlem süresi %40 daha kısa'],
    true,
    1
  ),
  (
    'Rahatlatıcı Terapi',
    'text-teal-300',
    E'Guided Film\nTherapy',
    'from-teal-300 via-cyan-300 to-indigo-300',
    'Tedavi süresince özel VR gözlük ve kişiselleştirilmiş içerik seçimiyle zihninizi kliniğin dışına taşıyoruz. Kaygı yüzde seksen azalıyor.',
    'VR Destekli',
    'https://images.unsplash.com/photo-1757652591587-b8d27db73e10?w=900&q=85',
    ARRAY['Kişiselleştirilmiş film & müzik seçimi', 'Kortizol düzeyi ölçümlü kaygı takibi', 'Çocuk, genç ve yetişkin protokolleri', 'İşlem süresini hissettirmez'],
    true,
    2
  ),
  (
    'Estetik Diş Hekimliği',
    'text-amber-300',
    E'Lamine\nTedavileri',
    'from-amber-300 via-orange-300 to-rose-300',
    'Ultra-ince porselen laminalar ile gülüşünüzü tamamen dönüştürüyoruz. Dijital tasarım, aynı gün simülasyon, minimum diş kesimi.',
    'DSD Teknolojisi',
    'https://images.unsplash.com/photo-1562330743-fbc6ef07ca78?w=900&q=85',
    ARRAY['0,3 mm ultra-ince porselen', 'Digital Smile Design simülasyonu', 'Minimum veya sıfır diş kesimi', '10+ yıl renk stabilitesi garantisi'],
    true,
    3
  );
