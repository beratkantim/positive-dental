import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Link } from "react-router";
import { Calendar, ArrowRight } from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function KidsTeaser() {
  return (
    <section className="py-6 sm:py-12 bg-white overflow-hidden content-lazy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-indigo-50 border border-pink-100"
        >
          {/* Floating blobs — hidden on mobile for performance */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/40 rounded-full blur-[80px] pointer-events-none hidden md:block" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-200/40 rounded-full blur-[70px] pointer-events-none hidden md:block" />

          <div className="relative grid lg:grid-cols-2 gap-0 items-center">
            {/* Left – text */}
            <div className="p-10 lg:p-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-200 mb-6">
                <span className="text-base">🌟</span>
                <span className="text-pink-700 text-xs font-bold uppercase tracking-widest">Çocuk Diş Hekimliği</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5">
                Küçük dişler,
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">büyük gülüşler.</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
                Özel eğitimli hekimlerimiz ve eğlenceli kliniğimizle çocukların diş hekimi korkusunu sevgiye dönüştürüyoruz. 0–13 yaş arası tüm diş bakımı ihtiyaçları burada.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Ağrısız Tedavi 🛡️", "Süt Dişi Uzmanı 🦷", "Eğlenceli Ortam 🎈", "Ücretsiz İlk Muayene ✓"].map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-pink-100 text-slate-600 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/cocuk-dis-hekimligi"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold shadow-lg shadow-pink-200 hover:scale-105 transition-all"
                >
                  Çocuk Sayfasını Keşfet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-pink-100 text-slate-700 font-bold hover:border-pink-300 hover:shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4 text-pink-500" />
                  Randevu Al
                </a>
              </div>
            </div>

            {/* Right – visual */}
            <div className="relative h-80 sm:h-96 lg:h-auto lg:min-h-[420px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1611146033545-5e1e5ad951d8?w=700&q=75&auto=format"
                alt="Mutlu çocuk dişçide"
                className="w-full h-full object-cover"
                width={700}
                height={420}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-50/60 via-transparent to-transparent lg:block hidden" />

              {/* Floating stat */}
              <div
                className="anim-float absolute bottom-6 right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-xl">
                  😄
                </div>
                <div>
                  <p className="font-black text-slate-800">5.000+</p>
                  <p className="text-slate-400 text-xs">Mutlu Çocuk Hasta</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
