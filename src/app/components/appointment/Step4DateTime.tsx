import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface DaySlot {
  label: string;
  date: string;
  slots: { time: string; type: string }[];
}

export function Step4DateTime({ day, setDay, slot, setSlot, displayDays, displaySelectedDay, doctorLabel, loadingSlots }: {
  day: string;
  setDay: (d: string) => void;
  slot: string;
  setSlot: (s: string) => void;
  displayDays: DaySlot[];
  displaySelectedDay: DaySlot | undefined;
  doctorLabel: string;
  loadingSlots: boolean;
}) {
  return (
    <div className="space-y-5">
      <StepHeader step={4} title="Tarih & Saat" sub={`${doctorLabel} · Müsait günler`} />
      {loadingSlots ? (
        <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Müsait saatler yükleniyor...
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {displayDays.map((d) => (
              <button key={d.date} onClick={() => { setDay(d.date); setSlot(""); }}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-3 rounded-xl border text-xs transition-all ${
                  day === d.date
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                }`}>
                <span className="font-black text-sm leading-none mb-1">{d.label.split(" ")[1]}</span>
                <span className="capitalize opacity-70">{d.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          {day && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">Saat Seçin</p>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {displaySelectedDay?.slots.map((s) => {
                  const isAvailable = s.type === "Available";
                  const isSelected = slot === s.time && isAvailable;
                  return (
                    <button key={s.time}
                      onClick={() => isAvailable && setSlot(s.time)}
                      disabled={!isAvailable}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-md shadow-indigo-200"
                          : isAvailable
                            ? "bg-white border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                            : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed line-through"
                      }`}>
                      {s.time}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
