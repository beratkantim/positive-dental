import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Star, Target, Eye, Play } from "lucide-react";

const DEFAULT_STORY = [
  "Positive Dental Studio, 2011 yılında İstanbul'da tek bir klinikte başladığı yolculuğunda, diş sağlığı alanında fark yaratma hedefiyle kuruldu. Kurucularımız, her hastanın benzersiz ihtiyaçlarını anlayarak, onlara en iyi tedaviyi sunma vizyonuyla yola çıktı.",
  "Bugün İstanbul Nişantaşı ve Adana Türkmenbaşı'nda hizmet veren, 25'ten fazla uzman hekimin yer aldığı bir aile olduk. Modern ekipman ve dijital planlama sistemleriyle sektörde öncü konumdayız.",
  "Modern teknoloji, uzman kadro ve hasta odaklı yaklaşımımızla binlerce hastamıza ulaştık. Her hastamızın gülümsemesindeki güven, bizim için en büyük başarı göstergesi.",
];

const DEFAULT_MISSION = "Her hastamıza en yüksek kalitede diş sağlığı hizmeti sunmak, onların yaşam kalitesini artırmak ve sağlıklı gülüşler kazandırmak. Modern teknoloji ve uzman kadromuzla sektörde öncü olmak.";
const DEFAULT_VISION = "Türkiye'nin en güvenilir ve tercih edilen diş kliniği zinciri olmak. Yenilikçi tedavi yöntemleri ve hasta memnuniyeti odaklı yaklaşımımızla sektöre yön vermek ve uluslararası standartlarda hizmet sunmak.";

interface Props {
  story?: string;
  mission?: string;
  vision?: string;
}

export function AboutStory({ story, mission, vision }: Props) {
  const storyParagraphs = story ? story.split("\n").filter(Boolean) : DEFAULT_STORY;
  const missionText = mission || DEFAULT_MISSION;
  const visionText = vision || DEFAULT_VISION;

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
                {storyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=800&q=75&auto=format"
                  alt="Positive Dental Studio kliniği"
                  className="w-full h-[420px] object-cover"
                  width={800} height={420} fetchPriority="high" loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer border border-white/50">
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
              { icon: Target, title: "Misyonumuz", gradient: "from-teal-500 to-cyan-600", desc: missionText },
              { icon: Eye, title: "Vizyonumuz", gradient: "from-indigo-500 to-violet-600", desc: visionText },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-transparent transition-all">
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
