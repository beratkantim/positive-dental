import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Star, Calendar, ArrowRight, CheckCircle2,
  Heart, Shield, Smile, Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    title: "Korkusuz Ortam",
    desc: "Çocuklara özel dekore edilmiş odalarımız, oyun alanlarımız ve sevecen yaklaşımımızla diş hekimi korkusunu birlikte yeniyoruz.",
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
  { emoji: "✨", title: "Florür Uygulaması", desc: "Diş minesini güçlendiren 3 dakikalık uygulama, yıllarca koruma sağlar." },
  { emoji: "📐", title: "Çocuk Ortodontisi", desc: "Erken müdahale ile kalıcı dişlerin düzgün çıkmasını destekliyoruz." },
  { emoji: "🎯", title: "Diş Travması", desc: "Kırık veya düşen süt dişlerinde hızlı ve etkili acil tedavi." },
  { emoji: "😴", title: "Sedasyon Seçeneği", desc: "Kaygılı çocuklar için uzman anestezi ekibiyle güvenli sedasyon tedavisi." },
];

const TESTIMONIALS = [
  { name: "Zeynep A.", role: "3 yaşında annesi", text: "Doktorumuz o kadar sabırlı ve şefkatliydi ki kızım 'bir daha ne zaman gidiyoruz?' diye sordu. İnanılmaz!", rating: 5 },
  { name: "Burak K.", role: "6 yaşında babası", text: "Fissür örtücü uygulaması saniyeler içinde bitti. Oğlum hiç fark etmedi bile, çok mutlu ayrıldı.", rating: 5 },
  { name: "Ceren T.", role: "8 yaşında annesi", text: "Yıllarca başka kliniklerde çok zorlandık. Positive Dental Kids'te her şey farklıydı — sıcak, eğlenceli ve profesyonel.", rating: 5 },
];

export function KidsServices() {
  return (
    <>
      {/* FEATURES */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Farkımız</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Çocuğunuz burada{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">güvende.</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Her ziyaret bir maceraya dönüşsün diye çalışıyoruz. Çünkü iyi alışkanlıklar küçük yaşta başlar.
            </p>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
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
                  className={`${f.bg} rounded-3xl p-6 border border-white hover:shadow-xl transition-all group min-w-[260px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
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
                Küçük dişlere
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">büyük özen.</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Süt dişinden kalıcı dişe geçişe kadar her aşamada yanınızdayız. Çocuğunuzun ağız sağlığı hayatı boyu taşıyacağı en değerli hediyedir.
              </p>
              <Link
                to="/online-randevu"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" /> Ücretsiz İlk Muayene
              </Link>
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
    </>
  );
}
