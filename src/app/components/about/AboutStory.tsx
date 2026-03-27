import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Star, Target, Eye, Play } from "lucide-react";

export function AboutStory() {
  return (
    <>
      {/* STORY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-500">Hikayemiz</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
                2011'den{" "}
                <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">bu yana.</span>
              </h2>
              <div className="space-y-4 text-slate-500 leading-relaxed">
                <p>
                  Positive Dental Studio, 2011 y\u0131l\u0131nda \u0130stanbul'da tek bir klinikte ba\u015flad\u0131\u011f\u0131 yolculu\u011funda, di\u015f sa\u011fl\u0131\u011f\u0131 alan\u0131nda fark yaratma hedefiyle kuruldu. Kurucular\u0131m\u0131z, her hastan\u0131n benzersiz ihtiya\u00e7lar\u0131n\u0131 anlayarak, onlara en iyi tedaviyi sunma vizyonuyla yola \u00e7\u0131kt\u0131.
                </p>
                <p>
                  Bug\u00fcn \u0130stanbul Ni\u015fanta\u015f\u0131 ve Adana T\u00fcrkmenba\u015f\u0131'nda hizmet veren, 25'ten fazla uzman hekimin yer ald\u0131\u011f\u0131 bir aile olduk. Modern ekipman ve dijital planlama sistemleriyle sekt\u00f6rde \u00f6nc\u00fc konumday\u0131z.
                </p>
                <p>
                  Modern teknoloji, uzman kadro ve hasta odakl\u0131 yakla\u015f\u0131m\u0131m\u0131zla binlerce hastam\u0131za ula\u015ft\u0131k. Her hastam\u0131z\u0131n g\u00fcl\u00fcmsemesindeki g\u00fcven, bizim i\u00e7in en b\u00fcy\u00fck ba\u015far\u0131 g\u00f6stergesi.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=800&q=75&auto=format"
                  alt="Positive Dental Studio klini\u011fi"
                  className="w-full h-[420px] object-cover"
                  width={800}
                  height={420}
                  fetchPriority="high"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer border border-white/50"
                  >
                    <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-0.5" />
                  </motion.div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                  <p className="font-black text-indigo-600 text-sm">EST. 2011</p>
                  <p className="font-bold text-slate-800">Positive Dental Studio</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Nereye gidiyoruz?</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">Misyon & Vizyon</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Target,
                title: "Misyonumuz",
                gradient: "from-teal-500 to-cyan-600",
                desc: "Her hastam\u0131za en y\u00fcksek kalitede di\u015f sa\u011fl\u0131\u011f\u0131 hizmeti sunmak, onlar\u0131n ya\u015fam kalitesini art\u0131rmak ve sa\u011fl\u0131kl\u0131 g\u00fcl\u00fc\u015fler kazand\u0131rmak. Modern teknoloji ve uzman kadromuzla sekt\u00f6rde \u00f6nc\u00fc olmak.",
              },
              {
                icon: Eye,
                title: "Vizyonumuz",
                gradient: "from-indigo-500 to-violet-600",
                desc: "T\u00fcrkiye'nin en g\u00fcvenilir ve tercih edilen di\u015f klini\u011fi zinciri olmak. Yenilik\u00e7i tedavi y\u00f6ntemleri ve hasta memnuniyeti odakl\u0131 yakla\u015f\u0131m\u0131m\u0131zla sekt\u00f6re y\u00f6n vermek ve uluslararas\u0131 standartlarda hizmet sunmak.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-transparent transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 text-xl mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
