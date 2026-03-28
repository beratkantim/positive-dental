import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, CheckCircle2, ArrowRight } from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

const AGES = [
  { age: "0\u20133 Ya\u015f", icon: "\ud83d\udc76", title: "\u0130lk Ziyaret", desc: "\u0130lk di\u015f \u00e7\u0131kar \u00e7\u0131kmaz kontrol \u00f6nerilir. Tan\u0131\u015fma ve al\u0131\u015fma odakl\u0131.", color: "border-pink-200 bg-pink-50" },
  { age: "3\u20136 Ya\u015f", icon: "\ud83c\udf1f", title: "S\u00fct Di\u015fi D\u00f6nemi", desc: "\u00c7\u00fcr\u00fck kontrol\u00fc, f\u0131r\u00e7alama al\u0131\u015fkanl\u0131\u011f\u0131 kazan\u0131m\u0131 ve fiss\u00fcr \u00f6rt\u00fcc\u00fc.", color: "border-amber-200 bg-amber-50" },
  { age: "6\u201312 Ya\u015f", icon: "\ud83d\ude80", title: "Karma Di\u015f D\u00f6nemi", desc: "S\u00fct\u2013kal\u0131c\u0131 di\u015f ge\u00e7i\u015f d\u00f6nemi takibi, erken ortodontik de\u011ferlendirme.", color: "border-violet-200 bg-violet-50" },
  { age: "12\u201318 Ya\u015f", icon: "\ud83c\udf93", title: "Gen\u00e7 Yeti\u015fkin", desc: "Ortodonti, estetik koruyucu uygulamalar ve bilgelik di\u015fi kontrol\u00fc.", color: "border-teal-200 bg-teal-50" },
];

export function KidsAges() {
  return (
    <>
      {/* AGE GROUPS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Ya\u015fa G\u00f6re Bak\u0131m</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Her ya\u015f\u0131n bir{" "}
              <span className="italic text-violet-600">plan\u0131 var.</span>
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

      {/* CHECKLIST */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B5FBF] to-indigo-950 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-400 mb-4">Ebeveyn Rehberi</span>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  \u00c7ocu\u011funuzu<br />nas\u0131l haz\u0131rlars\u0131n\u0131z?
                </h2>
                <ul className="space-y-4">
                  {[
                    "\u0130lk ziyareti olumlu bir macera olarak tan\u0131t\u0131n",
                    "Rol yaparak \"di\u015f\u00e7i oyunu\" oynay\u0131n",
                    "Hekiminizin sorular\u0131na izin verin, araya girmeyin",
                    "Ba\u015far\u0131l\u0131 ziyaret sonras\u0131 \u00f6d\u00fcllendirin (tatl\u0131 de\u011fil!)",
                    "D\u00fczenli kontrolleri al\u0131\u015fkanl\u0131k haline getirin",
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
                  \u0130lk Randevuyu Al
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="relative hidden lg:block">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1619236233405-bb5d430f0620?w=600&q=75&auto=format"
                  alt="\u00c7ocuk muayenesi"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B5FBF] via-transparent to-transparent" />
                <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 max-w-xs"
                  >
                    <p className="text-3xl mb-2">\ud83c\udf81</p>
                    <p className="font-bold text-white text-sm">\u0130lk Ziyaret Hediyesi</p>
                    <p className="text-slate-400 text-xs mt-1">Her yeni \u00e7ocuk hastam\u0131za \u00f6zel di\u015f bak\u0131m seti hediye.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
