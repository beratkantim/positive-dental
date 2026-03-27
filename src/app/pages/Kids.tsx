import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Star, Calendar, ExternalLink, Heart, Shield, Smile, Sparkles,
  ArrowRight, CheckCircle2, Baby,
} from "lucide-react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "https://randevu.positivedental.com";

const FEATURES = [
  {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    title: "Korkusuz Ortam",
    desc: "Çocuklara özel dekore edilmiş odalarımız, oyun alanlarımız ve sevecen yaklaşımımızla dişçi korkusunu birlikte yeniyoruz.",
  },
  {
    icon: Shield,
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    title: "Güvenli Tedavi",
    desc: "Çocuk dişhekimliğine özel sertifikalı hekimlerimiz, en güncel ve ağrısız tedavi protokollerini uygular.",
  },
  {
    icon: Smile,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    title: "Eğlenceli Deneyim",
    desc: "Her kontrolü bir maceraya dönüştürüyoruz — diş fırçalama yarışmaları, ödül rozetleri ve renkli uygulamalarla.",
  },
  {
    icon: Sparkles,
    color: "from-teal-400 to-cyan-500",
    bg: "bg-teal-50",
    title: "Erken Koruma",
    desc: "Fissür örtücü, florür uygulaması ve beslenme rehberliğiyle dişlerin çürümeden önce korunmasını sağlıyoruz.",
  },
];

const SERVICES = [
  { emoji: "🦷", title: "Süt Dişi Tedavisi", desc: "Süt dişleri gelecekteki kalıcı dişlerin yol haritasıdır. Doğru koruma kritik." },
  { emoji: "🛡️", title: "Fissür Örtücü", desc: "Azı dişlerindeki çukurcukları kapatarak çürüme riskini %70 azaltır." },
  { emoji: "✨", title: "Florür Uygulaması", desc: "Diş minesiini güçlendiren 3 dakikalık uygulama, yıllarca koruma sağlar." },
  { emoji: "📐", title: "Çocuk Ortodontisi", desc: "Erken müdahale ile kalıcı dişlerin düzgün çıkmasını destekliyoruz." },
  { emoji: "🎯", title: "Diş Travması", desc: "Kırık veya düşen süt dişlerinde hızlı ve etkili acil tedavi." },
  { emoji: "😴", title: "Sedasyon Seçeneği", desc: "Kaygılı çocuklar için uzman anestezi ekibiyle güvenli sedasyon tedavisi." },
];

const AGES = [
  { age: "0–3 Yaş", icon: "👶", title: "İlk Ziyaret", desc: "İlk diş çıkar çıkmaz kontrol önerilir. Tanışma ve alışma odaklı.", color: "border-pink-200 bg-pink-50" },
  { age: "3–6 Yaş", icon: "🌟", title: "Süt Dişi Dönemi", desc: "Çürük kontrolü, fırçalama alışkanlığı kazanımı ve fissür örtücü.", color: "border-amber-200 bg-amber-50" },
  { age: "6–12 Yaş", icon: "🚀", title: "Karma Diş Dönemi", desc: "Süt–kalıcı diş geçiş dönemi takibi, erken ortodontik değerlendirme.", color: "border-violet-200 bg-violet-50" },
  { age: "12–18 Yaş", icon: "🎓", title: "Genç Yetişkin", desc: "Ortodonti, estetik koruyucu uygulamalar ve bilgelik dişi kontrolü.", color: "border-teal-200 bg-teal-50" },
];

const TESTIMONIALS = [
  { name: "Zeynep A.", role: "3 yaşında annesi", text: "Doktorumuz o kadar sabırlı ve şefkatliydi ki kızım 'bir daha ne zaman gidiyoruz?' diye sordu. İnanılmaz!", rating: 5 },
  { name: "Burak K.", role: "6 yaşında babası", text: "Fissür örtücü uygulaması saniyeler içinde bitti. Oğlum hiç fark etmedi bile, çok mutlu ayrıldı.", rating: 5 },
  { name: "Ceren T.", role: "8 yaşında annesi", text: "Yıllarca başka kliniklerde çok zorlandık. Positive Dental Kids'te her şey farklıydı — sıcak, eğlenceli ve profesyonel.", rating: 5 },
];

