import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, ChevronRight, ChevronLeft, Check,
  MapPin, Stethoscope, UserRound, CalendarDays, CheckCircle2, X,
} from "lucide-react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const CLINICS = [
  "İstanbul – Nişantaşı",
  "Adana – Türkmenbaşı",
];

const SERVICES: Record<string, string[]> = {
  "İstanbul – Nişantaşı":  ["Estetik Diş Hekimliği", "İmplant", "Ortodonti", "Genel Muayene", "Lamine Tedavisi", "Dijital Anestezi", "Gülüş Tasarımı (DSD)", "Çocuk Diş Hekimliği"],
  "Adana – Türkmenbaşı":   ["Estetik Diş Hekimliği", "İmplant", "Ortodonti", "Genel Muayene", "Protez & Zirkonyum", "Çocuk Diş Hekimliği", "Diş Beyazlatma"],
};

const DOCTORS: Record<string, string[]> = {
  "Estetik Diş Hekimliği": ["Dr. Ayşe Yılmaz", "Dr. Zeynep Demir"],
  "İmplant":               ["Dr. Mehmet Kaya", "Dr. Ali Şahin"],
  "Ortodonti":             ["Dr. Zeynep Demir", "Dr. Selin Arslan"],
  "Genel Muayene":         ["Dr. Emre Çelik", "Dr. Fatma Kara", "Dr. Berk Öztürk"],
  "Lamine Tedavisi":       ["Dr. Ayşe Yılmaz", "Dr. Emre Çelik"],
  "Dijital Anestezi":      ["Dr. Berk Öztürk", "Dr. Fatma Kara"],
  "Gülüş Tasarımı (DSD)":  ["Dr. Berk Öztürk", "Dr. Emre Çelik"],
  "Protez & Zirkonyum":    ["Dr. Ali Şahin", "Dr. Fatma Kara"],
  "Çocuk Diş Hekimliği":  ["Dr. Selin Arslan", "Dr. Fatma Kara"],
  "Diş Beyazlatma":        ["Dr. Ali Şahin", "Dr. Fatma Kara"],
};

