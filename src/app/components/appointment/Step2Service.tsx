import { Check } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface TreatmentCategory {
  id: string;
  name: string;
  icon: string;
}

export function Step2Service({ serviceId, clinicLabel, filteredCategories, onChange }: {
  serviceId: string;
  clinicLabel: string;
  filteredCategories: TreatmentCategory[];
  onChange: (serviceId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <StepHeader step={2} title="Hizmet Seçin" sub={`${clinicLabel} · Mevcut hizmetler`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
        {filteredCategories.map((c) => (
          <button key={c.id} onClick={() => onChange(c.id)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all ${
              serviceId === c.id
                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
            }`}>
            {serviceId === c.id
              ? <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              : <span className="text-base flex-shrink-0">{c.icon || "🦷"}</span>}
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
