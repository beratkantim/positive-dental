import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Star, Calendar, ExternalLink, Baby } from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

// Floating bubble background element
function Bubble({ size, color, x, y, delay }: { size: number; color: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-60`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function KidsHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0B5FBF] via-indigo-950 to-violet-950 overflow-hidden min-h-[88vh] flex items-center">

      {/* Floating bubbles */}
      <Bubble size={80} color="bg-pink-400" x="5%" y="15%" delay={0} />
      <Bubble size={50} color="bg-amber-300" x="12%" y="65%" delay={1.2} />
      <Bubble size={110} color="bg-violet-500" x="85%" y="10%" delay={0.6} />
      <Bubble size={60} color="bg-teal-400" x="90%" y="70%" delay={1.8} />
      <Bubble size={35} color="bg-rose-400" x="70%" y="30%" delay={2.4} />
      <Bubble size={45} color="bg-indigo-400" x="30%" y="80%" delay={0.9} />

      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8">
              <Baby className="w-4 h-4 text-pink-300" />
              <span className="text-white/70 text-sm font-medium">\u00c7ocuk Di\u015f Hekimli\u011fi</span>
              <span className="text-white/30">\u00b7</span>
              <span className="text-pink-300 text-sm font-bold">0\u201318 Ya\u015f</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
              K\u00fc\u00e7\u00fck di\u015fler,
              <br />
              <span className="bg-gradient-to-r from-pink-300 via-amber-300 to-violet-300 bg-clip-text text-transparent">
                b\u00fcy\u00fck g\u00fcl\u00fc\u015fler
              </span>
              <span className="text-4xl ml-2">\ud83c\udf1f</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-10">
              \u00c7ocu\u011funuzun di\u015fleri g\u00fcvende, sen de rahat. \u00d6zel e\u011fitimli hekimlerimiz ve e\u011flenceli ortam\u0131m\u0131zla di\u015f\u00e7i korkusunu tamamen bitiriyoruz.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-pink-900/40 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" />
                \u00c7ocuk Randevusu Al
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <Link to="/iletisim"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/8 border border-white/12 hover:bg-white/14 text-white font-bold transition-all">
                Bize Ula\u015f
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { val: "5.000+", lbl: "Mutlu \u00c7ocuk" },
                { val: "0 a\u011fr\u0131", lbl: "Garantisi" },
                { val: "4.9\u2605", lbl: "Ebeveyn Puan\u0131" },
              ].map((s) => (
                <div key={s.lbl} className="text-center">
                  <p className="font-display text-xl font-black text-white">{s.val}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right -- image collage */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="relative h-[440px] lg:h-[520px]">
              {/* Main image */}
              <div className="absolute left-0 top-0 w-[65%] h-[68%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1611146033545-5e1e5ad951d8?w=600&q=75&auto=format"
                  alt="Mutlu \u00e7ocuk di\u015f\u00e7ide"
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                  fetchPriority="high"
                  loading="eager"
                />
              </div>

              {/* Second image */}
              <div className="absolute right-0 top-8 w-[42%] h-[50%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1622408064430-9728776f96e6?w=400&q=75&auto=format"
                  alt="Di\u015f f\u0131r\u00e7alayan \u00e7ocuk"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                />
              </div>

              {/* Third image */}
              <div className="absolute left-8 bottom-0 w-[48%] h-[40%] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1619236233405-bb5d430f0620?w=400&q=75&auto=format"
                  alt="\u00c7ocuk muayenesi"
                  className="w-full h-full object-cover"
                  width={400}
                  height={240}
                />
              </div>

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-2 bottom-6 bg-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-3"
              >
                <span className="text-3xl">\ud83c\udfc6</span>
                <div>
                  <p className="font-black text-slate-800 text-sm">En \u0130yi \u00c7ocuk Klini\u011fi</p>
                  <p className="text-slate-400 text-xs">\u0130stanbul 2024</p>
                </div>
              </motion.div>

              {/* Rating bubble */}
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl shadow-xl px-4 py-3 text-white"
              >
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-white text-white" />)}
                </div>
                <p className="font-black text-sm">4.9 / 5</p>
                <p className="text-pink-200 text-xs">Ebeveyn yorumlar\u0131</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
