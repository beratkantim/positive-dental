import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Star, Calendar, ArrowRight, CheckCircle2,
  Heart, Shield, Smile, Sparkles,
} from "lucide-react";
import { useTable } from "../../hooks/useSupabase";
import type { Doctor } from "@/lib/supabase";

const FEATURES = [
  {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    title: "Korkusuz Ortam",
    desc: "Oyun alanları\nSevecen yaklaşım\nKorkusuz tedavi",
  },
  {
    icon: Shield,
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    title: "Güvenli Tedavi",
    desc: "Sertifikalı hekimler\nAğrısız protokoller\nGüncel teknikler",
  },
  {
    icon: Smile,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    title: "Eğlenceli Deneyim",
    desc: "Ödül rozetleri\nRenkli uygulamalar\nHer kontrol bir macera",
  },
  {
    icon: Sparkles,
    color: "from-teal-400 to-cyan-500",
    bg: "bg-teal-50",
    title: "Erken Koruma",
    desc: "Fissür örtücü\nFlorür uygulaması\nÇürük önleme",
  },
];

const SERVICES = [
  { emoji: "🦷", title: "Süt Dişi Tedavisi", desc: "Kalıcı dişlerin temeli\nDoğru koruma kritik\nErken müdahale şart" },
  { emoji: "🛡️", title: "Fissür Örtücü", desc: "Azı dişi koruması\nÇürüme riski %70 azalır\nAğrısız uygulama" },
  { emoji: "✨", title: "Florür Uygulaması", desc: "Diş minesi güçlenir\n3 dakika sürer\nYıllarca koruma" },
  { emoji: "📐", title: "Çocuk Ortodontisi", desc: "Erken müdahale\nDüzgün diş dizilimi\nKalıcı dişlere hazırlık" },
  { emoji: "🎯", title: "Diş Travması", desc: "Kırık diş tedavisi\nAcil müdahale\nHızlı iyileşme" },
  { emoji: "😴", title: "Sedasyon Seçeneği", desc: "Kaygılı çocuklar için\nUzman anestezi ekibi\nGüvenli tedavi" },
];

const TESTIMONIALS = [
  { name: "Zeynep A.", role: "3 yaşında annesi", text: "Doktorumuz o kadar sabırlı ve şefkatliydi ki kızım 'bir daha ne zaman gidiyoruz?' diye sordu. İnanılmaz!", rating: 5 },
  { name: "Burak K.", role: "6 yaşında babası", text: "Fissür örtücü uygulaması saniyeler içinde bitti. Oğlum hiç fark etmedi bile, çok mutlu ayrıldı.", rating: 5 },
  { name: "Ceren T.", role: "8 yaşında annesi", text: "Yıllarca başka kliniklerde çok zorlandık. Positive Dental Kids'te her şey farklıydı — sıcak, eğlenceli ve profesyonel.", rating: 5 },
];

export function KidsServices() {
  const { data: doctors } = useTable<Doctor>("doctors", "sort_order");
  const { data: categories } = useTable<{ id: string; slug: string }>("treatment_categories");

  // Pedodonti + ortodonti kategori ID'lerini bul
  const pedodontiId = categories.find(c => c.slug === "pedodonti")?.id;
  const ortodontiId = categories.find(c => c.slug === "ortodonti")?.id;
  const targetIds = [pedodontiId, ortodontiId].filter(Boolean) as string[];

  // Bu kategorilerde çalışan aktif doktorları filtrele
  // service_ids boş = tüm tedavileri yapar (hariç tut — sadece spesifik pedodonti/ortodonti seçenler)
  const kidsDoctors = doctors.filter(d =>
    d.is_active && d.service_ids?.length > 0 && d.service_ids.some((sid: string) => targetIds.includes(sid))
  );

  return (
    <>
      {/* FEATURES */}
      <section className="pt-6 sm:pt-16 pb-4 sm:pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
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
                  className={`${f.bg} rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white hover:shadow-xl transition-all group min-w-[140px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink text-center sm:text-left`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-2 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base mb-1 sm:mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-[10px] sm:text-sm leading-relaxed whitespace-pre-line">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="pt-4 sm:pt-12 pb-16 sm:pb-24 bg-white">
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
              className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
            >
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-slate-50 hover:bg-white hover:shadow-md rounded-2xl p-4 sm:p-5 border border-transparent hover:border-pink-100 transition-all cursor-pointer min-w-[160px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink text-center sm:text-left"
                >
                  <div className="text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform inline-block">{s.emoji}</div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 group-hover:text-pink-600 transition-colors">{s.title}</h4>
                  <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed whitespace-pre-line">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      {kidsDoctors.length > 0 && (
        <section className="pt-8 sm:pt-16 pb-8 sm:pb-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Uzman Kadromuz</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900">
                Çocuğunuz <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">emin ellerde.</span>
              </h2>
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {kidsDoctors.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 hover:shadow-lg transition-all min-w-[220px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink text-center"
                >
                  {d.photo ? (
                    <img src={d.photo} alt={d.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 border-4 border-pink-100" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center mx-auto mb-3 text-white font-black text-2xl border-4 border-pink-100">
                      {d.name?.split(" ").slice(-1)[0]?.[0] || "?"}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{d.title ? `${d.title} ` : ""}{d.name}</h3>
                  <p className="text-pink-500 text-xs sm:text-sm font-medium mt-1">{d.specialty}</p>
                  <Link
                    to={`/doktorlarimiz/${d.slug}`}
                    className="inline-block mt-3 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Profili Gör →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="pt-8 sm:pt-16 pb-10 sm:pb-24 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Ebeveyn Yorumları</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">Anne & babalar anlatıyor.</h2>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 md:p-7 shadow-sm border border-white hover:shadow-xl hover:border-pink-100 transition-all w-[200px] md:w-auto md:min-w-0 snap-start flex-shrink-0 md:flex-shrink"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 line-clamp-4">"{t.text}"</p>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <p className="text-slate-600 text-xs truncate"><span className="font-bold">{t.name}</span> · {t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
