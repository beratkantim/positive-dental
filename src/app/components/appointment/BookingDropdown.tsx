import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";

export function BookingDropdown({ placeholder, value, options, onChange }: {
  placeholder: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all shadow-sm">
        <span className={selected ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/80 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-5 py-3.5 text-sm transition-colors flex items-center justify-between ${
                  value === opt.value ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4 text-indigo-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
