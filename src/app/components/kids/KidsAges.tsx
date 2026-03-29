import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, CheckCircle2, ArrowRight } from "lucide-react";

const AGES = [
  { age: "0–3 Yaş", icon: "👶", title: "İlk Ziyaret", desc: "İlk diş kontrolü\nTanışma odaklı\nAlışma süreci", color: "border-pink-200 bg-pink-50" },
  { age: "3–6 Yaş", icon: "🌟", title: "Süt Dişi Dönemi", desc: "Çürük kontrolü\nFırçalama alışkanlığı\nFissür örtücü", color: "border-amber-200 bg-amber-50" },
  { age: "6–12 Yaş", icon: "🚀", title: "Karma Diş Dönemi", desc: "Geçiş dönemi takibi\nOrtodonti değerlendirme\nKoruyucu tedaviler", color: "border-violet-200 bg-violet-50" },
  { age: "12–13 Yaş", icon: "🎓", title: "Genç Yetişkin", desc: "Ortodonti tedavisi\nEstetik uygulamalar\nKoruyucu bakım", color: "border-teal-200 bg-teal-50" },
];

export function KidsAges() {
  return (
    <>
      {/* AGE GROUPS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Yaşa Göre Bakım</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Her yaşın bir{" "}
              <span className="italic text-violet-600">planı var.</span>
            </h2>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {AGES.map((a, i) => (
              <motion.div
                key={a.age}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${a.color} border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-lg transition-all min-w-[160px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink text-center sm:text-left`}
              >
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{a.icon}</div>
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 sm:mb-2">{a.age}</span>
                <h3 className="font-bold text-slate-800 text-xs sm:text-base mb-1 sm:mb-2">{a.title}</h3>
                <p className="text-slate-500 text-[10px] sm:text-sm leading-relaxed whitespace-pre-line">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
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
                    "Rol yaparak \"diş hekimi oyunu\" oynayın",
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
                <Link
                  to="/online-randevu"
                  className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-pink-900/30"
                >
                  <Calendar className="w-5 h-5" />
                  İlk Randevuyu Al
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
    </>
  );
}
