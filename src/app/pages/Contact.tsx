import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, MessageSquare,
  HeadphonesIcon, ChevronDown, ChevronUp, Calendar,
  ExternalLink, ArrowRight,
} from "lucide-react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "https://randevu.positivedental.com";

const FAQS = [
  { q: "Randevu almak için ne yapmalıyım?",    a: "Online randevu sistemimiz üzerinden hızlıca randevu oluşturabilir, telefonla arayabilir veya WhatsApp üzerinden mesaj gönderebilirsiniz." },
  { q: "İlk muayene ücretsiz mi?",              a: "Evet, ilk muayene ve danışma hizmetimiz tamamen ücretsizdir. Detaylı inceleme sonrası size özel tedavi planınızı ve fiyatlandırmayı paylaşırız." },
  { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz. Ayrıca taksit imkanlarımız da mevcuttur." },
  { q: "Randevumu iptal edebilir miyim?",       a: "Evet, randevunuzu en az 24 saat önceden haber vererek iptal edebilir veya erteleyebilirsiniz." },
  { q: "Acil durumda ne yapmalıyım?",           a: "Acil durumlar için 0850 123 45 67 hattımızı arayabilirsiniz. Aynı gün muayene imkanımız mevcuttur." },
];

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Telefon",
    sub: "Anında randevu ve bilgi için.",
    content: "0850 123 45 67",
    href: "tel:+908501234567",
    note: "Pzt – Cmt: 09:00 – 20:00",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Mail,
    title: "E-Posta",
    sub: "24 saat içinde yanıt veriyoruz.",
    content: "info@positivedental.com",
    href: "mailto:info@positivedental.com",
    note: "Hızlı yanıt garantisi",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    sub: "Her gün hizmetinizdeyiz.",
    content: "Pzt – Cmt: 09:00 – 20:00",
    href: "#",
    note: "Cumartesi: 09:00 – 18:00",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: MapPin,
    title: "Kliniklerimiz",
    sub: "Size en yakın şubeyi bulun.",
    content: "İstanbul & Adana",
    href: "/locations",
    note: "Nişantaşı · Türkmenbaşı",
    gradient: "from-amber-500 to-orange-500",
    isInternal: true,
  },
];

