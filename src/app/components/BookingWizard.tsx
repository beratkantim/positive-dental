import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, ChevronRight, ChevronLeft, Check,
  MapPin, Stethoscope, UserRound, CalendarDays, CheckCircle2, X, Loader2,
} from "lucide-react";
import { useTable } from "../hooks/useSupabase";
import type { Branch, Doctor as SupabaseDoctor } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { getDoctors, getDoctorSlots, createAppointment, type DentsoftDoctor } from "@/lib/dentsoft";

interface TreatmentCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

// ── STEPS ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Klinik",  icon: MapPin },
  { id: 2, label: "Hizmet",  icon: Stethoscope },
  { id: 3, label: "Doktor",  icon: UserRound },
  { id: 4, label: "Tarih",   icon: CalendarDays },
  { id: 5, label: "Onayla",  icon: CheckCircle2 },
];

// ── DROPDOWN ─────────────────────────────────────────────────────────────────

function Dropdown({ placeholder, value, options, onChange }: {
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
  // Supabase data
  const { data: branches } = useTable<Branch>("branches", "sort_order");
  const { data: categories } = useTable<TreatmentCategory>("treatment_categories", "sort_order");
  const { data: supabaseDoctors } = useTable<SupabaseDoctor>("doctors", "sort_order");

  const activeBranches = branches.filter(b => b.is_active);
  const activeCategories = categories.filter(c => c.is_active);

  // Mode: yetişkin / çocuk
  const [mode, setMode] = useState<"yetiskin" | "cocuk">("yetiskin");

  // Kategorileri mode'a göre filtrele
  const filteredCategories = activeCategories.filter(c =>
    mode === "cocuk" ? (c.slug === "pedodonti" || c.slug === "ortodonti") : (c.slug !== "pedodonti")
  );

  // Wizard state
  const [step, setStep] = useState(1);
  const [clinicId, setClinicId]   = useState("");
  const [serviceId, setServiceId] = useState("");
  const [doctorId, setDoctorId]   = useState("");
  const [day, setDay]     = useState("");
  const [slot, setSlot]   = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone] = useState("");
  const [tckn, setTckn]   = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Dentsoft data
  const [dsDoctors, setDsDoctors] = useState<DentsoftDoctor[]>([]);
  const [dsSlots, setDsSlots]     = useState<any>(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [doctorError, setDoctorError] = useState("");

  // Derived
  const selectedBranch  = activeBranches.find(b => b.id === clinicId);
  const selectedCategory = activeCategories.find(c => c.id === serviceId);
  const selectedDoctor = dsDoctors.find(d => d.ID === doctorId);

  // Supabase doktorlarından dentsoft_id eşleşme haritası (string key)
  const sbDoctorMap = new Map(
    supabaseDoctors.filter(d => d.dentsoft_id).map(d => [String(d.dentsoft_id), d])
  );

  // Eşleştirilmiş doktor listesi: Dentsoft verisi + Supabase zengin bilgi
  const mergedDoctors = dsDoctors.map(ds => {
    const sb = sbDoctorMap.get(String(ds.ID));
    return {
      ...ds,
      Avatar: sb?.photo || ds.Avatar || "",
      Name: sb?.name || ds.Name,
      Title: sb?.title || ds.Title || "",
      Salon: sb?.specialty || ds.Salon || "",
      _branches: sb?.branches || [],
      _serviceIds: sb?.service_ids || [],
    };
  });

  // Şube + tedavi filtresi
  const branchSlug = selectedBranch?.slug?.toLowerCase() || "";
  const branchShort = branchSlug.split("-")[0] || "";
  const branchCity = selectedBranch?.city?.toLowerCase() || "";

  // Doktorları şube + tedavi filtresine göre filtrele
  const filteredDoctors = mergedDoctors.filter(d => {
    // Şube filtresi: doktorun branches'inde seçilen klinik slug'ı var mı
    const branchMatch = !d._branches?.length || d._branches.includes(branchSlug) || d._branches.includes(branchShort) || d._branches.includes(branchCity);
    // Tedavi filtresi: doktorun service_ids'inde seçilen kategori var mı (veya allServices=true ise service_ids boş)
    const serviceMatch = !d._serviceIds?.length || d._serviceIds.includes(serviceId);
    return branchMatch && serviceMatch;
  });

  // ── Dentsoft: Doktor listesini çek ─────────────────────────────────────
  useEffect(() => {
    if (step !== 3 || dsDoctors.length > 0) return;
    setLoadingDoctors(true);
    setDoctorError("");
    getDoctors()
      .then(docs => setDsDoctors(docs || []))
      .catch(err => setDoctorError(err.message || "Doktor listesi yüklenemedi"))
      .finally(() => setLoadingDoctors(false));
  }, [step]);

  // ── Dentsoft: Doktor slotlarını çek ────────────────────────────────────
  useEffect(() => {
    if (!doctorId || step !== 4) return;
    setLoadingSlots(true);
    setDsSlots(null);
    // 2 ay ileri tarih aralığı sor
    const rangeEnd = new Date();
    rangeEnd.setMonth(rangeEnd.getMonth() + 2);
    const rangeStr = `${rangeEnd.getFullYear()}/${String(rangeEnd.getMonth()+1).padStart(2,"0")}/${String(rangeEnd.getDate()).padStart(2,"0")}`;
    getDoctorSlots(doctorId, { range: rangeStr })
      .then(setDsSlots)
      .catch(err => console.error("Dentsoft slot hatası:", err))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, step]);

  // Slotlardan günleri parse et — Available + NotAvailable birlikte
  const availableDays = useCallback(() => {
    if (!dsSlots) return [];
    // Response array olarak gelir — seçilen doktorun slotlarını bul
    let slotData: Record<string, any[]> | null = null;
    if (Array.isArray(dsSlots)) {
      const doctorEntry = dsSlots.find((d: any) => d.User?.ID === doctorId);
      slotData = doctorEntry?.Slot || null;
    } else {
      slotData = dsSlots.Slot || null;
    }
    if (!slotData) return [];
    const days: { label: string; date: string; slots: { time: string; type: string }[] }[] = [];

    for (const [dateStr, dateSlots] of Object.entries(slotData)) {
      if (!Array.isArray(dateSlots)) continue;
      // En az 1 Available slot olan günleri göster
      const hasAvailable = (dateSlots as any[]).some(s => s.Type === "Available");
      if (!hasAvailable) continue;

      const d = new Date(dateStr + "T00:00:00");
      days.push({
        date: dateStr,
        label: d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }),
        // Dentsoft'ta saat s.Time.Begin şeklinde geliyor
        slots: (dateSlots as any[]).map(s => ({
          time: s.Time?.Begin?.substring(0, 5) || s.Begin?.substring(0, 5) || "",
          type: s.Type || "NotAvailable",
        })).filter(s => s.time),
      });
    }

    days.sort((a, b) => a.date.localeCompare(b.date));
    return days.slice(0, 14);
  }, [dsSlots]);

  const daysList = availableDays();
  const selectedDay = daysList.find(d => d.date === day);

  // Fallback: Dentsoft slotları gelmezse statik saatler
  const fallbackDays = useCallback(() => {
    const days: { label: string; date: string; slots: { time: string; type: string }[] }[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (days.length < 10) {
      const dow = d.getDay();
      if (dow !== 0) {
        const times = dow === 6
          ? ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"]
          : ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
        days.push({
          label: d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }),
          date: d.toISOString().split("T")[0],
          slots: times.map(t => ({ time: t, type: "Available" })),
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, []);

  const displayDays = daysList.length > 0 ? daysList : fallbackDays();
  const displaySelectedDay = displayDays.find(d => d.date === day);

  // ── Randevu oluştur ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      // Tarih formatı: YYYY-MM-DD (Dentsoft bu formatı istiyor)
      // Note alanına seçilen tedavi kategorisini yaz
      const noteText = `Online Randevu — ${serviceLabel || "Genel Muayene"}`;

      const dsResult = await createAppointment(doctorId, {
        BeginTime: slot,
        Date: day,
        PatientFirstName: firstName.trim(),
        PatientLastName: lastName.trim(),
        ContactRegion: "90",
        ContactMobile: phone.replace(/\D/g, ""),
        PatientNumber: tckn.trim(),
        ContactEmail: email.trim() || undefined,
        Note: noteText,
      });

      // Supabase'e de kaydet — admin panelde görünsün
      try {
        const selectedDoctor = mergedDoctors.find(d => d.ID === doctorId);
        await supabase.from("appointments").insert({
          dentsoft_id: dsResult?.Appointment?.ID || null,
          dentsoft_pnr: dsResult?.Appointment?.PNR || null,
          branch_id: clinicId || null,
          branch_name: selectedBranch?.name || "",
          doctor_name: selectedDoctor?.Name || "",
          doctor_dentsoft_id: doctorId,
          treatment_category: serviceLabel || "",
          appointment_date: day,
          appointment_time: slot,
          patient_first_name: firstName.trim(),
          patient_last_name: lastName.trim(),
          patient_phone: phone.replace(/\D/g, ""),
          patient_tckn: tckn.trim(),
          patient_email: email.trim() || null,
          status: "confirmed",
          source: "website",
        });
      } catch (sbErr) {
        // Supabase kaydı başarısız olsa bile randevu Dentsoft'ta oluştu
        console.warn("Supabase randevu kaydı başarısız:", sbErr);
      }

      setDone(true);
    } catch (err: any) {
      console.error("Randevu oluşturma hatası:", err);
      setError(err.message || "Randevu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) return !!clinicId;
    if (step === 2) return !!serviceId;
    if (step === 3) return !!doctorId;
    if (step === 4) return !!day && !!slot;
    if (step === 5) return firstName.trim().length > 1 && lastName.trim().length > 1 && phone.trim().length > 9 && tckn.trim().length >= 11;
    return false;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else handleSubmit();
  };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const reset = () => {
    setStep(1); setClinicId(""); setServiceId(""); setDoctorId("");
    setDay(""); setSlot(""); setFirstName(""); setLastName(""); setPhone(""); setTckn(""); setEmail("");
    setDone(false); setError(""); setDsSlots(null);
  };

  const clinicLabel  = selectedBranch?.name || "";
  const serviceLabel = selectedCategory?.name || "";
  const doctorLabel  = selectedDoctor?.Name || "";

  return (
    <section id="randevu" className={`pt-6 pb-8 sm:pt-10 sm:pb-12 relative overflow-hidden transition-colors duration-500 ${
      mode === "cocuk" ? "bg-pink-50/50" : "bg-white"
    }`}>
      <div className={`absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none hidden md:block transition-colors duration-500 ${
        mode === "cocuk" ? "bg-pink-200/50" : "bg-indigo-100/50"
      }`} />
      <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none hidden md:block transition-colors duration-500 ${
        mode === "cocuk" ? "bg-violet-200/50" : "bg-violet-100/50"
      }`} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className={`inline-block text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-300 ${
            mode === "cocuk" ? "text-pink-400" : "text-indigo-400"
          }`}>{mode === "cocuk" ? "Çocuk Randevusu" : "Hızlı Randevu"}</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-800 leading-[0.95] tracking-tight">
            Online<br />
            <span className={`bg-clip-text text-transparent transition-all duration-300 ${
              mode === "cocuk"
                ? "bg-gradient-to-r from-pink-400 to-violet-400"
                : "bg-gradient-to-r from-indigo-400 to-violet-500"
            }`}>Randevu.</span>
          </h2>
          <p className="text-slate-400 mt-4 text-sm">5 adımda hızlıca randevunu oluştur</p>
        </div>

        {/* Randevu Tipi Seçimi */}
        <div className="flex items-center justify-center gap-1 mb-8 bg-slate-100 rounded-2xl p-1 max-w-xs mx-auto">
          <button
            onClick={() => { if (mode !== "yetiskin") { setMode("yetiskin"); reset(); } }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              mode === "yetiskin"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🦷 Yetişkin
          </button>
          <button
            onClick={() => { if (mode !== "cocuk") { setMode("cocuk"); reset(); } }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              mode === "cocuk"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            👶 Çocuk
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-8 px-2">
          {STEPS.map((s, i) => {
            const isDone = step > s.id;
            const isActive = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <motion.div
                    animate={{
                      background: isDone ? "linear-gradient(135deg,#6366f1,#7c3aed)" : isActive ? "linear-gradient(135deg,#eef2ff,#ede9fe)" : "#f8fafc",
                      borderColor: isDone ? "transparent" : isActive ? "#818cf8" : "#e2e8f0",
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                  >
                    {isDone ? <Check className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />}
                  </motion.div>
                  <span className={`text-xs font-bold hidden sm:block ${isActive ? "text-indigo-600" : isDone ? "text-indigo-400" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 relative overflow-hidden rounded-full bg-slate-200">
                    <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: step > s.id ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
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
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="font-display text-3xl font-black text-slate-900 mb-2">Randevunuz Alındı!</h3>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                  SMS ve e-posta onayı gönderildi.<br />
                  <span className="text-slate-700 font-semibold">{firstName} {lastName}</span> · <span className="text-indigo-600 font-semibold">{clinicLabel}</span>
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2.5 mb-6">
                  {[
                    { l: "Klinik", v: clinicLabel },
                    { l: "Hizmet", v: serviceLabel },
                    { l: "Doktor", v: doctorLabel },
                    { l: "Tarih",  v: `${displaySelectedDay?.label || day} – ${slot}` },
                  ].map((r) => (
                    <div key={r.l} className="flex justify-between text-sm">
                      <span className="text-slate-400">{r.l}</span>
                      <span className="text-slate-800 font-semibold">{r.v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-4 h-4" /> Yeni Randevu Al
                </button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }} className="p-8">

                {/* ── STEP 1: KLİNİK ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    <StepHeader step={1} title="Klinik Seçin" sub="Size en yakın kliniği seçin" />
                    <Dropdown placeholder="Klinik Seç" value={clinicId}
                      options={activeBranches.map(b => ({ label: b.name, value: b.id }))}
                      onChange={(v) => { setClinicId(v); setServiceId(""); setDoctorId(""); setDsDoctors([]); }} />
                    {clinicLabel && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-indigo-500 text-sm flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {clinicLabel} seçildi
                      </motion.p>
                    )}
                  </div>
                )}

                {/* ── STEP 2: HİZMET ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <StepHeader step={2} title="Hizmet Seçin" sub={`${clinicLabel} · Mevcut hizmetler`} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {filteredCategories.map((c) => (
                        <button key={c.id} onClick={() => { setServiceId(c.id); setDoctorId(""); }}
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
                )}

                {/* ── STEP 3: DOKTOR (Dentsoft) ── */}
                {step === 3 && (
                  <div className="space-y-4">
                    <StepHeader step={3} title="Doktor Seçin" sub={`${serviceLabel} uzmanlarımız`} />
                    {loadingDoctors ? (
                      <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" /> Doktorlar yükleniyor...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredDoctors.map((d) => (
                          <button key={d.ID} onClick={() => setDoctorId(d.ID)}
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
                            <button onClick={() => { setDsDoctors([]); setDoctorError(""); }}
                              className="mt-2 text-indigo-500 text-xs font-bold hover:underline">Tekrar dene</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 4: TARİH & SAAT ── */}
                {step === 4 && (
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
                )}

                {/* ── STEP 5: BİLGİLER & ONAYLA ── */}
                {step === 5 && (
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
              <button onClick={handleNext} disabled={!canNext() || submitting}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all ${
                  canNext() && !submitting
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02]"
                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                }`}>
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Randevu oluşturuluyor...</>
                ) : step === 5 ? (
                  <><CheckCircle2 className="w-4 h-4" /> Randevuyu Onayla</>
                ) : (
                  <>Devam Et <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-slate-400 text-xs">
          Telefonla randevu: &nbsp;
          <a href="tel:+908501234567" title="Hemen ara: 0850 123 45 67" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            0850 123 45 67
          </a>
          &nbsp;· Pzt – Cmt 09:00–20:00
        </p>
      </div>

    </section>
  );
}
