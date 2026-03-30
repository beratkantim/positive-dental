import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, Phone, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTable } from "../../hooks/useSupabase";
import type { Doctor } from "@/lib/supabase";

const BOOKING_URL = "/online-randevu";

export function AboutTeam({
  eeat,
}: {
  eeat: {
    faq: { q: string; a: string }[];
    company: {
      unvan: string;
      vergi_dairesi: string;
      vergi_no: string;
      ticaret_sicil: string;
      tescil_tarihi: string;
      mersis_no: string;
      merkez: string;
    };
  };
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: allDoctors, loading } = useTable<Doctor>("doctors", "sort_order");

  const managers = allDoctors.filter(d => d.is_active && d.is_manager);

  return (
    <>
      {/* TEAM */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Ekibimiz</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Uzman{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">kadromuz.</span>
            </h2>
            <p className="text-slate-500 mt-4">Alanında uzman, deneyimli hekimlerimiz</p>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[0, 1, 2].map(i => (
                <div key={i} className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="h-72 bg-slate-200" />
                  <div className="p-5 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : managers.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
              {managers.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group min-w-[280px] sm:min-w-[320px] flex-shrink-0 snap-start bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 transition-all"
                >
                  <Link to={`/doktorlarimiz/${doctor.slug}`}>
                    <div className="relative overflow-hidden h-72">
                      <ImageWithFallback
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={400}
                        height={288}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold rounded-full">
                          {doctor.specialty}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-slate-900">{doctor.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{doctor.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* EEAT -- FAQ + Company Info */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Sıkça Sorulan Sorular</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Merak Edilenler</h2>
          </div>

          <div className="space-y-3 mb-16">
            {eeat.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-slate-800 pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Şirket Bilgileri</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                ["Şirket Ünvanı", eeat.company.unvan],
                ["Vergi Dairesi", eeat.company.vergi_dairesi],
                ["Vergi No", eeat.company.vergi_no],
                ["Ticaret Sicil No", eeat.company.ticaret_sicil],
                ["Kuruluş Yılı", eeat.company.tescil_tarihi],
                ["Mersis No", eeat.company.mersis_no],
                ["Merkez", eeat.company.merkez],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">{label}</dt>
                  <dd className="text-slate-800 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-[#0D1235] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-5">Seni Bekliyoruz</span>
          <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Gülüşünü
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">bizimle başlat.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Online randevu al, beklemeden gel. İlk muayene değerlendirmesi ücretsiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={BOOKING_URL}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Online Randevu Al <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+908501234567"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all">
              <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
