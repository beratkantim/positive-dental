import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  Building2, Users, BadgeCheck, ArrowRight, Phone, Mail,
  Calendar, Search, ChevronRight, Sparkles, Star,
  FileText, Shield, Percent, HeartHandshake, Landmark,
  GraduationCap, Briefcase, Stethoscope, Globe2,
} from "lucide-react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "https://randevu.positivedental.com";

/* ── KATEGORİLER ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "tumu",    label: "Tümü",             icon: Globe2 },
  { id: "kamu",   label: "Kamu Kurumları",    icon: Landmark },
  { id: "ozel",   label: "Özel Sektör",       icon: Briefcase },
  { id: "saglik", label: "Sağlık Kuruluşları", icon: Stethoscope },
  { id: "egitim", label: "Eğitim",            icon: GraduationCap },
];

/* ── PARTNER VERİSİ ──────────────────────────────────────────────── */
const PARTNERS = [
  // KAMU
  { id: 1, name: "Türkiye İş Kurumu",        short: "İŞKUR",       category: "kamu",   color: "from-blue-500 to-blue-700",     discount: "%20", emoji: "🏛️", desc: "Kurum çalışanlarına özel indirimli tedavi paketi." },
  { id: 2, name: "Sosyal Güvenlik Kurumu",    short: "SGK",         category: "kamu",   color: "from-red-500 to-rose-700",      discount: "%15", emoji: "🏥", desc: "SGK anlaşmalı tedavi seçenekleri." },
  { id: 3, name: "Adana Büyükşehir Bel.",     short: "ABB",         category: "kamu",   color: "from-orange-500 to-amber-600",  discount: "%25", emoji: "🏙️", desc: "Adana Büyükşehir Belediyesi personeline özel avantajlar." },
  { id: 4, name: "Şişli Belediyesi",          short: "ŞİŞLİ BEL",  category: "kamu",   color: "from-sky-500 to-cyan-600",      discount: "%20", emoji: "🏢", desc: "İlçe çalışanları ve ailelerine indirimli paket." },
  { id: 5, name: "Milli Eğitim Bakanlığı",   short: "MEB",          category: "egitim", color: "from-green-600 to-emerald-700", discount: "%20", emoji: "📚", desc: "Öğretmen ve eğitim personeline özel avantaj." },

  // ÖZEL SEKTÖR
  { id: 6,  name: "Sabancı Holding",          short: "SABancı",     category: "ozel",   color: "from-indigo-600 to-violet-700", discount: "%30", emoji: "🏗️", desc: "Holding çalışanları ve aileleri için geniş paket." },
  { id: 7,  name: "Koç Holding",              short: "KOÇ",         category: "ozel",   color: "from-yellow-500 to-amber-600",  discount: "%25", emoji: "🚗", desc: "Koç Topluluğu çalışanlarına özel klinik erişimi." },
  { id: 8,  name: "Turkcell",                 short: "TURKCELL",    category: "ozel",   color: "from-blue-600 to-cyan-700",     discount: "%20", emoji: "📱", desc: "Çalışan refahı programı kapsamında diş sağlığı." },
  { id: 9,  name: "Teknosa",                  short: "TEKNOSA",     category: "ozel",   color: "from-rose-500 to-red-600",      discount: "%15", emoji: "💻", desc: "Tüm şube çalışanlarına ücretsiz ilk muayene." },
  { id: 10, name: "Migros Ticaret A.Ş.",      short: "MİGROS",      category: "ozel",   color: "from-red-600 to-orange-600",    discount: "%15", emoji: "🛒", desc: "Market çalışanları için kapsamlı diş sağlığı planı." },
  { id: 11, name: "Zorlu Holding",             short: "ZORLU",       category: "ozel",   color: "from-slate-600 to-gray-800",   discount: "%20", emoji: "🏢", desc: "Grup çalışanlarına aile dahil indirim." },
  { id: 12, name: "Pegasus Airlines",          short: "PEGASUS",     category: "ozel",   color: "from-orange-500 to-amber-600", discount: "%20", emoji: "✈️", desc: "Havacılık sektörü personeline özel tedavi paketi." },
  { id: 13, name: "Garanti BBVA",             short: "GARANTİ",     category: "ozel",   color: "from-green-600 to-teal-700",   discount: "%25", emoji: "🏦", desc: "Banka personeli için kapsamlı ağız sağlığı programı." },
  { id: 14, name: "İş Bankası",               short: "İŞBANK",      category: "ozel",   color: "from-blue-700 to-blue-900",    discount: "%20", emoji: "🏦", desc: "Banka ve iştirak çalışanları için indirimli paket." },

  // SAĞLIK
  { id: 15, name: "Medipol Hastanesi",         short: "MEDİPOL",    category: "saglik", color: "from-teal-500 to-emerald-700",  discount: "%30", emoji: "🏨", desc: "Sağlık çalışanı dayanışmasıyla özel koşullar." },
  { id: 16, name: "Acıbadem Sağlık Grubu",    short: "ACIBADEMı",   category: "saglik", color: "from-red-500 to-rose-600",      discount: "%25", emoji: "❤️", desc: "Hastane personeliyle karşılıklı anlaşma." },
  { id: 17, name: "Florence Nightingale",      short: "FLORENCE",   category: "saglik", color: "from-pink-500 to-rose-600",     discount: "%20", emoji: "🌸", desc: "Çalışan ve hasta refakatçilerine özel avantaj." },
  { id: 18, name: "Deva Holding",              short: "DEVA",        category: "saglik", color: "from-violet-600 to-purple-700", discount: "%20", emoji: "💊", desc: "İlaç sektörü çalışanlarına özel tedavi paketi." },

  // EĞİTİM
  { id: 19, name: "İstanbul Üniversitesi",    short: "İÜ",          category: "egitim", color: "from-indigo-600 to-blue-800",   discount: "%20", emoji: "🎓", desc: "Akademik ve idari personele indirimli diş tedavisi." },
  { id: 20, name: "Çukurova Üniversitesi",    short: "ÇÜ",          category: "egitim", color: "from-green-600 to-teal-700",   discount: "%20", emoji: "🌿", desc: "Üniversite personeli ve aileleri için özel paket." },
  { id: 21, name: "Özyeğin Üniversitesi",     short: "ÖZÜ",         category: "egitim", color: "from-amber-500 to-orange-600",  discount: "%25", emoji: "🏫", desc: "Öğretim üyesi ve personele kapsayıcı avantajlar." },
];

