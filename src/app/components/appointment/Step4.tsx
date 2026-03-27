import { Link } from "react-router";
import {
  Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope,
  CheckCircle, ArrowLeft, MessageSquare,
} from "lucide-react";
import type { Doctor } from "@/lib/supabase";
import type { FormData } from "./Step3";

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

export function Step4({
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
          Randevunuz Al\u0131nd\u0131! \ud83c\udf89
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-2">
          <strong className="text-white">{form.name} {form.surname}</strong>, randevu talebiniz ba\u015far\u0131yla iletildi.
          Klini\u011fimiz en k\u0131sa s\u00fcrede onay i\u00e7in sizi arayacak.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Onay SMS'i {form.phone} numaras\u0131na g\u00f6nderilecektir.
        </p>

        <div className="inline-block bg-white/5 border border-white/10 rounded-2xl p-5 text-left mb-8 min-w-72">
          <p className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-3">Randevu \u00d6zeti</p>
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
            \u2190 Doktorlara D\u00f6n
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
    { icon: <User className="w-4 h-4" />, label: `${doctor.name} \u2014 ${doctor.title}`, sub: doctor.specialty },
    { icon: <MapPin className="w-4 h-4" />, label: doctor.branchLabel },
    { icon: <Stethoscope className="w-4 h-4" />, label: service },
    { icon: <Calendar className="w-4 h-4" />, label: new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }) },
    { icon: <Clock className="w-4 h-4" />, label: time },
    { icon: <Phone className="w-4 h-4" />, label: form.phone },
    { icon: <Mail className="w-4 h-4" />, label: form.email || "\u2014" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
        Randevu \u00d6zeti & Onay
      </h2>

      {/* Doktor karti mini */}
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
              G\u00f6nderiliyor...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Randevuyu G\u00f6nder
            </>
          )}
        </button>
      </div>
    </div>
  );
}
