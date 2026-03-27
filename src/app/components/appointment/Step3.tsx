import { useState } from "react";
import {
  AlertCircle, ArrowRight, ArrowLeft, MessageSquare, Star,
} from "lucide-react";

export interface FormData {
  name: string; surname: string; phone: string; email: string; note: string;
}

export function Step3({
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
    else if (!/^[0-9\s\+\-\(\)]{10,}$/.test(form.phone)) e.phone = "Ge\u00e7erli bir telefon girin";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Ge\u00e7erli e-posta girin";
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
        Ki\u015fisel Bilgileriniz
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("name", "Ad", "Ad\u0131n\u0131z")}
        {field("surname", "Soyad", "Soyad\u0131n\u0131z")}
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
          placeholder="\u00d6zel iste\u011finiz, sa\u011fl\u0131k durumunuz veya sormak istedikleriniz..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
        />
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
        <p className="text-indigo-300 text-sm">
          <Star className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
          Bilgileriniz yaln\u0131zca randevu onay\u0131 i\u00e7in kullan\u0131lacakt\u0131r. Randevunuz klini\u011fimiz taraf\u0131ndan
          onayland\u0131ktan sonra SMS/e-posta ile bilgilendirileceksiniz.
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
