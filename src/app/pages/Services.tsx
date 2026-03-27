import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Smile, Sparkles, Activity, Baby, Crown, Zap, CheckCircle2,
  Cpu, Scan, Brain, Layers, Calendar, Phone, ArrowRight, ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";
import { useTable } from "../hooks/useSupabase";
import type { Service as ServiceDB } from "@/lib/supabase";

const BOOKING_URL = "https://randevu.positivedental.com";

// Gradient → light bg/text mapping
const LIGHT_MAP: Record<string, { bg: string; text: string }> = {
  "from-teal-500": { bg: "bg-teal-50", text: "text-teal-600" },
  "from-indigo-500": { bg: "bg-indigo-50", text: "text-indigo-600" },
  "from-violet-500": { bg: "bg-violet-50", text: "text-violet-600" },
  "from-sky-500": { bg: "bg-sky-50", text: "text-sky-600" },
  "from-pink-500": { bg: "bg-pink-50", text: "text-pink-600" },
  "from-amber-500": { bg: "bg-amber-50", text: "text-amber-600" },
  "from-emerald-500": { bg: "bg-emerald-50", text: "text-emerald-600" },
};

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  gradient: string;
  lightBg: string;
  lightText: string;
  icon: string;
  image: string;
}

function mapService(s: ServiceDB): ServiceItem {
  const light = LIGHT_MAP[s.color_from] || { bg: "bg-indigo-50", text: "text-indigo-600" };
  return {
    title: s.title,
    description: s.description,
    features: s.features || [],
    gradient: `${s.color_from} ${s.color_to}`,
    lightBg: light.bg,
    lightText: light.text,
    icon: s.icon,
    image: s.image || "",
  };
}

const TECH = [
  { icon: Cpu,   title: "3D Dijital Tarama",  desc: "Mikron hassasiyetinde ölçü" },
  { icon: Brain, title: "AI Destekli Analiz",  desc: "Yüksek doğruluk oranı"     },
  { icon: Zap,   title: "Aynı Gün Tedavi",    desc: "CAD/CAM teknolojisi"        },
  { icon: Scan,  title: "Laser Sistemler",    desc: "Ağrısız tedavi deneyimi"    },
];

const STEPS = [
  { step: "01", title: "Muayene",  desc: "Kapsamlı ağız ve diş değerlendirmesi", icon: Scan   },
  { step: "02", title: "Teşhis",   desc: "Dijital görüntüleme ile tanı",          icon: Brain  },
  { step: "03", title: "Planlama", desc: "Kişisel tedavi planı oluşturma",        icon: Layers },
  { step: "04", title: "Tedavi",   desc: "Konforlu ve hızlı uygulama",           icon: Zap    },
];

export function Services() {
  const { data: rawServices, loading } = useTable<ServiceDB>("services", "sort_order");
  const SERVICES = rawServices.map(mapService);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1235]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Hizmetlerimiz — İmplant, Estetik, Ortodonti"
        description="Positive Dental Studio hizmetleri: implant tedavisi, estetik diş hekimliği, ortodonti, çocuk diş hekimliği, genel diş hekimliği ve protez. Modern teknoloji, uzman kadro."
        url="/hizmetlerimiz"
        keywords={["diş implantı", "estetik diş", "ortodonti", "çocuk dişçi", "diş protezi", "kanal tedavisi"]}
        schemaType="dental"
      />
    <div className="bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D1235] overflow-hidden min-h-[70vh] flex items-center">
        {/* Blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />

        {/* Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.04]">
          {[280, 480, 680, 880].map((s) => (
            <div key={s} className="absolute rounded-full border border-white" style={{ width: s, height: s }} />
          ))}
        </div>

        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span className="text-white/60 text-sm font-medium">Kapsamlı Tedavi Hizmetleri</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                Her ihtiyaca
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  bir çözüm.
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
                Genel diş hekimliğinden estetik uygulamalara, çocuk diş hekimliğinden implant tedavisine kadar tüm ihtiyaçlarınız için buradayız.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Online Randevu Al
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a href="tel:+908501234567"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/12 text-white font-bold transition-all">
                  <Phone className="w-5 h-5 text-slate-400" />
                  0850 123 45 67
                </a>
              </div>
            </motion.div>

            {/* Tech pills */}
            <motion.div
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="grid grid-cols-2 gap-3"
            >
              {TECH.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-white/5 border border-white/8 rounded-2xl p-5 hover:bg-white/10 hover:border-white/16 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-white text-sm">{t.title}</p>
                    <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hizmetlerimiz</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Neler{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">yapıyoruz?</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Ağız sağlığınızın her aşamasında uzman hekimlerimiz yanınızda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 transition-all"
                >
                  {s.image && (
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-7">
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform text-2xl`}
                    style={{ width: 52, height: 52 }}>
                    {s.icon}
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{s.description}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${s.lightText}`} />
                        <span className="text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${s.lightText} group-hover:gap-2 transition-all`}>
                    Randevu Al <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TREATMENT STEPS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Nasıl Çalışır?</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Tedavi{" "}
              <span className="italic text-violet-600">süreci.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-200 via-violet-300 to-purple-200 pointer-events-none" />

            {STEPS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform relative z-10">
                    <Icon className="w-9 h-9 text-white" />
                  </div>
                  <span className="inline-block text-xs font-black tracking-widest text-indigo-400 mb-2">{item.step}</span>
                  <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TECHNOLOGY
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Modern Teknoloji</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-5 leading-tight">
                İleri teknoloji,
                <br />
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">üstün konfor.</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Son teknoloji 3D görüntüleme, dijital planlama sistemleri ve modern tedavi ekipmanları ile en hassas ve konforlu tedavi deneyimini sunuyoruz.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Brain, title: "AI Destekli Teşhis", desc: "Yüksek doğruluk" },
                  { icon: Scan,  title: "3D Görüntüleme",    desc: "Mikron hassasiyet" },
                  { icon: Zap,   title: "Laser Tedavi",      desc: "Ağrısız iyileşme"  },
                  { icon: Cpu,   title: "CAD/CAM",           desc: "Aynı gün protez"   },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl border border-indigo-100 transition-all group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1770321119305-f191c09c5801?w=800&q=75&auto=format"
                  alt="Diş tedavi ekipmanları"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl">
                    <p className="font-black text-slate-900">Dijital Klinik</p>
                    <p className="text-slate-500 text-xs">Tam donanımlı teknoloji altyapısı</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
            Randevu almak
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">çok kolay.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Hangi hizmete ihtiyaç duyduğunuzu bilmiyorsanız da gelmeniz yeterli. Uzman hekimlerimiz size en uygun tedaviyi belirleyecek.
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
        </motion.div>
      </section>

    </div>
    </>
  );
}