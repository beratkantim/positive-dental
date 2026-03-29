import { useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, GraduationCap, Star, ChevronRight, Phone, ExternalLink } from "lucide-react";
import { useTable } from "../hooks/useSupabase";
import { SEO } from "../components/SEO";
import type { Doctor, BranchData } from "@/lib/supabase";

type Branch = "adana" | "istanbul";

const BOOKING_URL = "/online-randevu";

function DoctorCard({ doctor, index }: { doctor: Doctor; index?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Fotoğraf */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading={index !== undefined && index < 4 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index !== undefined && index < 4 ? "high" : undefined}
          width="400"
          height="500"
        />
        {/* Şube etiketleri */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {(doctor.branches_labels?.length ? doctor.branches_labels : [doctor.branch_label]).map(label => (
          <span key={label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-indigo-700 shadow-sm border border-indigo-100">
            <MapPin className="w-3 h-3" />
            {label}
          </span>
          ))}
        </div>
      </div>

      {/* İçerik */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{doctor.specialty}</p>
        <h3 className="text-slate-900 mb-0.5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{doctor.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{doctor.title}</p>

        {/* Uzmanlık rozetleri */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {doctor.expertise.slice(0, 3).map((exp) => (
            <span key={exp} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              {exp}
            </span>
          ))}
          {doctor.expertise.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-semibold">
              +{doctor.expertise.length - 3}
            </span>
          )}
        </div>

        {/* Detay aç/kapat */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors mb-3 self-start"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? "Daha az göster" : "Hakkında & Eğitim"}
        </button>

        {expanded && (
          <div className="mb-4 space-y-3 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Eğitim
              </p>
              <ul className="space-y-1">
                {doctor.education.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <Star className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="flex gap-2 mt-2">
          {doctor.slug && (
            <Link
              to={`/doktorlarimiz/${doctor.slug}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 text-sm font-bold hover:bg-indigo-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
              Detay
            </Link>
          )}
          <Link
            to={`/online-randevu?doktor=${doctor.id}`}
            className={`${doctor.slug ? "flex-1" : "w-full"} flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-md shadow-indigo-200/60 hover:shadow-indigo-300/70 hover:from-indigo-400 hover:to-violet-500 transition-all`}
          >
            <Calendar className="w-4 h-4" />
            Randevu Al
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Doctors() {
  const [activeBranch, setActiveBranch] = useState<Branch | "all">("all");
  const { data: DOCTORS, loading } = useTable<Doctor>("doctors", "sort_order");
  const { data: branchRows } = useTable<BranchData>("branches");

  const BRANCHES = branchRows.map((b) => ({
    id: b.slug.includes("adana") ? ("adana" as Branch) : ("istanbul" as Branch),
    label: b.name,
    icon: b.slug.includes("adana") ? "🌟" : "✨",
  }));

  const filtered = activeBranch === "all"
    ? DOCTORS
    : DOCTORS.filter((d) => d.branches?.includes(activeBranch) || d.branch === activeBranch);

  const adanaDoctors = filtered.filter((d) => d.branches?.includes("adana") || d.branch === "adana");
  const istanbulDoctors = filtered.filter((d) => d.branches?.includes("istanbul") || d.branch === "istanbul");

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0D1235" }}>
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <>
    <SEO
      title="Doktorlarımız — Uzman Diş Hekimleri"
      description="Positive Dental Studio uzman diş hekimleri. İstanbul Nişantaşı ve Adana Türkmenbaşı şubelerimizde deneyimli ve sertifikalı hekimler."
      url="/doktorlarimiz"
      keywords={["diş hekimi", "uzman diş doktoru", "implant uzmanı", "ortodonti uzmanı", "estetik diş hekimi"]}
      schemaType="dental"
    />
    <main className="min-h-screen" style={{ backgroundColor: "#0D1235" }}>
      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Arka plan süsleme */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            Uzman Kadromuz
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800 }}>
            Doktorlarımız
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto" style={{ fontSize: "1.05rem" }}>
            Her iki şubemizde deneyimli ve alanında uzman hekim kadrosuyla hizmetinizdeyiz.
            İstediğiniz doktordan doğrudan online randevu alabilirsiniz.
          </p>

          {/* Şube filtresi */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveBranch("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeBranch === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              Tüm Şubeler
              <span className="ml-2 text-xs opacity-70">({DOCTORS.length} Doktor)</span>
            </button>
            {BRANCHES.map((branch) => {
              const count = DOCTORS.filter((d) => d.branches?.includes(branch.id) || d.branch === branch.id).length;
              return (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeBranch === branch.id
                      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {branch.label}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doktor listeleri */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Adana */}
          {adanaDoctors.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-bold">Adana Türkmenbaşı</span>
                  <span className="text-xs text-slate-400 ml-1">{adanaDoctors.length} Uzman</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {adanaDoctors.map((doctor, i) => (
                  <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* İstanbul */}
          {istanbulDoctors.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  <span className="text-white font-bold">İstanbul Nişantaşı</span>
                  <span className="text-xs text-slate-400 ml-1">{istanbulDoctors.length} Uzman</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {istanbulDoctors.map((doctor, i) => (
                  <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Alt CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-3" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Hangi doktoru seçeceğinizden emin değil misiniz?
          </h2>
          <p className="text-slate-400 mb-6">
            Kliniğimizi arayın, sizi ihtiyacınıza en uygun uzmana yönlendirelim.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+908501234567"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all"
            >
              <Phone className="w-4 h-4" /> 0850 123 45 67
            </a>
            <Link
              to="/online-randevu"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-500 transition-all"
            >
              <Calendar className="w-4 h-4" /> Online Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}