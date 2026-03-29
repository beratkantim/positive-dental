import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, ArrowRight, Phone } from "lucide-react";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function FamilyClinic() {
  return (
    <section className="relative bg-[#0D1235] overflow-hidden py-24 lg:py-32 content-lazy">

      {/* Ambient glows */}
      {/* Ambient glows — hidden on mobile for performance */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-indigo-600/12 rounded-full blur-[160px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none hidden md:block" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-600/8 rounded-full blur-[80px] pointer-events-none hidden md:block" />

      {/* Dot grid — hidden on mobile */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none hidden md:block"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
            🏠 Ailenizin Yanında
          </span>
          <h2
            className="font-display font-black text-white tracking-tight leading-[0.9] mb-6"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
          >
            Ailenizin<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              diş kliniği.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Bebekten büyükbabaya, her yaştan her bireye özel tedavi protokolleri.
            Tek bir çatı altında tüm ailenizin gülüşünü koruyoruz.
          </p>
        </motion.div>

        {/* Family cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            {
              label: "Bebekler & Küçükler",
              age: "0–6 yaş",
              emoji: "👶",
              desc: "İlk diş muayenesi, alışma seansları ve ebeveyn eğitimi.",
              color: "from-pink-500 to-rose-500",
              glow: "bg-pink-500/15",
              img: "https://images.unsplash.com/photo-1722596540819-5947b7c75523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
            },
            {
              label: "Çocuklar",
              age: "7–14 yaş",
              emoji: "🌟",
              desc: "Oyunlu muayene, ortodonti takibi ve diş koruyucular.",
              color: "from-amber-500 to-orange-500",
              glow: "bg-amber-500/15",
              img: "https://images.unsplash.com/photo-1615462696310-09736533dbb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
            },
            {
              label: "Gençler & Yetişkinler",
              age: "15–50 yaş",
              emoji: "✨",
              desc: "Estetik, implant, ortodonti — tam kapsamlı tedavi.",
              color: "from-indigo-500 to-violet-500",
              glow: "bg-indigo-500/15",
              img: "https://images.unsplash.com/photo-1627964807070-e19d3ca29bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
            },
            {
              label: "Büyükler & Yaşlılar",
              age: "50+ yaş",
              emoji: "💎",
              desc: "Protez, implant ve hassas dişler için özel protokoller.",
              color: "from-emerald-500 to-teal-500",
              glow: "bg-emerald-500/15",
              img: "https://images.unsplash.com/photo-1575267685970-7fbabf6ed7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
            },
          ].map((card, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              key={card.label}
              className="hover-lift relative group rounded-3xl overflow-hidden border border-white/8 cursor-default"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <ImageWithFallback
                  src={card.img}
                  alt={card.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={208}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235] via-[#0D1235]/40 to-transparent" />
                {/* Emoji badge */}
                <div className={`absolute top-4 right-4 w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg shadow-lg`}>
                  {card.emoji}
                </div>
                {/* Age pill */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
                  {card.age}
                </div>
              </div>

              {/* Content */}
              <div className={`${card.glow} p-5 border-t border-white/6`}>
                <h3 className="text-white font-black text-sm mb-1.5">{card.label}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
                <div className={`mt-4 h-0.5 rounded-full bg-gradient-to-r ${card.color} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center feature: family photo + stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/10 mb-14"
        >
          {/* BG image */}
          <div className="relative h-72 sm:h-96 lg:h-[420px] overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1772723246543-213f2a4fc526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=75&auto=format"
              alt="Mutlu Aile"
              className="w-full h-full object-cover object-center"
              width={1400}
              height={420}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D1235]/90 via-[#0D1235]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/60 via-transparent to-transparent" />

            {/* Left content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16 max-w-lg">
              <span className="inline-flex items-center gap-1.5 text-indigo-300 text-xs font-black uppercase tracking-widest mb-4">
                🏠 Positive Dental Studio
              </span>
              <h3 className="font-display font-black text-white text-3xl sm:text-4xl leading-tight mb-4">
                Nesiller boyunca<br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  gülen aileler.
                </span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Aile paket programlarımızla tüm bireyler tek muayenehanede takip edilir.
                Ebeveynlere özel indirimler, çocuklara ücretsiz koruyucu diş uygulamaları.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#randevu"
                  onClick={(e) => { e.preventDefault(); document.getElementById("randevu")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-sm transition-all hover:scale-[1.03] shadow-xl shadow-indigo-900/40"
                >
                  <Calendar className="w-4 h-4" /> Aile Randevusu Al <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:+908501234567"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/8 hover:bg-white/14 border border-white/10 text-white font-bold text-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-slate-400" /> 0850 123 45 67
                </a>
              </div>
            </div>

            {/* Floating benefit badges */}
            <div
              className="anim-float absolute top-6 right-6 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 hidden sm:flex flex-col gap-1"
            >
              <span className="text-white font-black text-sm">Aile Paketi</span>
              <span className="text-indigo-300 text-xs font-bold">%20 İndirim</span>
            </div>

            <div
              className="anim-float absolute bottom-6 right-6 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 hidden sm:flex items-center gap-2.5"
              style={{ animationDelay: "1s" }}
            >
              <span className="text-2xl">🦷</span>
              <div>
                <p className="text-white font-black text-xs">Ücretsiz</p>
                <p className="text-slate-300 text-xs">İlk Muayene</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom trust strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { icon: "👨‍👩‍👧‍👦", value: "4.500+", label: "Mutlu Aile" },
            { icon: "🦷", value: "Her Yaş", label: "Özel Protokol" },
            { icon: "📋", value: "Aile Paketi", label: "Toplu İndirim" },
            { icon: "📍", value: "4 Klinik", label: "Size Yakın" },
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              key={item.label}
              className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-5 py-4 hover:bg-white/8 transition-colors"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-black text-sm">{item.value}</p>
                <p className="text-slate-500 text-xs">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-8">
          Pzt – Cts: 09:00–20:00 &nbsp;·&nbsp; 4 Klinik &nbsp;·&nbsp; Aile Paket Programları
        </p>

      </div>
    </section>
  );
}
