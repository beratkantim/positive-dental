import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Heart, Award, Users, Brain, CheckCircle2, Calendar, Star } from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

const VALUES = [
  { icon: Heart,  title: "Hasta Odakl\u0131l\u0131k",  description: "Her hastam\u0131z\u0131n ihtiya\u00e7lar\u0131n\u0131 dinliyor, ona \u00f6zel tedavi planlar\u0131 haz\u0131rl\u0131yoruz.", gradient: "from-rose-500 to-pink-500" },
  { icon: Award,  title: "Kalite & M\u00fckemmellik", description: "En y\u00fcksek kalite standartlar\u0131nda hizmet sunmak i\u00e7in s\u00fcrekli geli\u015fiyoruz.", gradient: "from-amber-500 to-orange-500" },
  { icon: Users,  title: "Uzman Kadro",      description: "Alan\u0131nda deneyimli hekimlerimiz d\u00fczenli e\u011fitimlerle kendilerini geli\u015ftiriyor.", gradient: "from-indigo-500 to-violet-600" },
  { icon: Brain,  title: "\u0130leri Teknoloji",  description: "3D g\u00f6r\u00fcnt\u00fcleme ve dijital sistemlerle tedavi s\u00fcre\u00e7lerini optimize ediyoruz.", gradient: "from-teal-500 to-cyan-600" },
];

const WHY_US = [
  "15 y\u0131ll\u0131k sekt\u00f6r deneyimi",
  "\u0130stanbul & Adana'da 2 \u015fube",
  "Uzman hekim kadrosu",
  "3D dijital tarama ekipman\u0131",
  "Esnek randevu saatleri",
  "Uygun taksit se\u00e7enekleri",
  "Garanti belgeli tedaviler",
  "7/24 acil destek hizmeti",
  "Sterilizasyon g\u00fcvencesi",
];

export function AboutValues() {
  return (
    <>
      {/* VALUES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">\u00c7al\u0131\u015fma Prensiplerimiz</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              De\u011fer
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

      {/* WHY US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Neden Biz?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-8 leading-tight">
                Positive Dental
                <br />
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">ayr\u0131cal\u0131\u011f\u0131.</span>
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
                  width={800}
                  height={440}
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
    </>
  );
}
