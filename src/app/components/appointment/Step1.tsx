import { useState } from "react";
import {
  CheckCircle, MapPin, ArrowRight, ChevronDown,
} from "lucide-react";
import type { Doctor } from "@/lib/supabase";

export function Step1({
  selectedDoctor, setSelectedDoctor,
  selectedService, setSelectedService,
  onNext,
  doctors,
  services,
  branchOptions,
}: {
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (d: Doctor) => void;
  selectedService: string;
  setSelectedService: (s: string) => void;
  onNext: () => void;
  doctors: Doctor[];
  services: string[];
  branchOptions: { id: string; label: string }[];
}) {
  const [branchFilter, setBranchFilter] = useState<"all" | "adana" | "istanbul">("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = branchFilter === "all" ? doctors : doctors.filter(d => d.branch === branchFilter);

  return (
    <div className="space-y-8">
      {/* Sube filtresi */}
      <div>
        <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          Doktor Secin
        </h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {branchOptions.map(b => (
            <button
              key={b.id}
              onClick={() => setBranchFilter(b.id as any)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                branchFilter === b.id
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-400/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
              }`}
            >
              {b.id !== "all" && <MapPin className="w-3.5 h-3.5" />}
              {b.label}
            </button>
          ))}
        </div>

        {/* Doktor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(doc => {
            const selected = selectedDoctor?.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all group ${
                  selected
                    ? "border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/20"
                    : "border-white/8 bg-white/5 hover:border-indigo-400/40 hover:bg-white/8"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-14 h-14 rounded-xl object-cover object-center"
                  />
                  {selected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold mb-0.5 truncate ${selected ? "text-indigo-400" : "text-indigo-400/70"}`}>
                    {doc.specialty}
                  </p>
                  <p className={`text-sm font-bold truncate ${selected ? "text-white" : "text-slate-200"}`}>
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <p className="text-xs text-slate-500 truncate">{doc.branchLabel}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hizmet secimi */}
      <div>
        <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          Hizmet / Tedavi Secin
        </h2>
        <div className="flex flex-wrap gap-2">
          {(showAll ? services : services.slice(0, 9)).map(srv => (
            <button
              key={srv}
              onClick={() => setSelectedService(srv)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                selectedService === srv
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-md shadow-indigo-400/30"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-indigo-400/40 hover:text-white"
              }`}
            >
              {srv}
            </button>
          ))}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 border border-white/10 bg-white/5 hover:text-white transition-all"
            >
              +{services.length - 9} daha <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Devam */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!selectedDoctor || !selectedService}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-400/30 hover:from-indigo-400 hover:to-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Devam Et <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
