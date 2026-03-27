import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, CheckCircle2, Phone, Calendar, ArrowRight, Search,
  Sparkles, BadgeCheck, FileText, Clock, HeartHandshake,
  AlertCircle, ChevronDown, ChevronUp, Percent, Star,
} from "lucide-react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "https://randevu.positivedental.com";

/* ── SİGORTA FİRMALARI ───────────────────────────────────────────── */
const INSURANCES = [
  {
    id: 1,
    name: "Allianz Sigorta",
    logo: "🔵",
    color: "from-blue-600 to-blue-800",
    lightColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    type: "Özel Sağlık Sigortası",
    coverage: ["Genel Muayene", "Diş Taşı Temizliği", "Dolgu", "Röntgen", "Diş Çekimi"],
    limits: "Yıllık ₺15.000 limitli",
    note: "Poliçe detayına göre katkı payı uygulanabilir.",
    popular: true,
  },
  {
    id: 2,
    name: "AXA Sigorta",
    logo: "🔴",
    color: "from-red-600 to-red-800",
    lightColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
    type: "Sağlık & Dental Plan",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "Röntgen", "Zirkonyum Kron"],
    limits: "Yıllık ₺20.000 limitli",
    note: "Estetik uygulamalar ve implant kapsam dışındadır.",
    popular: true,
  },
  {
    id: 3,
    name: "Mapfre Sigorta",
    logo: "🟠",
    color: "from-orange-500 to-red-600",
    lightColor: "bg-orange-50 border-orange-200",
    textColor: "text-orange-700",
    type: "Tamamlayıcı Sağlık",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Diş Çekimi", "Protez"],
    limits: "Yıllık ₺10.000 limitli",
    note: "Ortodontik tedaviler ek poliçe ile mümkündür.",
    popular: false,
  },
  {
    id: 4,
    name: "Anadolu Sigorta",
    logo: "🟢",
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50 border-green-200",
    textColor: "text-green-700",
    type: "Özel Sağlık Sigortası",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Röntgen", "Diş Çekimi", "Kanal Tedavisi"],
    limits: "Yıllık ₺12.000 limitli",
    note: "SGK tamamlayıcı poliçeleri de kabul edilmektedir.",
    popular: false,
  },
  {
    id: 5,
    name: "Türkiye Sigorta",
    logo: "🔴",
    color: "from-red-700 to-rose-800",
    lightColor: "bg-rose-50 border-rose-200",
    textColor: "text-rose-700",
    type: "Bireysel & Kurumsal",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Çekim", "Protez", "Zirkonyum"],
    limits: "Yıllık ₺18.000 limitli",
    note: "Devlet destekli sigorta kapsamı geçerlidir.",
    popular: false,
  },
  {
    id: 6,
    name: "Güneş Sigorta",
    logo: "🌟",
    color: "from-yellow-500 to-amber-700",
    lightColor: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
    type: "Dental Tamamlayıcı",
    coverage: ["Genel Muayene", "Dolgu", "Diş Çekimi", "Röntgen"],
    limits: "Yıllık ₺8.000 limitli",
    note: "Temel dental poliçe; üst plan ek teminatlar içerir.",
    popular: false,
  },
  {
    id: 7,
    name: "Ray Sigorta",
    logo: "⚡",
    color: "from-violet-600 to-purple-800",
    lightColor: "bg-violet-50 border-violet-200",
    textColor: "text-violet-700",
    type: "Sağlık Sigortası",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Diş Çekimi", "Proflaksi"],
    limits: "Yıllık ₺10.000 limitli",
    note: "Poliçe tipine göre kapsam değişiklik gösterir.",
    popular: false,
  },
  {
    id: 8,
    name: "HDI Sigorta",
    logo: "🏛️",
    color: "from-slate-600 to-slate-800",
    lightColor: "bg-slate-50 border-slate-200",
    textColor: "text-slate-700",
    type: "Kurumsal Sağlık",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Röntgen", "Protez", "Kanal Tedavisi"],
    limits: "Yıllık ₺16.000 limitli",
    note: "Uluslararası poliçe sahipleri de yararlanabilir.",
    popular: false,
  },
  {
    id: 9,
    name: "Sompo Japan Sigorta",
    logo: "🇯🇵",
    color: "from-red-500 to-rose-700",
    lightColor: "bg-rose-50 border-rose-200",
    textColor: "text-rose-700",
    type: "Sağlık & Dental",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Diş Çekimi"],
    limits: "Yıllık ₺12.000 limitli",
    note: "Yabancı uyruklu poliçe sahipleri de başvurabilir.",
    popular: false,
  },
  {
    id: 10,
    name: "Unico Sigorta",
    logo: "🦄",
    color: "from-indigo-500 to-violet-700",
    lightColor: "bg-indigo-50 border-indigo-200",
    textColor: "text-indigo-700",
    type: "Bireysel Dental",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Röntgen", "Diş Çekimi"],
    limits: "Yıllık ₺9.000 limitli",
    note: "Dijital poliçe ile anında onay süreci.",
    popular: false,
  },
  {
    id: 11,
    name: "Generali Sigorta",
    logo: "🦁",
    color: "from-red-600 to-red-800",
    lightColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
    type: "Premium Sağlık",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "Protez", "Ortodonti"],
    limits: "Yıllık ₺25.000 limitli",
    note: "Premium poliçede ortodonti teminatı mevcuttur.",
    popular: true,
  },
  {
    id: 12,
    name: "Cigna Sağlık",
    logo: "💚",
    color: "from-green-500 to-teal-700",
    lightColor: "bg-teal-50 border-teal-200",
    textColor: "text-teal-700",
    type: "Uluslararası Sağlık",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "Zirkonyum", "İmplant (limitli)"],
    limits: "Yıllık ₺30.000 limitli",
    note: "Global poliçe kapsamında implant teminatı mevcuttur.",
    popular: true,
  },
];