// Floating bubble background element
function Bubble({ size, color, x, y, delay }: { size: number; color: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-60`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function Kids() {
  return (
    <>
      <SEO
        title="Kids — Çocuk Diş Hekimliği, 0–18 Yaş"
        description="Positive Dental Kids: çocuklara özel eğlenceli ve korkusuz diş hekimliği deneyimi. Fissür örtücü, florür, süt dişi takibi ve çocuk ortodontisi."
        url="/cocuk-dis-hekimligi"
        keywords={["çocuk diş hekimi", "çocuk dişçi", "fissür örtücü", "bebek diş", "çocuk ortodonti"]}
        schemaType="dental"
      />
    <div className="bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-[#0D1235] via-indigo-950 to-violet-950 overflow-hidden min-h-[88vh] flex items-center">

        {/* Floating bubbles */}
        <Bubble size={80} color="bg-pink-400" x="5%" y="15%" delay={0} />
        <Bubble size={50} color="bg-amber-300" x="12%" y="65%" delay={1.2} />
        <Bubble size={110} color="bg-violet-500" x="85%" y="10%" delay={0.6} />
        <Bubble size={60} color="bg-teal-400" x="90%" y="70%" delay={1.8} />
        <Bubble size={35} color="bg-rose-400" x="70%" y="30%" delay={2.4} />
        <Bubble size={45} color="bg-indigo-400" x="30%" y="80%" delay={0.9} />

        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8">
                <Baby className="w-4 h-4 text-pink-300" />
                <span className="text-white/70 text-sm font-medium">Çocuk Diş Hekimliği</span>
                <span className="text-white/30">·</span>
                <span className="text-pink-300 text-sm font-bold">0–18 Yaş</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
                Küçük dişler,
                <br />
                <span className="bg-gradient-to-r from-pink-300 via-amber-300 to-violet-300 bg-clip-text text-transparent">
                  büyük gülüşler
                </span>
                <span className="text-4xl ml-2">🌟</span>
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-10">
                Çocuğunuzun dişleri güvende, sen de rahat. Özel eğitimli hekimlerimiz ve eğlenceli ortamımızla dişçi korkusunu tamamen bitiriyoruz.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-pink-900/40 hover:scale-105 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Çocuk Randevusu Al
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <Link to="/iletisim"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/8 border border-white/12 hover:bg-white/14 text-white font-bold transition-all">
                  Bize Ulaş
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex items-center gap-6 mt-10">
                {[
                  { val: "5.000+", lbl: "Mutlu Çocuk" },
                  { val: "0 ağrı", lbl: "Garantisi" },
                  { val: "4.9★", lbl: "Ebeveyn Puanı" },
                ].map((s) => (
                  <div key={s.lbl} className="text-center">
                    <p className="font-display text-xl font-black text-white">{s.val}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – image collage */}
            <motion.div
              initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="relative"
            >
              <div className="relative h-[440px] lg:h-[520px]">
                {/* Main image */}
                <div className="absolute left-0 top-0 w-[65%] h-[68%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1611146033545-5e1e5ad951d8?w=600&q=75&auto=format"
                    alt="Mutlu çocuk dişçide"
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                  />
                </div>

                {/* Second image */}
                <div className="absolute right-0 top-8 w-[42%] h-[50%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1622408064430-9728776f96e6?w=400&q=75&auto=format"
                    alt="Diş fırçalayan çocuk"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>

                {/* Third image */}
                <div className="absolute left-8 bottom-0 w-[48%] h-[40%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1619236233405-bb5d430f0620?w=400&q=75&auto=format"
                    alt="Çocuk muayenesi"
                    className="w-full h-full object-cover"
                    width={400}
                    height={240}
                  />
                </div>

                {/* Floating card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-2 bottom-6 bg-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-3"
                >
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="font-black text-slate-800 text-sm">En İyi Çocuk Kliniği</p>
                    <p className="text-slate-400 text-xs">İstanbul 2024</p>
                  </div>
                </motion.div>

                {/* Rating bubble */}
                <motion.div
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl shadow-xl px-4 py-3 text-white"
                >
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-white text-white" />)}
                  </div>
                  <p className="font-black text-sm">4.9 / 5</p>
                  <p className="text-pink-200 text-xs">Ebeveyn yorumları</p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          NEDEN BİZ (FEATURES)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Farkımız</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Çocuğunuz burada{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">güvende.</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Her ziyaret bir maceraya dönüşsün diye çalışıyoruz. Çünkü iyi alışkanlıklar küçük yaşta başlar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`${f.bg} rounded-3xl p-7 border border-white hover:shadow-xl transition-all group`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          YAŞ GRUPLARI
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Yaşa Göre Bakım</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Her yaşın bir{" "}
              <span className="italic text-violet-600">planı var.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGES.map((a, i) => (
              <motion.div
                key={a.age}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${a.color} border-2 rounded-3xl p-6 hover:shadow-lg transition-all`}
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{a.age}</span>
                <h3 className="font-bold text-slate-800 text-base mb-2">{a.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HİZMETLER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-4">Hizmetlerimiz</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Küçük dişlere
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">büyük özen.</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Süt dişinden kalıcı dişe geçişe kadar her aşamada yanındayız. Çocuğunuzun ağız sağlığı hayatı boyu taşıyacağı en değerli hediyedir.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" /> Ücretsiz İlk Muayene
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-slate-50 hover:bg-white hover:shadow-md rounded-2xl p-5 border border-transparent hover:border-pink-100 transition-all cursor-pointer"
                >
                  <div className="text-2xl mb-3 group-hover:scale-110 transition-transform inline-block">{s.emoji}</div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-pink-600 transition-colors">{s.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMOIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Ebeveyn Yorumları</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">Anne & babalar anlatıyor.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 shadow-sm border border-white hover:shadow-xl hover:border-pink-100 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Doğrulandı</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CHECKLIST (İpuçları)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0D1235] to-indigo-950 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">Ebeveyn Rehberi</span>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  Çocuğunuzu<br />nasıl hazırlarsınız?
                </h2>
                <ul className="space-y-4">
                  {[
                    "İlk ziyareti olumlu bir macera olarak tanıtın",
                    "Rol yaparak \"dişçi oyunu\" oynayın",
                    "Hekiminizin sorularına izin verin, araya girmeyin",
                    "Başarılı ziyaret sonrası ödüllendirin (tatlı değil!)",
                    "Düzenli kontrolleri alışkanlık haline getirin",
                  ].map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-slate-300 text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-pink-900/30"
                >
                  <Calendar className="w-5 h-5" />
                  İlk Randevuyu Al
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="relative hidden lg:block">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1619236233405-bb5d430f0620?w=600&q=75&auto=format"
                  alt="Çocuk muayenesi"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D1235] via-transparent to-transparent" />
                <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 max-w-xs"
                  >
                    <p className="text-3xl mb-2">🎁</p>
                    <p className="font-bold text-white text-sm">İlk Ziyaret Hediyesi</p>
                    <p className="text-slate-400 text-xs mt-1">Her yeni çocuk hastamıza özel diş bakım seti hediye.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}