/* ── AVANTAJLAR ──────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: Percent,      title: "Kurumsal İndirim",    desc: "Çalışanlara %15–%30 arasında özel indirim" },
  { icon: Users,         title: "Aile Kapsamı",        desc: "Eş ve çocuklar da indirimden yararlanabilir" },
  { icon: FileText,     title: "Kolay Başvuru",       desc: "Sadece kurum kartı veya kimlik belgesi yeterli" },
  { icon: HeartHandshake, title: "Öncelikli Randevu", desc: "Anlaşmalı kurum çalışanlarına hızlı sıra" },
  { icon: Shield,       title: "Garanti Belgesi",     desc: "Tüm tedavilerde yazılı kalite güvencesi" },
  { icon: BadgeCheck,   title: "Uzman Hekim",         desc: "Alanında uzman sertifikalı diş hekimleri" },
];

/* ── SÜREÇ ───────────────────────────────────────────────────────── */
const STEPS = [
  { n: "01", title: "Kurumunuzu Bildirin",   desc: "Randevu alırken veya kliniğe gelirken çalıştığınız kurumu belirtin." },
  { n: "02", title: "Belgeleri Getirin",     desc: "Kurum kartınız veya maaş bordronuz yeterlidir. Ek evrak gerekmez." },
  { n: "03", title: "İndiriminizi Alın",     desc: "İlk muayeneden itibaren kurumsal indiriminiz anında uygulanır." },
  { n: "04", title: "Aile Kaydı Yapın",      desc: "Dilediğinizde eş ve çocuklarınızı da sisteme ekletebilirsiniz." },
];