/* ── KAPSAM TABLOSU ──────────────────────────────────────────────── */
const COVERAGE_TABLE = [
  { service: "İlk Muayene & Konsültasyon", covered: true, note: "Tüm poliçelerde geçerli" },
  { service: "Diş Taşı Temizliği (Proflaksi)", covered: true, note: "Yılda 1–2 seans" },
  { service: "Dolgu (Kompozit / Amalgam)", covered: true, note: "Renk uyumlu beyaz dolgu dahil" },
  { service: "Diş Çekimi", covered: true, note: "Yirmi yaş dahil" },
  { service: "Kök Kanal Tedavisi", covered: true, note: "Çoğu poliçede dahil" },
  { service: "Röntgen (Periapikal / Panoramik)", covered: true, note: "Tanı amaçlı çekimler" },
  { service: "Diş Protezi (Hareketli)", covered: true, note: "Limit dahilinde" },
  { service: "Zirkonyum / Porselen Kron", covered: "partial", note: "Premium poliçelerde mevcut" },
  { service: "Ortodonti (Tel / Şeffaf Plak)", covered: "partial", note: "Seçili poliçelerde mevcut" },
  { service: "Diş İmplantı", covered: "partial", note: "Sadece bazı premium poliçelerde" },
  { service: "Estetik Diş Beyazlatma", covered: false, note: "Sigorta kapsamı dışında" },
  { service: "Gülüş Tasarımı (DSD/Lamine)", covered: false, note: "Estetik amaçlı, kapsam dışı" },
];

