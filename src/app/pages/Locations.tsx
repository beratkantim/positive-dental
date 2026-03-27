import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  MapPin, Phone, Clock, Mail, Navigation, Sparkles,
  Building2, Wifi, Shield, Cpu, Users, Calendar, ArrowRight, ExternalLink,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { useTable } from "../hooks/useSupabase";
import type { BranchData } from "@/lib/supabase";

const BOOKING_URL = "https://randevu.positivedental.com";

const CITY_COLORS: Record<string, string> = {
  "İstanbul": "from-indigo-500 to-violet-600",
  "Adana": "from-violet-500 to-purple-600",
};

interface LocationGroup {
  city: string;
  district: string;
  count: number;
  color: string;
  clinics: {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    mapsQuery: string;
  }[];
}

function branchesToLocations(branches: BranchData[]): LocationGroup[] {
  const cityMap = new Map<string, LocationGroup>();
  for (const b of branches) {
    const district = b.name.replace(b.city, "").trim();
    if (!cityMap.has(b.city)) {
      cityMap.set(b.city, {
        city: b.city,
        district,
        count: 0,
        color: CITY_COLORS[b.city] || "from-indigo-500 to-violet-600",
        clinics: [],
      });
    }
    const group = cityMap.get(b.city)!;
    group.count++;
    group.clinics.push({
      name: `${district} Şubesi`,
      address: b.address || "",
      phone: b.phone || "",
      email: b.email || "",
      hours: b.working_hours || "",
      mapsQuery: b.map_url || `Positive+Dental+Studio+${b.city}+${district}`.replace(/\s+/g, "+"),
    });
  }
  return Array.from(cityMap.values());
}

const FEATURES = [
  { icon: Cpu,     title: "Modern Ekipman",  desc: "Son teknoloji 3D tarama ve dijital sistemler" },
  { icon: Shield,  title: "Steril Ortam",    desc: "Uluslararası sterilizasyon standartları"       },
  { icon: Users,   title: "Uzman Kadro",     desc: "Deneyimli ve sertifikalı hekimler"            },
  { icon: Wifi,    title: "Online Randevu",  desc: "Kolay dijital hasta takip sistemi"            },
];

export function Locations() {
  const [activeCity, setActiveCity] = useState("İstanbul");
  const { data: branches, loading } = useTable<BranchData>("branches", "sort_order");

  const LOCATIONS = branchesToLocations(branches);
  const activeLoc = LOCATIONS.find((l) => l.city === activeCity) || LOCATIONS[0];

  if (loading || LOCATIONS.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1235]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Kliniklerimiz — İstanbul Nişantaşı & Adana Türkmenbaşı"
        description="Positive Dental Studio şubeleri: İstanbul Nişantaşı ve Adana Türkmenbaşı. Size en yakın kliniği seçin, hemen randevu alın."
        url="/kliniklerimiz"
        keywords={["diş kliniği nişantaşı", "diş kliniği adana", "positive dental istanbul", "positive dental adana"]}
        schemaType="dental"
      />
      <div className="bg-white overflow-hidden">

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#0D1235] overflow-hidden min-h-[70vh] flex items-center">
          <div className="absolute top-[-12%] right-[-8%] w-[480px] h-[480px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-8%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
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
                  <MapPin className="w-4 h-4 text-violet-300" />
                  <span className="text-white/60 text-sm font-medium">2 Şehir · 2 Klinik</span>
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                  Size en yakın
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    kliniği bulun.
                  </span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
                  İstanbul Nişantaşı ve Adana Türkmenbaşı şubelerimizde modern klinik altyapısı ve uzman kadroyla hizmetinizdeyiz.
                </p>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                  <Calendar className="w-5 h-5" /> Online Randevu Al
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </motion.div>

              {/* City stat cards */}
              <motion.div
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
              >
                {LOCATIONS.map((loc, i) => (
                  <motion.button
                    key={loc.city}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => setActiveCity(loc.city)}
                    className={`relative text-left rounded-2xl p-6 border transition-all overflow-hidden ${
                      activeCity === loc.city
                        ? "bg-white/12 border-white/20 shadow-lg"
                        : "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/16"
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br ${loc.color} opacity-20 blur-xl pointer-events-none`} />
                    <p className="text-4xl mb-2">{loc.city === "İstanbul" ? "🏙️" : "🌇"}</p>
                    <p className="font-display font-black text-white text-lg">{loc.city}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{loc.district} Şubesi</p>
                    {activeCity === loc.city && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${loc.color}`} />
                    )}
                  </motion.button>
                ))}

                {/* Quick stats */}
                {[
                  { label: "Uzman Hekim", value: "25+" },
                  { label: "Mutlu Hasta", value: "15.000+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 + i * 0.08 }}
                    className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center"
                  >
                    <p className="font-display text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* ══════════════════════════════════════════════════════════
            FEATURES STRIP
        ══════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-100">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{f.title}</p>
                      <p className="text-xs text-slate-500">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CITY TABS + CLINICS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Kliniklerimiz</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
                Şubelerimizi{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">keşfedin.</span>
              </h2>
            </div>

            {/* City tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.city}
                  onClick={() => setActiveCity(loc.city)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all font-bold text-sm ${
                    activeCity === loc.city
                      ? `bg-gradient-to-r ${loc.color} border-transparent text-white shadow-lg`
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {loc.city} – {loc.district}
                </button>
              ))}
            </div>

            {/* Clinics */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                {activeLoc.clinics.map((clinic, i) => (
                  <motion.div
                    key={clinic.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 transition-all"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeLoc.color} flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform`}>
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-display font-black text-slate-900 text-xl">{clinic.name}</h3>
                        <p className="text-sm text-indigo-500 font-semibold mt-0.5">Positive Dental Studio · {activeCity}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-700 font-bold">Açık</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                        <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-700 text-sm leading-relaxed">{clinic.address}</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                        <Clock className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 text-sm leading-relaxed">{clinic.hours}</p>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <a href={`tel:${clinic.phone.replace(/\s/g, "")}`}
                          className="text-slate-700 hover:text-indigo-600 text-sm font-bold transition-colors">{clinic.phone}</a>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <a href={`mailto:${clinic.email}`}
                          className="text-slate-600 hover:text-indigo-600 text-sm transition-colors truncate">{clinic.email}</a>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-5 border-t border-slate-100">
                      <a
                        href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r ${activeLoc.color} text-white font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg`}
                      >
                        <Calendar className="w-4 h-4" /> Randevu Al
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${clinic.mapsQuery}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 font-bold text-sm transition-all"
                      >
                        <Navigation className="w-4 h-4" /> Yol Tarifi Al
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════════════ */}
        <section className="py-28 bg-[#0D1235] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"
          >
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-6" />
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-5">Yakınınızdayız</span>
            <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              En yakın kliniğinizde
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">randevu alın.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
              İstanbul Nişantaşı veya Adana Türkmenbaşı şubemizde uzman hekimlerimizle tanışın.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Online Randevu Al <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+908501234567"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}