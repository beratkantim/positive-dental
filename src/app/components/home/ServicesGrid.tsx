import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTable } from "../../hooks/useSupabase";
import type { Service } from "@/lib/supabase";

export function ServicesGrid() {
  const { data: services } = useTable<Service>("services", "sort_order");

  const items = services.length > 0
    ? services.map(s => ({ title: s.title, desc: s.description, icon: s.icon, color: `${s.color_from} ${s.color_to}` }))
    : [
        { title: "İmplant Tedavisi", desc: "Kalıcı, doğal görünümlü diş çözümleri.", icon: "🔩", color: "from-violet-500 to-purple-600" },
        { title: "Estetik & Gülüş", desc: "Veneer, beyazlatma, dijital gülüş simülasyonu.", icon: "✨", color: "from-indigo-500 to-violet-600" },
        { title: "Ortodonti", desc: "Şeffaf plak ve modern braketlerle tedavi.", icon: "😁", color: "from-sky-500 to-blue-600" },
        { title: "Genel Diş Hekimliği", desc: "Rutin kontrol, kanal, dolgu.", icon: "🦷", color: "from-teal-500 to-cyan-600" },
        { title: "Çocuk Diş Hekimliği", desc: "Çocuğunuzun dişçi korkusunu sevgiye dönüştürüyoruz.", icon: "🌟", color: "from-amber-400 to-orange-500" },
        { title: "Protez & Zirkonyum", desc: "Doğal görünüm, uzun ömür.", icon: "💎", color: "from-emerald-500 to-green-600" },
      ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] content-lazy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hizmetlerimiz</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Her ihtiyacın<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent"> bir çözümü var.</span>
            </h2>
          </div>
          <Link to="/hizmetlerimiz" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
            Tüm Hizmetler <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              key={s.title}
              className="hover-lift group bg-white rounded-2xl p-6 border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                Detaylı Bilgi <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