export function Partners() {
  const [activeCategory, setActiveCategory] = useState("tumu");
  const [search, setSearch] = useState("");

  const filtered = PARTNERS.filter((p) => {
    const matchCat = activeCategory === "tumu" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
      <SEO
        title="Anlaşmalı Kurumlar — Kurumsal Diş Sağlığı Paketi"
        description="Positive Dental Studio anlaşmalı kurumları: kamu, özel sektör, sağlık ve eğitim kurumları çalışanlarına %15–%30 özel indirim. Aile kapsamı dahil."
        url="/partners"
        keywords={["anlaşmalı kurumlar", "kurumsal diş sağlığı", "diş klinik indirim", "çalışan avantaj", "kurumsal diş"]}
        schemaType="dental"
      />

      <div className="bg-white overflow-hidden">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative bg-[#0D1235] overflow-hidden min-h-[64vh] flex items-center">
          <div className="absolute top-[-12%] right-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                  <Building2 className="w-4 h-4 text-violet-300" />
                  <span className="text-white/60 text-sm font-medium">Kurumsal Diş Sağlığı Programı</span>
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                  Kurumunuzla
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    daha avantajlı.
                  </span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
                  Anlaşmalı kurumların çalışanları ve aileleri, Positive Dental Studio'da <strong className="text-white">%15–%30</strong> özel indirimden yararlanır.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                    <Calendar className="w-5 h-5" /> Randevu Al
                  </a>
                  <a href="tel:+908501234567"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold transition-all">
                    <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
                  </a>
                </div>
              </motion.div>

              {/* Stat cards */}
              <motion.div
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: `${PARTNERS.length}+`, label: "Anlaşmalı Kurum", emoji: "🏢" },
                  { value: "%30'a",     label: "Kadar İndirim",  emoji: "💰" },
                  { value: "Aile",     label: "Kapsamı Dahil",  emoji: "👨‍👩‍👧" },
                  { value: "2 Şube",   label: "İstanbul & Adana", emoji: "📍" },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-white/6 border border-white/10 rounded-2xl p-5 text-center"
                  >
                    <p className="text-3xl mb-1">{s.emoji}</p>
                    <p className="font-display font-black text-white text-2xl">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* ══ BENEFITS ══════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Neden Kurumsal Anlaşma?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Çalışanlarınıza değer{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">katın.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group flex items-start gap-4 p-6 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 mb-1">{b.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ PARTNER LİSTESİ ═══════════════════════════════════════ */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Anlaşmalı Kurumlarımız</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Güvenilir{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">ortaklarımız.</span>
              </h2>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kurum ara..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        activeCategory === cat.id
                          ? "bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-black text-slate-900 text-xl mb-2">Kurum bulunamadı</h3>
                  <p className="text-slate-500 text-sm">Farklı bir arama terimi deneyin.</p>
                  <button onClick={() => { setSearch(""); setActiveCategory("tumu"); }}
                    className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
                    Tümünü göster
                  </button>
                </div>
              ) : (
                <motion.div
                  key={activeCategory + search}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filtered.map((partner, i) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all overflow-hidden"
                    >
                      {/* Top gradient bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${partner.color}`} />

                      <div className="p-5">
                        {/* Icon + discount badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                            {partner.emoji}
                          </div>
                          <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-black px-2.5 py-1 rounded-full">
                            <Percent className="w-3 h-3" /> {partner.discount} İndirim
                          </span>
                        </div>

                        <h3 className="font-black text-slate-900 text-sm leading-snug mb-1">{partner.name}</h3>
                        <p className="text-indigo-500 text-xs font-bold mb-2">{partner.short}</p>
                        <p className="text-slate-500 text-xs leading-relaxed">{partner.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Count info */}
            <p className="text-center text-slate-400 text-sm mt-8">
              {filtered.length} kurum gösteriliyor · Listede olmayan kurumunuz için bizimle iletişime geçin
            </p>
          </div>
        </section>

        {/* ══ SÜREÇ ═════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Nasıl Yararlanırım?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                4 adımda{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">indiriminizi alın.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-transparent -translate-y-px z-0" />
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-200 font-display font-black text-white text-2xl">
                      {step.n}
                    </div>
                    <h3 className="font-black text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ YENİ ANLAŞMA CTA ══════════════════════════════════════ */}
        <section className="py-20 bg-gradient-to-r from-indigo-50 to-violet-50 border-y border-indigo-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/60 border border-indigo-100">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-5 shadow-xl">
                    <HeartHandshake className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-display font-black text-slate-900 text-3xl mb-3">
                    Kurumunuzla anlaşma<br />yapmak ister misiniz?
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    Şirketiniz veya kurumunuz listede yer almıyorsa, kurumsal anlaşma teklifimizi değerlendirmek için bizimle iletişime geçin. Çalışanlarınıza özel paketler oluşturuyoruz.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="mailto:kurum@positivedental.com"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black px-6 py-3.5 rounded-2xl hover:from-indigo-400 hover:to-violet-500 hover:scale-105 transition-all shadow-lg shadow-indigo-200">
                      <Mail className="w-4 h-4" /> Teklif Alın
                    </a>
                    <a href="tel:+908501234567"
                      className="inline-flex items-center gap-2 border-2 border-indigo-200 text-indigo-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all">
                      <Phone className="w-4 h-4" /> 0850 123 45 67
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "✅", text: "Minimum 5 çalışan ile anlaşma başlar" },
                    { icon: "📋", text: "Özel sözleşme ve fiyatlandırma" },
                    { icon: "🎯", text: "Çalışan sayısına göre ek avantajlar" },
                    { icon: "📊", text: "Yıllık kullanım raporu ve takip" },
                    { icon: "🤝", text: "Dedicated kurum koordinatörü" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-slate-700 text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#0D1235] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
          >
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-5" />
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
              Anlaşmalı kurumsanız
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">hemen randevu alın.</span>
            </h2>
            <p className="text-slate-400 mb-8">Kurumsal indiriminiz otomatik uygulanır. Ek belge gerekmez.</p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Randevu Al <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </section>
      </div>
    </>
  );
}