function getAvailableDays() {
  const days: { label: string; date: string; slots: string[] }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 10) {
    const day = d.getDay();
    if (day !== 0) {
      const slots = day === 6
        ? ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"]
        : ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
      days.push({
        label: d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }),
        date: d.toISOString().split("T")[0],
        slots,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const AVAILABLE_DAYS = getAvailableDays();

const STEPS = [
  { id: 1, label: "Klinik",  icon: MapPin },
  { id: 2, label: "Hizmet",  icon: Stethoscope },
  { id: 3, label: "Doktor",  icon: UserRound },
  { id: 4, label: "Tarih",   icon: CalendarDays },
  { id: 5, label: "Onayla",  icon: CheckCircle2 },
];

// ── DROPDOWN ─────────────────────────────────────────────────────────────────

function Dropdown({ placeholder, value, options, onChange }: {
  placeholder: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all shadow-sm"
      >
        <span className={value ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/80"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-5 py-3.5 text-sm transition-colors flex items-center justify-between ${
                  value === opt
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {opt}
                {value === opt && <Check className="w-4 h-4 text-indigo-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── STEP HEADER ──────────────────────────────────────────────────────────────

function StepHeader({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-black text-indigo-500 tracking-widest uppercase">Adım {step}/5</span>
      <h3 className="font-display text-xl font-black text-slate-900 mt-1">{title}</h3>
      <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [clinic,  setClinic]  = useState("");
  const [service, setService] = useState("");
  const [doctor,  setDoctor]  = useState("");
  const [day,     setDay]     = useState("");
  const [slot,    setSlot]    = useState("");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [done,    setDone]    = useState(false);

  const canNext = () => {
    if (step === 1) return !!clinic;
    if (step === 2) return !!service;
    if (step === 3) return !!doctor;
    if (step === 4) return !!day && !!slot;
    if (step === 5) return name.trim().length > 1 && phone.trim().length > 9;
    return false;
  };

  const handleNext = () => { if (step < 5) setStep(step + 1); else setDone(true); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const reset = () => {
    setStep(1); setClinic(""); setService(""); setDoctor("");
    setDay(""); setSlot(""); setName(""); setPhone(""); setDone(false);
  };

  const selectedDay = AVAILABLE_DAYS.find((d) => d.date === day);
  const serviceOptions = clinic ? SERVICES[clinic] ?? [] : [];
  const doctorOptions  = DOCTORS[service] ?? [];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Hızlı Randevu</span>
          <h2 className="font-display text-5xl sm:text-6xl font-black text-slate-900 leading-[0.92] tracking-tight">
            Online
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Randevu.
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-sm">5 adımda hızlıca randevunu oluştur</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-8 px-2">
          {STEPS.map((s, i) => {
            const isDone   = step > s.id;
            const isActive = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <motion.div
                    animate={{
                      background: isDone
                        ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                        : isActive
                        ? "linear-gradient(135deg,#eef2ff,#ede9fe)"
                        : "#f8fafc",
                      borderColor: isDone
                        ? "transparent"
                        : isActive
                        ? "#818cf8"
                        : "#e2e8f0",
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                  >
                    {isDone
                      ? <Check className="w-4 h-4 text-white" />
                      : <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    }
                  </motion.div>
                  <span className={`text-xs font-bold hidden sm:block ${
                    isActive ? "text-indigo-600" : isDone ? "text-indigo-400" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 relative overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/80 overflow-hidden">

          <AnimatePresence mode="wait">
            {done ? (
              /* ── SUCCESS ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="font-display text-3xl font-black text-slate-900 mb-2">Randevunuz Alındı!</h3>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                  SMS ve e-posta onayı gönderildi.<br />
                  <span className="text-slate-700 font-semibold">{name}</span> · <span className="text-indigo-600 font-semibold">{clinic}</span>
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2.5 mb-6">
                  {[
                    { l: "Klinik", v: clinic  },
                    { l: "Hizmet", v: service },
                    { l: "Doktor", v: doctor  },
                    { l: "Tarih",  v: `${selectedDay?.label} – ${slot}` },
                  ].map((r) => (
                    <div key={r.l} className="flex justify-between text-sm">
                      <span className="text-slate-400">{r.l}</span>
                      <span className="text-slate-800 font-semibold">{r.v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={reset}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-4 h-4" /> Yeni Randevu Al
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="p-8"
              >

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    <StepHeader step={1} title="Klinik Seçin" sub="Size en yakın kliniği seçin" />
                    <Dropdown
                      placeholder="Klinik Seç"
                      value={clinic}
                      options={CLINICS}
                      onChange={(v) => { setClinic(v); setService(""); setDoctor(""); }}
                    />
                    {clinic && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-indigo-500 text-sm flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {clinic} seçildi
                      </motion.p>
                    )}
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <StepHeader step={2} title="Hizmet Seçin" sub={`${clinic} · Mevcut hizmetler`} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {serviceOptions.map((s) => (
                        <button key={s} onClick={() => { setService(s); setDoctor(""); }}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                            service === s
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          {service === s
                            ? <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            : <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                          }
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ── */}
                {step === 3 && (
                  <div className="space-y-4">
                    <StepHeader step={3} title="Doktor Seçin" sub={`${service} uzmanlarımız`} />
                    <div className="space-y-2">
                      {doctorOptions.map((d) => (
                        <button key={d} onClick={() => setDoctor(d)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                            doctor === d
                              ? "bg-indigo-50 border-indigo-300"
                              : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-md">
                            {d.split(" ").slice(-1)[0][0]}
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold text-sm ${doctor === d ? "text-indigo-700" : "text-slate-800"}`}>{d}</p>
                            <p className="text-slate-400 text-xs">{service}</p>
                          </div>
                          {doctor === d && <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 4 ── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <StepHeader step={4} title="Tarih & Saat" sub={`${doctor} · Müsait günler`} />
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {AVAILABLE_DAYS.map((d) => (
                        <button key={d.date} onClick={() => { setDay(d.date); setSlot(""); }}
                          className={`flex-shrink-0 flex flex-col items-center px-3 py-3 rounded-xl border text-xs transition-all ${
                            day === d.date
                              ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                          }`}
                        >
                          <span className="font-black text-sm leading-none mb-1">{d.label.split(" ")[1]}</span>
                          <span className="capitalize opacity-70">{d.label.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                    {day && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">Saat Seçin</p>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                          {selectedDay?.slots.map((s) => (
                            <button key={s} onClick={() => setSlot(s)}
                              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                slot === s
                                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-md shadow-indigo-200"
                                  : "bg-white border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ── STEP 5 ── */}
                {step === 5 && (
                  <div className="space-y-5">
                    <StepHeader step={5} title="Bilgileriniz" sub="Son adım — onaylayın" />
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      {[
                        { l: "Klinik", v: clinic  },
                        { l: "Hizmet", v: service },
                        { l: "Doktor", v: doctor  },
                        { l: "Tarih",  v: `${selectedDay?.label} – ${slot}` },
                      ].map((r) => (
                        <div key={r.l} className="flex justify-between text-sm">
                          <span className="text-slate-400">{r.l}</span>
                          <span className="text-slate-700 font-semibold">{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Ad Soyad"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Telefon Numarası"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-400 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-sm"
                      />
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Kişisel bilgileriniz yalnızca randevu onayı için kullanılır ve üçüncü taraflarla paylaşılmaz.
                    </p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer nav */}
          {!done && (
            <div className="px-8 pb-7 flex items-center gap-3">
              {step > 1 && (
                <button onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-sm font-bold transition-all">
                  <ChevronLeft className="w-4 h-4" /> Geri
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all ${
                  canNext()
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02]"
                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {step === 5 ? (
                  <><CheckCircle2 className="w-4 h-4" /> Randevuyu Onayla</>
                ) : (
                  <>Devam Et <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Alt bilgi */}
        <p className="mt-6 text-center text-slate-400 text-xs">
          Telefonla randevu: &nbsp;
          <a href="tel:+908501234567" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            0850 123 45 67
          </a>
          &nbsp;· Pzt – Cmt 09:00–20:00
        </p>

      </div>
    </section>
  );
}