import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, Play } from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function WhyUs() {
  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden content-lazy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden h-52">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1769559893692-c6d0623bf8e4?w=400&q=75&auto=format" alt="Gülen hasta" className="w-full h-full object-cover" width={400} height={208} />
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
                  <p className="font-display text-4xl font-black">%100</p>
                  <p className="text-indigo-100 text-sm mt-1">Sterilizasyon Güvencesi</p>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <div className="bg-slate-900 rounded-2xl p-5 text-white">
                  <p className="font-display text-4xl font-black text-white">10+</p>
                  <p className="text-slate-400 text-sm mt-1">Yıl Deneyim</p>
                </div>
                <div className="rounded-2xl overflow-hidden h-52">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1763739906082-a6093d4939f9?w=400&q=75&auto=format" alt="Mutlu çift" className="w-full h-full object-cover" width={400} height={208} />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="pointer-events-auto w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/50 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-0.5" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Neden Biz?</span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Positive Dental<br /><span className="italic">farkını</span> hisset.
              </h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Dişçi koltuğu artık stresin değil, özgüvenin başladığı yer. Her tedaviyi deneyim tasarımcısı gibi planlıyoruz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "", title: "Aynı Gün Randevu",      desc: "Online sistemle saniyeler içinde slot al." },
                { icon: "🔬", title: "3D Dijital Planlama",   desc: "Tedavini başlamadan önce ekranda gör." },
                { icon: "🛡️", title: "Steril & Güvenli",     desc: "Uluslararası sterilizasyon protokolü." },
                { icon: "🌍", title: "International Patients", desc: "Yabancı hastalar için özel paketler." },
              ].map((w, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  key={w.title}
                  className="flex gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-2xl flex-shrink-0">{w.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{w.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all"
            >
              <Calendar className="w-5 h-5" /> Online Randevu Al
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
