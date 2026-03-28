import { motion } from "motion/react";
import {
  Shield, Calendar, Phone,
} from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

export function InsuranceHero({ insuranceCount }: { insuranceCount: number }) {
  return (
    <section className="relative bg-[#0B5FBF] overflow-hidden min-h-[64vh] flex items-center">
      <div className="absolute top-[-12%] left-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
              <Shield className="w-4 h-4 text-violet-300" />
              <span className="text-white/60 text-sm font-medium">Sigorta Anla\u015fmalar\u0131</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
              Sigortal\u0131ysan\u0131z
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                kolay tedavi.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
              T\u00fcrkiye'nin \u00f6nde gelen <strong className="text-white">{insuranceCount}+ sigorta \u015firketiyle</strong> anla\u015fmal\u0131y\u0131z. Poli\u00e7enizle muayeneden kaplama tedavisine kadar geni\u015f kapsamda faydalan\u0131n.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Randevu Al
              </a>
              <a href="tel:+908501234567"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold transition-all">
                <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
              </a>
            </div>
          </motion.div>

          {/* Quick benefit pills */}
          <motion.div
            initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="space-y-3"
          >
            {[
              { icon: "\u2705", text: "Direk faturalama \u2014 nakit \u00f6demeksizin tedavi" },
              { icon: "\u26a1", text: "An\u0131nda poli\u00e7e do\u011frulama sistemi" },
              { icon: "\ud83d\udccb", text: "Kapsam d\u0131\u015f\u0131 i\u015flemlerde \u00f6nceden bilgilendirme" },
              { icon: "\ud83e\udd1d", text: "SGK + Tamamlay\u0131c\u0131 kombinasyon deste\u011fi" },
              { icon: "\ud83d\udcde", text: "Sigorta i\u015flemleri i\u00e7in dedicated koordinat\u00f6r" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-2xl px-5 py-4"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <p className="text-white/70 text-sm font-medium">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
