import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Star, CheckCircle2, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ── SMILE TYPES ───────────────────────────────────────────────────────────────

const SMILE_TYPES = [
  {
    id: "natural",
    label: "Doğal Gülüş",
    emoji: "🌿",
    tag: "En çok tercih edilen",
    tagColor: "text-emerald-400",
    tagBg: "bg-emerald-500/10 border-emerald-500/20",
    desc: "Dişlerinin doğal formunu ve rengini koruyarak hafif bir parlaklık ve uyum kazandırıyoruz. Kimse 'diş yaptırdın' demiyor.",
    color: "from-emerald-500 to-teal-500",
    features: ["Doğal ton & form", "Gülüş hattı düzeltme", "Minimum müdahale"],
    image: "https://images.unsplash.com/photo-1612314476864-744bdf41c93b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    id: "hollywood",
    label: "Hollywood Gülüşü",
    emoji: "✨",
    tag: "Dramatik dönüşüm",
    tagColor: "text-violet-400",
    tagBg: "bg-violet-500/10 border-violet-500/20",
    desc: "Parlak beyaz, simetrik ve sahne için tasarlanmış. Lamine ve zirkonyum kombinasyonuyla sinema yıldızlarının güvendiği estetik.",
    color: "from-violet-500 to-indigo-500",
    features: ["Maksimum beyazlık", "Tam simetri", "Lamine & Zirkonyum"],
    image: "https://images.unsplash.com/photo-1769559893692-c6d0623bf8e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    id: "designed",
    label: "Dijital Tasarım",
    emoji: "🖥️",
    tag: "Önce gör, sonra karar ver",
    tagColor: "text-sky-400",
    tagBg: "bg-sky-500/10 border-sky-500/20",
    desc: "Güleceğin gülüşü uygulamadan önce dijital ortamda görüyorsun. Mock-up dener, onaylar, sonra başlıyoruz.",
    color: "from-sky-500 to-cyan-500",
    features: ["3D simülasyon", "Mock-up deneme", "Revize hakkı"],
    image: "https://images.unsplash.com/photo-1663182234283-28941e7612da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const SMILE_STATS = [
  { value: "3.200+", label: "Gülüş Tasarımı" },
  { value: "98%",    label: "Memnuniyet" },
  { value: "1 gün",  label: "Mock-up Hızı" },
  { value: "10 yıl", label: "Garanti" },
];

// ─────────────────────────────────────────────────────────────────────────────

export function SmilePositive() {
  const [active, setActive] = useState(0);
  const slide = SMILE_TYPES[active];

  return (
    <section className="bg-[#0D1235] relative overflow-hidden py-24">

      {/* ── Ambient blobs ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-indigo-700/15 blur-[100px] pointer-events-none" />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "44px 44px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TOP LABEL ── */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 text-xs font-black uppercase tracking-widest">Live Positive · Smile Positive</span>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="font-display font-black text-white tracking-tight leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Gülüşünü<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              tasarla.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
            className="text-slate-500 mt-5 max-w-lg text-base leading-relaxed"
          >
            Sana özel dijital simülasyonla gülüşünü önce görüyorsun, sonra karar veriyorsun.
            İlk değerlendirme tamamen ücretsiz.
          </motion.p>
        </div>

        {/* ── SMILE TYPE SELECTOR + VISUAL ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-16">

          {/* Left: selector */}
          <div className="space-y-3">
            {SMILE_TYPES.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                whileHover={{ x: 4 }}
                className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden ${
                  active === i
                    ? "bg-white/8 border-white/16"
                    : "bg-white/3 border-white/6 hover:bg-white/6 hover:border-white/10"
                }`}
              >
                <div className="px-6 py-5 flex items-start gap-4">
                  {/* Emoji + number */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                    active === i ? `bg-gradient-to-br ${s.color} shadow-lg` : "bg-white/6"
                  }`}>
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`font-display font-black text-base ${active === i ? "text-white" : "text-white/60"}`}>
                        {s.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${s.tagBg} ${s.tagColor}`}>
                        {s.tag}
                      </span>
                    </div>
                    <AnimatePresence>
                      {active === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-slate-400 text-sm leading-relaxed mt-1 mb-3">{s.desc}</p>
                          <ul className="flex flex-wrap gap-2">
                            {s.features.map((f) => (
                              <li key={f} className="flex items-center gap-1.5 text-xs text-white/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {active === i && (
                    <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0 mt-1" />
                  )}
                </div>
              </motion.button>
            ))}

            {/* CTA */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <a
                href="#randevu"
                onClick={(e) => { e.preventDefault(); document.getElementById("randevu")?.scrollIntoView({ behavior: "smooth" }); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-sm transition-all hover:scale-[1.02] shadow-xl shadow-indigo-900/40"
              >
                <Sparkles className="w-4 h-4" />
                Ücretsiz Simülasyon Al
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+908501234567"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white font-bold text-sm transition-all"
              >
                📞 0850 123 45 67
              </a>
            </div>
          </div>

          {/* Right: image visual */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -12 }}
                transition={{ duration: 0.35 }}
                className="relative h-full min-h-[420px]"
              >
                {/* Glow */}
                <div className={`absolute inset-0 scale-90 translate-y-6 rounded-[2rem] bg-gradient-to-br ${slide.color} opacity-20 blur-3xl pointer-events-none`} />

                {/* Image */}
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl h-full min-h-[420px]">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.label}
                    className="w-full h-full object-cover"
                    width={600}
                    height={420}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/75 via-[#0D1235]/15 to-transparent" />

                  {/* Bottom badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-black text-sm">{slide.label}</p>
                          <p className={`text-xs mt-0.5 font-semibold ${slide.tagColor}`}>{slide.tag}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${slide.color} text-white text-xs font-black shadow-lg`}>
                          {slide.emoji} Seçildi
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating star */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-black">4.9 Puan</span>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/8 bg-white/6 border border-white/10 rounded-3xl overflow-hidden"
        >
          {SMILE_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-8 px-4 text-center group hover:bg-white/6 transition-colors">
              <span className="font-display font-black text-3xl text-white">{s.value}</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest mt-1.5 font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── BOTTOM INFO ── */}
        <p className="text-center text-white/30 text-xs mt-8">
          Pzt – Cts: 09:00–20:00 &nbsp;·&nbsp; 2 Şube &nbsp;·&nbsp; Ücretsiz İlk Değerlendirme
        </p>

      </div>
    </section>
  );
}