/* ── SSS ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Sigorta poliçemle kliniğinizde nasıl yararlanabilirim?",
    a: "Randevu alırken sigorta şirketinizi ve poliçe numaranızı belirtin. Kliniğimize geldiğinizde kimliğiniz ve sigorta kartınızla işlem kolayca başlatılır. Ek bir ön onay gerekmez.",
  },
  {
    q: "Poliçem kapsamını bilmiyorum, siz kontrol edebilir misiniz?",
    a: "Evet. Sigorta şirketinizin adını ve poliçe numaranızı paylaşmanız yeterli; hasta koordinatörümüz tedavi öncesinde poliçenizin kapsamını sigorta şirketiyle doğrular.",
  },
  {
    q: "Sigorta katkı payı nasıl hesaplanıyor?",
    a: "Katkı payı sigorta şirketi ve poliçe tipine göre değişir. Genel olarak tedavi bedelinin %20–%30'u hasta tarafından karşılanır; kalan kısım sigorta şirketiyle direkt olarak faturalandırılır.",
  },
  {
    q: "Sigorta kapsamı dışında kalan işlemler için ne olur?",
    a: "Kapsamı aşan tedaviler (örn. estetik uygulamalar) için kliniğimizin standart fiyat listesi uygulanır. Dilediğiniz takdirde taksit seçeneğinden yararlanabilirsiniz.",
  },
  {
    q: "Tamamlayıcı sağlık sigortam da geçerli mi?",
    a: "Evet. SGK'nın ödediği tutar düşüldükten sonra kalan kısım için tamamlayıcı sağlık sigortanız devreye girer. Her iki kurumu da ayrı ayrı haber verin.",
  },
  {
    q: "Şirketim üzerinden sigorta yaptırdım, nasıl başvuracağım?",
    a: "Kurumsal poliçelerde insan kaynakları departmanınızdan sigorta kartı veya kapsam yazısı alarak kliniğimize gelebilirsiniz.",
  },
];

/* ── ADIMLAR ─────────────────────────────────────────────────────── */
const STEPS = [
  { n: "01", icon: "📋", title: "Poliçenizi Kontrol Edin",   desc: "Sigorta şirketinizin listede olup olmadığını kontrol edin." },
  { n: "02", icon: "📅", title: "Randevu Alın",               desc: "Sigorta bilginizi belirterek online ya da telefonla randevu alın." },
  { n: "03", icon: "🪪", title: "Kliniğe Gelin",              desc: "Kimlik ve sigorta kartınızı getirin; gerisini biz hallederiz." },
  { n: "04", icon: "✅", title: "Tedavinizi Alın",             desc: "Kapsam dahilindeki tedaviniz sigorta üzerinden tamamlanır." },
];

