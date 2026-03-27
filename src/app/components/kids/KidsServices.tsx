import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Star, Calendar, ArrowRight, CheckCircle2,
  Heart, Shield, Smile, Sparkles,
} from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

const FEATURES = [
  {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    title: "Korkusuz Ortam",
    desc: "\u00c7ocuklara \u00f6zel dekore edilmi\u015f odalar\u0131m\u0131z, oyun alanlar\u0131m\u0131z ve sevecen yakla\u015f\u0131m\u0131m\u0131zla di\u015f\u00e7i korkusunu birlikte yeniyoruz.",
  },
  {
    icon: Shield,
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    title: "G\u00fcvenli Tedavi",
    desc: "\u00c7ocuk di\u015fhekimli\u011fine \u00f6zel sertifikal\u0131 hekimlerimiz, en g\u00fcncel ve a\u011fr\u0131s\u0131z tedavi protokollerini uygular.",
  },
  {
    icon: Smile,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    title: "E\u011flenceli Deneyim",
    desc: "Her kontrol\u00fc bir maceraya d\u00f6n\u00fc\u015ft\u00fcr\u00fcyoruz \u2014 di\u015f f\u0131r\u00e7alama yar\u0131\u015fmalar\u0131, \u00f6d\u00fcl rozetleri ve renkli uygulamalarla.",
  },
  {
    icon: Sparkles,
    color: "from-teal-400 to-cyan-500",
    bg: "bg-teal-50",
    title: "Erken Koruma",
    desc: "Fiss\u00fcr \u00f6rt\u00fcc\u00fc, flor\u00fcr uygulamas\u0131 ve beslenme rehberli\u011fiyle di\u015flerin \u00e7\u00fcr\u00fcmeden \u00f6nce korunmas\u0131n\u0131 sa\u011fl\u0131yoruz.",
  },
];

const SERVICES = [
  { emoji: "\ud83e\uddb7", title: "S\u00fct Di\u015fi Tedavisi", desc: "S\u00fct di\u015fleri gelecekteki kal\u0131c\u0131 di\u015flerin yol haritas\u0131d\u0131r. Do\u011fru koruma kritik." },
  { emoji: "\ud83d\udee1\ufe0f", title: "Fiss\u00fcr \u00d6rt\u00fcc\u00fc", desc: "Az\u0131 di\u015flerindeki \u00e7ukurcuklar\u0131 kapatarak \u00e7\u00fcr\u00fcme riskini %70 azalt\u0131r." },
  { emoji: "\u2728", title: "Flor\u00fcr Uygulamas\u0131", desc: "Di\u015f minesiini g\u00fc\u00e7lendiren 3 dakikal\u0131k uygulama, y\u0131llarca koruma sa\u011flar." },
  { emoji: "\ud83d\udcd0", title: "\u00c7ocuk Ortodontisi", desc: "Erken m\u00fcdahale ile kal\u0131c\u0131 di\u015flerin d\u00fczg\u00fcn \u00e7\u0131kmas\u0131n\u0131 destekliyoruz." },
  { emoji: "\ud83c\udfaf", title: "Di\u015f Travmas\u0131", desc: "K\u0131r\u0131k veya d\u00fc\u015fen s\u00fct di\u015flerinde h\u0131zl\u0131 ve etkili acil tedavi." },
  { emoji: "\ud83d\ude34", title: "Sedasyon Se\u00e7ene\u011fi", desc: "Kayg\u0131l\u0131 \u00e7ocuklar i\u00e7in uzman anestezi ekibiyle g\u00fcvenli sedasyon tedavisi." },
];

const TESTIMONIALS = [
  { name: "Zeynep A.", role: "3 ya\u015f\u0131nda annesi", text: "Doktorumuz o kadar sabrili ve \u015fefkatliydi ki k\u0131z\u0131m 'bir daha ne zaman gidiyoruz?' diye sordu. \u0130nan\u0131lmaz!", rating: 5 },
  { name: "Burak K.", role: "6 ya\u015f\u0131nda babas\u0131", text: "Fiss\u00fcr \u00f6rt\u00fcc\u00fc uygulamas\u0131 saniyeler i\u00e7inde bitti. O\u011flum hi\u00e7 fark etmedi bile, \u00e7ok mutlu ayr\u0131ld\u0131.", rating: 5 },
  { name: "Ceren T.", role: "8 ya\u015f\u0131nda annesi", text: "Y\u0131llarca ba\u015fka kliniklerde \u00e7ok zorland\u0131k. Positive Dental Kids'te her \u015fey farkl\u0131yd\u0131 \u2014 s\u0131cak, e\u011flenceli ve profesyonel.", rating: 5 },
];

export function KidsServices() {
  return (
    <>
      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Fark\u0131m\u0131z</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              \u00c7ocu\u011funuz burada{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">g\u00fcvende.</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Her ziyaret bir maceraya d\u00f6n\u00fc\u015fs\u00fcn diye \u00e7al\u0131\u015f\u0131yoruz. \u00c7\u00fcnk\u00fc iyi al\u0131\u015fkanl\u0131klar k\u00fc\u00e7\u00fck ya\u015fta ba\u015flar.
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

      {/* SERVICES */}
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
                K\u00fc\u00e7\u00fck di\u015flere
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">b\u00fcy\u00fck \u00f6zen.</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                S\u00fct di\u015finden kal\u0131c\u0131 di\u015fe ge\u00e7i\u015fe kadar her a\u015famada yan\u0131nday\u0131z. \u00c7ocu\u011funuzun a\u011f\u0131z sa\u011fl\u0131\u011f\u0131 hayat\u0131 boyu ta\u015f\u0131yaca\u011f\u0131 en de\u011ferli hediyedir.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" /> \u00dccretsiz \u0130lk Muayene
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

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Ebeveyn Yorumlar\u0131</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">Anne & babalar anlat\u0131yor.</h2>
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
                  <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Do\u011fruland\u0131</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
