import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Award, Users, Heart, Target, Eye, CheckCircle2,
  Sparkles, Brain, Star, Calendar, Phone, ArrowRight, Play,
} from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "https://randevu.positivedental.com";

const STATS = [
  { number: "15.000+", label: "Mutlu Hasta",  desc: "Güvenen hasta sayısı" },
  { number: "25+",     label: "Uzman Hekim",  desc: "Sertifikalı hekimler"  },
  { number: "2",       label: "Klinik",       desc: "İstanbul & Adana"      },
  { number: "15 Yıl",  label: "Deneyim",      desc: "Sektör tecrübesi"     },
];

const VALUES = [
  { icon: Heart,  title: "Hasta Odaklılık",  description: "Her hastamızın ihtiyaçlarını dinliyor, ona özel tedavi planları hazırlıyoruz.", gradient: "from-rose-500 to-pink-500" },
  { icon: Award,  title: "Kalite & Mükemmellik", description: "En yüksek kalite standartlarında hizmet sunmak için sürekli gelişiyoruz.", gradient: "from-amber-500 to-orange-500" },
  { icon: Users,  title: "Uzman Kadro",      description: "Alanında deneyimli hekimlerimiz düzenli eğitimlerle kendilerini geliştiriyor.", gradient: "from-indigo-500 to-violet-600" },
  { icon: Brain,  title: "İleri Teknoloji",  description: "3D görüntüleme ve dijital sistemlerle tedavi süreçlerini optimize ediyoruz.", gradient: "from-teal-500 to-cyan-600" },
];

const TEAM = [
  {
    name: "Dr. Ayşe Yılmaz",
    title: "Başhekim · Estetik Diş Hekimi",
    specialty: "Digital Smile Design",
    image: "https://images.unsplash.com/photo-1565090567208-c8038cfcf6cd?w=600&q=75&auto=format",
  },
  {
    name: "Dr. Mehmet Kaya",
    title: "İmplant & Cerrahi Uzmanı",
    specialty: "Robotik İmplant Cerrahi",
    image: "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?w=600&q=75&auto=format",
  },
  {
    name: "Dr. Zeynep Demir",
    title: "Ortodonti Uzmanı",
    specialty: "Dijital Ortodonti",
    image: "https://images.unsplash.com/photo-1675526607070-f5cbd71dde92?w=600&q=75&auto=format",
  },
];

const WHY_US = [
  "15 yıllık sektör deneyimi",
  "İstanbul & Adana'da 2 şube",
  "Uzman hekim kadrosu",
  "3D dijital tarama ekipmanı",
  "Esnek randevu saatleri",
  "Uygun taksit seçenekleri",
  "Garanti belgeli tedaviler",
  "7/24 acil destek hizmeti",
  "Sterilizasyon güvencesi",
];

