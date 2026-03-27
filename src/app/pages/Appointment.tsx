import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Calendar, Clock, User, Phone, Mail, ChevronLeft, ChevronRight,
  CheckCircle, MapPin, Stethoscope, ArrowRight, ArrowLeft, AlertCircle,
  MessageSquare, Star, ChevronDown
} from "lucide-react";
import { useTable } from "../hooks/useSupabase";
import type { Doctor, Service, Branch } from "@/lib/supabase";

/* ─── Fallback hizmetler (Supabase'den yüklenemezse) ── */
const FALLBACK_SERVICES = [
  "Genel Muayene", "Diş Temizliği", "Diş Beyazlatma", "Gülüş Tasarımı",
  "Zirkonyum Kaplama", "Lamine Veneer", "Dental İmplant", "Ortodonti / Braket",
  "Invisalign", "Kanal Tedavisi", "Diş Eti Tedavisi", "Çocuk Diş Hekimliği",
  "Kompozit Bonding", "All-on-4 / All-on-6", "Diğer",
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

// Bazı slotları dolu göster (demo)
const BUSY_SLOTS: Record<string, string[]> = {
  "0": ["09:00", "10:30", "14:00"],
  "1": ["09:30", "11:00", "15:00", "16:00"],
  "2": ["10:00", "13:00", "14:30"],
  "3": ["09:00", "11:30", "13:30"],
  "4": ["10:30", "15:30"],
  "5": [],
  "6": [],
};

const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

/* ─── Yardımcılar ────────────────────────────────────── */
function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // Pazartesi = 0
  const days: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function displayDate(y: number, m: number, d: number) {
  return `${d} ${MONTHS_TR[m]} ${y}`;
}

/* ─── Step göstergesi ────────────────────────────────── */
const STEPS = ["Doktor & Hizmet", "Tarih & Saat", "Bilgileriniz", "Onay"];

function StepBar({ current }: { current: number }) {
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

/* ─── Adım 1: Doktor & Hizmet ────────────────────────── */
function Step1({
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
      {/* Şube filtresi */}
      <div>
        <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          Doktor Seçin
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

      {/* Hizmet seçimi */}
      <div>
        <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          Hizmet / Tedavi Seçin
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

/* ─── Adım 2: Tarih & Saat ───────────────────────────── */
function Step2({
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  onNext, onBack,
}: {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = buildCalendar(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function isPast(d: number) {
    const date = new Date(viewYear, viewMonth, d);
    date.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  }
  function isSunday(d: number) {
    return new Date(viewYear, viewMonth, d).getDay() === 0;
  }

  const selectedDow = selectedDate
    ? String(new Date(selectedDate + "T12:00:00").getDay())
    : null;
  const busyToday = selectedDow ? (BUSY_SLOTS[selectedDow] ?? []) : [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Takvim */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-bold">
              {MONTHS_TR[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Gün başlıkları */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_TR.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 py-1">{d}</div>
            ))}
          </div>

          {/* Günler */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = formatDate(viewYear, viewMonth, day);
              const past = isPast(day);
              const sun = isSunday(day);
              const selected = selectedDate === dateStr;
              const disabled = past || sun;

              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                  className={`aspect-square rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                    selected
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-400/40"
                      : disabled
                        ? "text-slate-700 cursor-not-allowed"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-600 mt-3 text-center">
            Pazar günleri hizmet verilmemektedir.
          </p>
        </div>

        {/* Saat seçimi */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-white font-bold">
              {selectedDate
                ? displayDate(viewYear, viewMonth, parseInt(selectedDate.split("-")[2]))
                : "Önce tarih seçin"}
            </h3>
          </div>

          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
              <Calendar className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Saat seçmek için tarih seçin</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">Müsait saatler gösterilmektedir.</p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => {
                  const busy = busyToday.includes(slot);
                  const sel = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      disabled={busy}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        sel
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-400/30"
                          : busy
                            ? "bg-white/3 text-slate-700 cursor-not-allowed line-through"
                            : "bg-white/8 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs text-slate-500">Müsait</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="text-xs text-slate-500">Dolu</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-400/30 hover:from-indigo-400 hover:to-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Devam Et <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Adım 3: Kişisel Bilgiler ───────────────────────── */
interface FormData {
  name: string; surname: string; phone: string; email: string; note: string;
}

function Step3({
  form, setForm, onNext, onBack,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Ad zorunludur";
    if (!form.surname.trim()) e.surname = "Soyad zorunludur";
    if (!form.phone.trim()) e.phone = "Telefon zorunludur";
    else if (!/^[0-9\s\+\-\(\)]{10,}$/.test(form.phone)) e.phone = "Geçerli bir telefon girin";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Geçerli e-posta girin";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  const field = (
    key: keyof FormData,
    label: string,
    placeholder: string,
    type = "text",
    required = true
  ) => (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
        {label} {required && <span className="text-indigo-400">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-white/8 border text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
          errors[key] ? "border-red-500/60" : "border-white/15 focus:border-indigo-500/50"
        }`}
      />
      {errors[key] && (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
          <AlertCircle className="w-3 h-3" /> {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
        Kişisel Bilgileriniz
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("name", "Ad", "Adınız")}
        {field("surname", "Soyad", "Soyadınız")}
        {field("phone", "Telefon", "05XX XXX XX XX", "tel")}
        {field("email", "E-posta", "ornek@email.com", "email", false)}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
          Eklemek istedikleriniz
        </label>
        <textarea
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          placeholder="Özel isteğiniz, sağlık durumunuz veya sormak istedikleriniz..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
        />
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
        <p className="text-indigo-300 text-sm">
          <Star className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
          Bilgileriniz yalnızca randevu onayı için kullanılacaktır. Randevunuz kliniğimiz tarafından
          onaylandıktan sonra SMS/e-posta ile bilgilendirileceksiniz.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>
        <button onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-400/30 hover:from-indigo-400 hover:to-violet-500 transition-all">
          Randevuyu Onayla <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Adım 4: Özet & Onay ────────────────────────────── */
function Step4({
  doctor, service, date, time, form, onSubmit, onBack, submitting, submitted,
}: {
  doctor: Doctor;
  service: string;
  date: string;
  time: string;
  form: FormData;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitted: boolean;
}) {
  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-white mb-3" style={{ fontWeight: 800, fontSize: "1.75rem" }}>
          Randevunuz Alındı! 🎉
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-2">
          <strong className="text-white">{form.name} {form.surname}</strong>, randevu talebiniz başarıyla iletildi.
          Kliniğimiz en kısa sürede onay için sizi arayacak.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Onay SMS'i {form.phone} numarasına gönderilecektir.
        </p>

        <div className="inline-block bg-white/5 border border-white/10 rounded-2xl p-5 text-left mb-8 min-w-72">
          <p className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-3">Randevu Özeti</p>
          <div className="space-y-2">
            <Row icon={<User className="w-4 h-4" />} label={doctor.name} sub={doctor.specialty} />
            <Row icon={<MapPin className="w-4 h-4" />} label={doctor.branchLabel} />
            <Row icon={<Stethoscope className="w-4 h-4" />} label={service} />
            <Row icon={<Calendar className="w-4 h-4" />} label={new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })} />
            <Row icon={<Clock className="w-4 h-4" />} label={time} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/doktorlarimiz"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-slate-300 hover:text-white font-semibold text-sm transition-all hover:border-white/30">
            ← Doktorlara Dön
          </Link>
          <Link to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg transition-all hover:from-indigo-400 hover:to-violet-500">
            Ana Sayfaya Git
          </Link>
        </div>
      </div>
    );
  }

  const rows = [
    { icon: <User className="w-4 h-4" />, label: `${doctor.name} — ${doctor.title}`, sub: doctor.specialty },
    { icon: <MapPin className="w-4 h-4" />, label: doctor.branchLabel },
    { icon: <Stethoscope className="w-4 h-4" />, label: service },
    { icon: <Calendar className="w-4 h-4" />, label: new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }) },
    { icon: <Clock className="w-4 h-4" />, label: time },
    { icon: <Phone className="w-4 h-4" />, label: form.phone },
    { icon: <Mail className="w-4 h-4" />, label: form.email || "—" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
        Randevu Özeti & Onay
      </h2>

      {/* Doktor kartı mini */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 to-violet-600/15 border border-indigo-500/25">
        <img src={doctor.photo} alt={doctor.name}
          className="w-16 h-16 rounded-xl object-cover object-center flex-shrink-0" loading="lazy" decoding="async" width="64" height="64" />
        <div>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide">{doctor.specialty}</p>
          <p className="text-white font-bold">{doctor.name}</p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {doctor.branchLabel}
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/8">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5">
            <span className="text-indigo-400 mt-0.5 flex-shrink-0">{r.icon}</span>
            <div>
              <p className="text-white text-sm font-semibold">{r.label}</p>
              {r.sub && <p className="text-slate-500 text-xs">{r.sub}</p>}
            </div>
          </div>
        ))}
        {form.note && (
          <div className="flex items-start gap-3 px-5 py-3.5">
            <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-sm italic">"{form.note}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
          <ArrowLeft className="w-4 h-4" /> Geri
        </button>
        <button onClick={onSubmit} disabled={submitting}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-400/30 hover:from-indigo-400 hover:to-violet-500 transition-all disabled:opacity-70">
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Randevuyu Gönder
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-indigo-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-white text-sm font-semibold">{label}</p>
        {sub && <p className="text-slate-500 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Ana bileşen ────────────────────────────────────── */
export function Appointment() {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doktor");

  const [step, setStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState<FormData>({ name: "", surname: "", phone: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: DOCTORS, loading: doctorsLoading } = useTable<Doctor>("doctors", "sort_order");
  const { data: rawServices } = useTable<Service>("services", "sort_order");
  const { data: rawBranches } = useTable<Branch>("branches", "sort_order");

  const SERVICES = rawServices.length > 0
    ? rawServices.filter(s => s.is_active).map(s => s.title)
    : FALLBACK_SERVICES;

  const branchOptions = rawBranches.length > 0
    ? [{ id: "all", label: "Tüm Şubeler" }, ...rawBranches.filter(b => b.is_active).map(b => ({ id: b.slug, label: b.name }))]
    : [{ id: "all", label: "Tüm Şubeler" }, { id: "adana", label: "Adana Türkmenbaşı" }, { id: "istanbul", label: "İstanbul Nişantaşı" }];

  // URL'den doktor otomatik seç
  useEffect(() => {
    if (doctorId && DOCTORS.length > 0) {
      const found = DOCTORS.find(d => d.id === doctorId);
      if (found) setSelectedDoctor(found);
    }
  }, [doctorId, DOCTORS]);

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setStep(3);
    }, 1800);
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: "#0D1235" }}>
      {/* Arka plan dekorasyon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-sm font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            Online Randevu
          </div>
          <h1 className="text-white mb-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
            Randevu Alın
          </h1>
          <p className="text-slate-400">
            Doktorunuzu seçin, uygun tarihi belirleyin, anında randevu oluşturun.
          </p>
        </div>

        {/* Adım göstergesi */}
        {!submitted && <StepBar current={step} />}

        {/* Form kartı */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {step === 0 && (
            <Step1
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              onNext={() => setStep(1)}
              doctors={DOCTORS}
              services={SERVICES}
              branchOptions={branchOptions}
            />
          )}
          {step === 1 && (
            <Step2
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <Step3
              form={form}
              setForm={setForm}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && selectedDoctor && (
            <Step4
              doctor={selectedDoctor}
              service={selectedService}
              date={selectedDate}
              time={selectedTime}
              form={form}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
              submitting={submitting}
              submitted={submitted}
            />
          )}
        </div>

        {/* Alt bilgi */}
        {!submitted && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-xs text-slate-600">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> 0850 123 45 67</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> info@positivedental.com</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pzt – Cmt 09:00–18:00</span>
          </div>
        )}
      </div>
    </main>
  );
}
