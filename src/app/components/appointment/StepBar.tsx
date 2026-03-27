import { CheckCircle } from "lucide-react";

const STEPS = ["Doktor & Hizmet", "Tarih & Saat", "Bilgileriniz", "Onay"];

export function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 px-4">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              i < current
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-lg shadow-indigo-300/40"
                : i === current
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                  : "border-slate-700 text-slate-600 bg-transparent"
            }`}>
              {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`mt-1.5 text-[11px] font-semibold whitespace-nowrap ${
              i === current ? "text-indigo-400" : i < current ? "text-indigo-300" : "text-slate-600"
            }`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 rounded-full transition-all ${
              i < current ? "bg-gradient-to-r from-indigo-500 to-violet-600" : "bg-slate-700"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