export function About() {
  return (
    <>
      <SEO
        title="Hakkımızda — 15 Yıllık Güven ve Kalite"
        description="Positive Dental Studio 2011'den bu yana Türkiye'nin önde gelen diş kliniği. 25+ uzman hekim, 4 şehir, 15.000+ mutlu hasta. Misyon, vizyon ve değerlerimizi keşfedin."
        url="/hakkimizda"
        keywords={["positive dental studio hakkında", "diş kliniği istanbul", "uzman diş hekimi", "diş kliniği tarihi"]}
        schemaType="dental"
      />
    <div className="bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D1235] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-8%] w-[420px] h-[420px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.04]">
          {[280, 480, 680, 880].map((s) => (
            <div key={s} className="absolute rounded-full border border-white" style={{ width: s, height: s }} />
          ))}
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span className="text-white/60 text-sm font-medium">Positive Dental Studio Hakkında</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                Güvenin ve
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  kalitenin adresi.
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
                15 yıldır İstanbul ve Adana'da hizmet veren, binlerce hastamıza sağlıklı gülüşler kazandıran güvenilir diş kliniğiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                  <Calendar className="w-5 h-5" /> Randevu Al
                </a>
                <a href="tel:+908501234567"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/12 text-white font-bold transition-all">
                  <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
                </a>
              </div>
            </motion.div>

            {/* Stats grid on hero */}
            <motion.div
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="grid grid-cols-2 gap-3"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-white/10 hover:border-white/16 transition-all group"
                >
                  <p className="font-display text-3xl font-black text-white mb-1">{s.number}</p>
                  <p className="font-bold text-white/70 text-sm">{s.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          STORY
      ════════════════════════════════════════════════════���═════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-500">Hikayemiz</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
                2011'den{" "}
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">bu yana.</span>
              </h2>
              <div className="space-y-4 text-slate-500 leading-relaxed">
                <p>
                  Positive Dental Studio, 2011 yılında İstanbul'da tek bir klinikte başladığı yolculuğunda, diş sağlığı alanında fark yaratma hedefiyle kuruldu. Kurucularımız, her hastanın benzersiz ihtiyaçlarını anlayarak, onlara en iyi tedaviyi sunma vizyonuyla yola çıktı.
                </p>
                <p>
                  Bugün İstanbul Nişantaşı ve Adana Türkmenbaşı'nda hizmet veren, 25'ten fazla uzman hekimin yer aldığı bir aile olduk. Modern ekipman ve dijital planlama sistemleriyle sektörde öncü konumdayız.
                </p>
                <p>
                  Modern teknoloji, uzman kadro ve hasta odaklı yaklaşımımızla binlerce hastamıza ulaştık. Her hastamızın gülümsemesindeki güven, bizim için en büyük başarı göstergesi.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=800&q=75&auto=format"
                  alt="Positive Dental Studio kliniği"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer border border-white/50"
                  >
                    <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-0.5" />
                  </motion.div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                  <p className="font-black text-indigo-600 text-sm">EST. 2011</p>
                  <p className="font-bold text-slate-800">Positive Dental Studio</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MISSION & VISION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Nereye gidiyoruz?</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">Misyon & Vizyon</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Target,
                title: "Misyonumuz",
                gradient: "from-teal-500 to-cyan-600",
                desc: "Her hastamıza en yüksek kalitede diş sağlığı hizmeti sunmak, onların yaşam kalitesini artırmak ve sağlıklı gülüşler kazandırmak. Modern teknoloji ve uzman kadromuzla sektörde öncü olmak.",
              },
              {
                icon: Eye,
                title: "Vizyonumuz",
                gradient: "from-indigo-500 to-violet-600",
                desc: "Türkiye'nin en güvenilir ve tercih edilen diş kliniği zinciri olmak. Yenilikçi tedavi yöntemleri ve hasta memnuniyeti odaklı yaklaşımımızla sektöre yön vermek ve uluslararası standartlarda hizmet sunmak.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-transparent transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Çalışma Prensiplerimiz</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Değer
              <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">lerimiz.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-slate-50 rounded-3xl p-7 text-center border border-white hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TEAM
      ═════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Ekibimiz</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Uzman{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">kadromuz.</span>
            </h2>
            <p className="text-slate-500 mt-4">Alanında uzman, deneyimli hekimlerimiz</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 transition-all"
              >
                <div className="relative overflow-hidden h-72">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold rounded-full">
                      {member.specialty}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900">{member.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY US
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Neden Biz?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-8 leading-tight">
                Positive Dental
                <br />
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">ayrıcalığı.</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {WHY_US.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Randevu Al
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1770134223774-13b735e29201?w=800&q=75&auto=format"
                  alt="Uzman hekim"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                <motion.div
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">4.9 / 5</p>
                    <p className="text-slate-400 text-xs">Hasta memnuniyeti</p>
                  </div>
                </motion.div>
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
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-5">Seni Bekliyoruz</span>
          <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Gülüşünü
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">bizimle başlat.</span>
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
        </motion.div>
      </section>

    </div>
    </>
  );
}