export function Insurance() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = INSURANCES.filter((ins) =>
    !search || ins.name.toLowerCase().includes(search.toLowerCase()) || ins.type.toLowerCase().includes(search.toLowerCase())
  );

  const popular = INSURANCES.filter((i) => i.popular);
  const displayList = showAll ? filtered : filtered.slice(0, 8);

  return (
    <>
      <SEO
        title="Anlaşmalı Sigortalar — Diş Tedavisi Sigorta Kapsamı"
        description="Positive Dental Studio'da geçerli sigorta poliçeleri: Allianz, AXA, Mapfre, Anadolu Sigorta ve daha fazlası. Poliçenizle ücretsiz muayene alın."
        url="/anlasmali-sigortalar"
        keywords={["diş sigortası", "anlaşmalı sigorta", "sağlık sigortası diş", "tamamlayıcı sigorta diş", "allianz diş", "axa diş"]}
        schemaType="dental"
      />

      <div className="bg-white overflow-hidden">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative bg-[#0D1235] overflow-hidden min-h-[64vh] flex items-center">
          <div className="absolute top-[-12%] left-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                  <Shield className="w-4 h-4 text-violet-300" />
                  <span className="text-white/60 text-sm font-medium">Sigorta Anlaşmaları</span>
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                  Sigortalıysanız
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    kolay tedavi.
                  </span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
                  Türkiye'nin önde gelen <strong className="text-white">{INSURANCES.length}+ sigorta şirketiyle</strong> anlaşmalıyız. Poliçenizle muayeneden kaplama tedavisine kadar geniş kapsamda faydalanın.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                    <Calendar className="w-5 h-5" /> Randevu Al
                  </a>
                  <a href="tel:+908501234567"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold transition-all">
                    <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
                  </a>
                </div>
              </motion.div>

              {/* Quick benefit pills */}
              <motion.div
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                className="space-y-3"
              >
                {[
                  { icon: "✅", text: "Direk faturalama — nakit ödemeksizin tedavi" },
                  { icon: "⚡", text: "Anında poliçe doğrulama sistemi" },
                  { icon: "📋", text: "Kapsam dışı işlemlerde önceden bilgilendirme" },
                  { icon: "🤝", text: "SGK + Tamamlayıcı kombinasyon desteği" },
                  { icon: "📞", text: "Sigorta işlemleri için dedicated koordinatör" },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                    className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-2xl px-5 py-4"
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <p className="text-white/70 text-sm font-medium">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* ══ POPÜLER SİGORTALAR ════════════════════════════════════ */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="font-display font-black text-slate-900 text-2xl">En Çok Tercih Edilen Sigortalar</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popular.map((ins, i) => (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative bg-gradient-to-br from-slate-900 to-[#0D1235] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ins.color} rounded-t-2xl`} />
                  <div className="text-3xl mb-3">{ins.logo}</div>
                  <h3 className="font-black text-white text-sm mb-1">{ins.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{ins.type}</p>
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full font-medium">
                    <Shield className="w-3 h-3" /> {ins.limits}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TÜM SİGORTALAR LİSTESİ ══════════════════════════════ */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Anlaşmalı Sigorta Şirketleri</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Poliçeniz burada mı?
              </h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Aşağıdaki listede sigorta şirketinizi bulun. Listede yoksa bizi arayın — genellikle anlaşma dışı poliçelerde de yardımcı olabiliriz.</p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mx-auto mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sigorta şirketi ara..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayList.map((ins, i) => (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${ins.color}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ins.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                        {ins.logo}
                      </div>
                      {ins.popular && (
                        <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400" /> Popüler
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-900 mb-0.5">{ins.name}</h3>
                    <p className="text-indigo-500 text-xs font-semibold mb-3">{ins.type}</p>

                    {/* Coverage list */}
                    <div className="space-y-1.5 mb-4">
                      {ins.coverage.slice(0, 4).map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                      {ins.coverage.length > 4 && (
                        <p className="text-xs text-indigo-500 font-semibold ml-5">+{ins.coverage.length - 4} daha fazla</p>
                      )}
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${ins.lightColor} border mb-3`}>
                      <Percent className="w-3 h-3 flex-shrink-0" />
                      <span className={ins.textColor}>{ins.limits}</span>
                    </div>

                    {ins.note && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-400">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <p>{ins.note}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length > 8 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all"
                >
                  {showAll ? (
                    <><ChevronUp className="w-4 h-4" /> Daha az göster</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Tümünü göster ({filtered.length})</>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══ KAPSAM TABLOSU ════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hangi İşlemler Kapsanıyor?</span>
              <h2 className="font-display text-4xl font-black text-slate-900">Genel kapsam rehberi.</h2>
              <p className="text-slate-500 mt-3 text-sm">Her poliçe farklıdır; kesin bilgi için kliniğimizi arayın.</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg"
            >
              <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-600 to-violet-700 px-6 py-4">
                <p className="font-bold text-white text-sm col-span-1">Tedavi / Hizmet</p>
                <p className="font-bold text-white text-sm text-center">Kapsam</p>
                <p className="font-bold text-white text-sm text-right">Not</p>
              </div>
              {COVERAGE_TABLE.map((row, i) => (
                <div key={row.service}
                  className={`grid grid-cols-3 items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <p className="text-slate-800 text-sm font-medium col-span-1">{row.service}</p>
                  <div className="flex justify-center">
                    {row.covered === true ? (
                      <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dahil
                      </span>
                    ) : row.covered === "partial" ? (
                      <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" /> Kısmi
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        ✕ Kapsam Dışı
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs text-right">{row.note}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ SÜREÇ ADIMLARI ════════════════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50 border-y border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Nasıl İşler?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Sigortayla tedavi,{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">bu kadar kolay.</span>
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
                  className="relative bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-indigo-200">
                    {step.icon}
                  </div>
                  <div className="absolute top-6 right-6 font-display font-black text-indigo-100 text-3xl leading-none">{step.n}</div>
                  <h3 className="font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SSS ═══════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">SSS</span>
              <h2 className="font-display text-4xl font-black text-slate-900">
                Sık sorulan{" "}
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">sorular.</span>
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-colors"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-indigo-50/40 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-slate-800 pr-4 text-sm">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
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
              Sigortanızla hemen
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">randevu alın.</span>
            </h2>
            <p className="text-slate-400 mb-8">Poliçeniz varsa ekstra ödeme yapmadan tedavinizi başlatın.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Randevu Al <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+908501234567"
                className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
              </a>
            </div>
            <p className="text-slate-600 text-xs mt-6">Poliçenizi bilmiyorum demeyin — kliniğimiz size yardımcı olur.</p>
          </motion.div>
        </section>
      </div>
    </>
  );
}