export function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="İletişim — Randevu Al, Bize Ulaşın"
        description="Positive Dental Studio ile iletişime geçin. Online randevu, WhatsApp, telefon veya e-posta ile hızlıca bize ulaşın. İstanbul Nişantaşı ve Adana Türkmenbaşı şubelerimiz."
        url="/contact"
        keywords={["diş kliniği iletişim", "randevu al", "diş hekimi randevu", "positive dental iletişim"]}
        schemaType="dental"
      />
      <div className="bg-white overflow-hidden">

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#0D1235] overflow-hidden min-h-[68vh] flex items-center">
          <div className="absolute top-[-12%] left-[-8%] w-[480px] h-[480px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-8%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.04]">
            {[280, 480, 680, 880].map((s) => (
              <div key={s} className="absolute rounded-full border border-white" style={{ width: s, height: s }} />
            ))}
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                  <Calendar className="w-4 h-4 text-violet-300" />
                  <span className="text-white/60 text-sm font-medium">İletişim & Randevu</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6"
              >
                Bizimle
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  iletişime geçin.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg max-w-xl mx-auto mb-10"
              >
                Online randevu sistemi, telefon veya WhatsApp ile kolayca bize ulaşın.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                  <Calendar className="w-5 h-5" /> Online Randevu Al
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
                <a href="https://wa.me/905001234567" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 text-white font-bold transition-all">
                  <MessageSquare className="w-5 h-5 text-green-400" /> WhatsApp
                </a>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* ══════════════════════════════════════════════════════════
            CONTACT CARDS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CONTACT_CARDS.map((card, i) => {
                const Icon = card.icon;
                const inner = (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="group h-full bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 rounded-3xl p-7 border border-slate-100 hover:border-transparent transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 mb-1">{card.title}</h3>
                    <p className="text-slate-400 text-xs mb-3">{card.sub}</p>
                    <p className="font-bold text-slate-800 text-sm mb-1">{card.content}</p>
                    <p className="text-slate-400 text-xs">{card.note}</p>
                  </motion.div>
                );
                return card.isInternal ? (
                  <Link key={i} to={card.href} className="block h-full">{inner}</Link>
                ) : (
                  <a key={i} href={card.href} className="block h-full">{inner}</a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">

              {/* Online Randevu Card — 2 cols */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 space-y-5"
              >
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Online Randevu</span>
                  <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 mb-2">Hızlı randevu al.</h2>
                  <p className="text-slate-500">Online randevu sistemimiz üzerinden istediğiniz klinik, doktor ve saati kolayca seçin.</p>
                </div>

                {/* Big booking card */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-3xl p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-indigo-200">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-900 text-xl mb-1">Online Randevu Sistemi</h3>
                      <p className="text-slate-500 text-sm mb-4">Klinik, hizmet ve doktor seçerek 2 dakikada randevunuzu oluşturun.</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {["✓ Klinik Seçimi", "✓ Doktor Seçimi", "✓ Anlık Onay", "✓ SMS Bildirimi"].map((t) => (
                          <span key={t} className="text-xs bg-white border border-indigo-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{t}</span>
                        ))}
                      </div>
                      <a
                        href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
                      >
                        <Calendar className="w-5 h-5" />
                        Online Randevu Al
                        <ExternalLink className="w-4 h-4 opacity-80" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <a href="https://wa.me/905001234567" target="_blank" rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-5 bg-white hover:bg-green-50 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-md transition-all">
                    <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm mb-0.5">WhatsApp</h3>
                      <p className="text-xs text-slate-400 mb-2">Hızlı yanıt garantisi</p>
                      <span className="inline-flex items-center gap-1 text-green-600 font-bold text-sm group-hover:gap-2 transition-all">
                        Mesaj Gönder <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                  <a href="tel:+908501234567"
                    className="group flex items-start gap-4 p-5 bg-white hover:bg-indigo-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                      <HeadphonesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm mb-0.5">Telefon Hattı</h3>
                      <p className="text-xs text-slate-400 mb-2">Pzt – Cmt 09:00–20:00</p>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm group-hover:gap-2 transition-all">
                        0850 123 45 67 <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Sidebar Info */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h2 className="font-display text-2xl font-black text-slate-900">İletişim Bilgileri</h2>

                {/* Phone card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 mb-1">Telefon</h3>
                      <p className="text-slate-400 text-sm mb-2">Anında randevu ve bilgi için.</p>
                      <a href="tel:+908501234567" className="font-black text-indigo-600 hover:text-indigo-700 text-lg">0850 123 45 67</a>
                      <p className="text-xs text-slate-400 mt-1">Pzt – Cmt: 09:00 – 20:00</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-violet-100 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 mb-1">E-Posta</h3>
                      <p className="text-slate-400 text-sm mb-2">24 saat içinde yanıt veriyoruz.</p>
                      <a href="mailto:info@positivedental.com" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold">
                        info@positivedental.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal-100 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 mb-1">Çalışma Saatleri</h3>
                      <p className="text-sm text-slate-600">Pzt – Cmt: 09:00 – 20:00</p>
                      <p className="text-sm text-slate-600">Cumartesi: 09:00 – 18:00</p>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-100 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 mb-2">Kliniklerimiz</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm text-slate-500 mb-3">
                        <span>• İstanbul – Nişantaşı</span>
                        <span>• Adana – Türkmenbaşı</span>
                      </div>
                      <Link to="/locations"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Tüm Klinikleri Gör <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Emergency */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="font-black text-rose-800">Acil Durumlar</h3>
                  </div>
                  <p className="text-sm text-rose-700 mb-3">Acil diş ağrısı veya kırıklarda hemen arayın.</p>
                  <a href="tel:+908501234567" className="font-black text-rose-700 hover:text-rose-800 text-lg">0850 123 45 67</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">SSS</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Merak{" "}
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">ettikleriniz.</span>
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-colors"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-indigo-50/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    }
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

        {/* ══════════════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════════════ */}
        <section className="py-28 bg-[#0D1235] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-5">Hazır mısın?</span>
            <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              Hayalindeki gülüş
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">seni bekliyor.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
              Online randevu al, beklemeden gel. İlk muayene değerlendirmesi ücretsiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Online Randevu Al <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+908501234567"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
              </a>
            </div>
            <p className="text-slate-600 text-sm mt-8">
              Pzt – Cmt: 09:00 – 20:00 &nbsp;·&nbsp; 2 şube &nbsp;·&nbsp; Ücretsiz ilk değerlendirme
            </p>
          </motion.div>
        </section>

      </div>
    </>
  );
}