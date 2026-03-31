import { Check, Loader2 } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface MergedDoctor {
  ID: string;
  Name: string;
  Avatar: string;
  Title: string;
  Salon: string;
}

export function Step3Doctor({ doctorId, serviceLabel, filteredDoctors, loadingDoctors, doctorError, onSelect, onRetry }: {
  doctorId: string;
  serviceLabel: string;
  filteredDoctors: MergedDoctor[];
  loadingDoctors: boolean;
  doctorError: string;
  onSelect: (id: string) => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-4">
      <StepHeader step={3} title="Doktor Seçin" sub={`${serviceLabel} uzmanlarımız`} />
      {loadingDoctors ? (
        <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Doktorlar yükleniyor...
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDoctors.map((d) => (
            <button key={d.ID} onClick={() => onSelect(d.ID)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                doctorId === d.ID
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}>
              {d.Avatar ? (
                <img src={d.Avatar} alt={d.Name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-md">
                  {d.Name?.split(" ").slice(-1)[0]?.[0] || "?"}
                </div>
              )}
              <div className="flex-1">
                <p className={`font-bold text-sm ${doctorId === d.ID ? "text-indigo-700" : "text-slate-800"}`}>
                  {d.Title ? `${d.Title} ` : ""}{d.Name}
                </p>
                {d.Salon && <p className="text-slate-400 text-xs">{d.Salon}</p>}
              </div>
              {doctorId === d.ID && <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
            </button>
          ))}
          {filteredDoctors.length === 0 && !loadingDoctors && (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm">Doktor listesi yüklenemedi</p>
              {doctorError && <p className="text-red-400 text-xs mt-1">{doctorError}</p>}
              <button onClick={onRetry}
                className="mt-2 text-indigo-500 text-xs font-bold hover:underline">Tekrar dene</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
