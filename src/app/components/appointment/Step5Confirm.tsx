import { motion } from "motion/react";
import { StepHeader } from "./StepHeader";

interface DaySlot {
  label: string;
  date: string;
  slots: { time: string; type: string }[];
}

export function Step5Confirm({ firstName, setFirstName, lastName, setLastName, phone, setPhone, tckn, setTckn, email, setEmail,
  clinicLabel, serviceLabel, doctorLabel, displaySelectedDay, day, slot, error }: {
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  tckn: string; setTckn: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  clinicLabel: string; serviceLabel: string; doctorLabel: string;
  displaySelectedDay: DaySlot | undefined; day: string; slot: string;
  error: string;
}) {
  return (
    <div className="space-y-5">
      <StepHeader step={5} title="Bilgileriniz" sub="Son adım — onaylayın" />
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
        {[
          { l: "Klinik", v: clinicLabel },
          { l: "Hizmet", v: serviceLabel },
          { l: "Doktor", v: doctorLabel },
          { l: "Tarih",  v: `${displaySelectedDay?.label || day} – ${slot}` },
        ].map((r) => (
          <div key={r.l} className="flex justify-between text-sm">
            <span className="text-slate-400">{r.l}</span>
            <span className="text-slate-700 font-semibold">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Ad *" value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm" />
          <input type="text" placeholder="Soyad *" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm" />
        </div>
        <input type="tel" placeholder="Telefon Numarası *" value={phone} onChange={(e) => setPhone(e.target.value)}
          className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm" />
        <input type="text" placeholder="T.C. Kimlik No *" value={tckn} onChange={(e) => setTckn(e.target.value.replace(/\D/g, "").slice(0, 11))}
          maxLength={11}
          className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm" />
        <input type="email" placeholder="E-posta (opsiyonel)" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm" />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </motion.p>
      )}
      <p className="text-slate-400 text-xs leading-relaxed">
        Kişisel bilgileriniz yalnızca randevu onayı için kullanılır ve üçüncü taraflarla paylaşılmaz.
      </p>
    </div>
  );
}
