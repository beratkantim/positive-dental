import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Calendar, Phone, Mail, Clock } from "lucide-react";
import { useTable } from "../hooks/useSupabase";
import { SEO } from "../components/SEO";
import type { Doctor, Service, Branch } from "@/lib/supabase";
import { StepBar } from "../components/appointment/StepBar";
import { Step1 } from "../components/appointment/Step1";
import { Step2 } from "../components/appointment/Step2";
import { Step3 } from "../components/appointment/Step3";
import type { FormData } from "../components/appointment/Step3";
import { Step4 } from "../components/appointment/Step4";

/* --- Fallback hizmetler (Supabase'den yuklenemezse) --- */
const FALLBACK_SERVICES = [
  "Genel Muayene", "Di\u015f Temizli\u011fi", "Di\u015f Beyazlatma", "G\u00fcl\u00fc\u015f Tasar\u0131m\u0131",
  "Zirkonyum Kaplama", "Lamine Veneer", "Dental \u0130mplant", "Ortodonti / Braket",
  "Invisalign", "Kanal Tedavisi", "Di\u015f Eti Tedavisi", "\u00c7ocuk Di\u015f Hekimli\u011fi",
  "Kompozit Bonding", "All-on-4 / All-on-6", "Di\u011fer",
];

/* --- Ana bilesen --- */
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
    ? [{ id: "all", label: "T\u00fcm \u015eubeler" }, ...rawBranches.filter(b => b.is_active).map(b => ({ id: b.slug, label: b.name }))]
    : [{ id: "all", label: "T\u00fcm \u015eubeler" }, { id: "adana", label: "Adana T\u00fcrkmenba\u015f\u0131" }, { id: "istanbul", label: "\u0130stanbul Ni\u015fanta\u015f\u0131" }];

  // URL'den doktor otomatik sec
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
    <>
    <SEO
      title="Online Randevu Al"
      description="Positive Dental Studio online randevu sistemi. Doktorunuzu seçin, uygun tarihi belirleyin, anında randevu oluşturun."
      url="/randevu"
      keywords={["diş randevu", "online randevu", "diş hekimi randevu", "diş kliniği randevu"]}
      schemaType="dental"
      noindex
    />
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: "#0D1235" }}>
      {/* Arka plan dekorasyon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Baslik */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-sm font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            Online Randevu
          </div>
          <h1 className="text-white mb-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
            Randevu Al\u0131n
          </h1>
          <p className="text-slate-400">
            Doktorunuzu se\u00e7in, uygun tarihi belirleyin, an\u0131nda randevu olu\u015fturun.
          </p>
        </div>

        {/* Adim gostergesi */}
        {!submitted && <StepBar current={step} />}

        {/* Form karti */}
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
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pzt \u2013 Cmt 09:00\u201318:00</span>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
