import { motion } from "motion/react";
import { Link } from "react-router";
import { Sparkles, Calendar, Phone } from "lucide-react";

import { ABOUT_STATS as STATS } from "../../data/aboutStats";

const BOOKING_URL = "/online-randevu";

export function AboutHero() {
  return (
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
              <span className="text-white/60 text-sm font-medium">Positive Dental Studio Hakk\u0131nda</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
              G\u00fcvenin ve
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                kalitenin adresi.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
              15 y\u0131ld\u0131r \u0130stanbul ve Adana'da hizmet veren, binlerce hastam\u0131za sa\u011fl\u0131kl\u0131 g\u00fcl\u00fc\u015fler kazand\u0131ran g\u00fcvenilir di\u015f klini\u011finiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={BOOKING_URL}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Randevu Al
              </Link>
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
  );
}
