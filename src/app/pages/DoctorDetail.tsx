import { useParams, Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, Phone, ChevronDown,
  GraduationCap, Star, MapPin, ArrowRight, Award,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Doctor } from "@/lib/supabase";
import { SEO } from "../components/SEO";
import { sanitizeHTML } from "@/lib/sanitize";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function DoctorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [related, setRelated] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const [single, all] = await Promise.all([
        supabase.from("doctors").select("*").eq("slug", slug ?? "").single(),
        supabase.from("doctors").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (single.data) {
        setDoctor(single.data);
        if (all.data) {
          const sameBranch = all.data.filter(
            d => d.slug !== slug && (
              d.branch === single.data.branch ||
              d.branches?.some((b: string) => single.data.branches?.includes(b))
            )
          );
          setRelated(sameBranch.slice(0, 3));
        }
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1235]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) return <Navigate to="/doktorlarimiz" replace />;

  const faqs = doctor.faqs || [];

  return (
    <>
      <SEO
        title={`${doctor.name} — ${doctor.specialty}`}
        description={doctor.meta_description || doctor.bio}
        url={`/doktorlarimiz/${doctor.slug}`}
        image={doctor.photo}
        keywords={doctor.keywords || []}
        schemaType="dental"
        breadcrumbs={[
          { name: "Ana Sayfa", url: "https://positive-dental.vercel.app" },
          { name: "Doktorlarimiz", url: "https://positive-dental.vercel.app/doktorlarimiz" },
          { name: doctor.name, url: `https://positive-dental.vercel.app/doktorlarimiz/${doctor.slug}` },
        ]}
      />

      <div className="bg-white">
        {/* HERO */}
        <section className="relative bg-[#0D1235] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Link to="/doktorlarimiz" className="inline-flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-6 hover:text-white transition">
                  <ArrowLeft className="w-4 h-4" /> Tum Doktorlar
                </Link>

                <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
                  {doctor.name}
                </h1>
                <p className="text-lg text-indigo-300 font-semibold mb-1">{doctor.title}</p>
                <p className="text-slate-400 mb-4">{doctor.specialty}</p>

                {/* Branch badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(doctor.branches_labels?.length ? doctor.branches_labels : [doctor.branch_label]).map(label => (
                    <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-indigo-300 border border-white/10">
                      <MapPin className="w-3 h-3" /> {label}
                    </span>
                  ))}
                </div>

                {/* Expertise tags */}
                {doctor.expertise?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {doctor.expertise.map((exp, i) => (
                      <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/20">
                        <Award className="w-3 h-3" /> {exp}
                      </motion.span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link to="/#randevu"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg hover:from-indigo-400 hover:to-violet-500 transition">
                    <Calendar className="w-4 h-4" /> Randevu Al
                  </Link>
                  <a href="tel:+908501234567"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition">
                    <Phone className="w-4 h-4" /> 0850 123 45 67
                  </a>
                </div>
              </div>

              {doctor.photo && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <ImageWithFallback src={doctor.photo} alt={doctor.name}
                      className="w-full h-[500px] object-contain bg-gradient-to-br from-indigo-50 to-violet-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/40 to-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* BIO */}
        {doctor.bio && (
          <section className="py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mb-6">Hakkinda</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {doctor.education?.length > 0 && (
          <section className="py-12 bg-[#FAFAF8]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-500" /> Egitim
              </h2>
              <ul className="space-y-3">
                {doctor.education.map((edu, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                    <Star className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">{edu}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* CONTENT */}
        {doctor.content && (
          <section className="py-16 sm:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg prose-slate max-w-none
                prose-headings:font-display prose-headings:font-black
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-slate-600
                prose-li:text-slate-600
                prose-a:text-indigo-600 prose-a:font-semibold
                prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(doctor.content) }} />
            </div>
          </section>
        )}

        {/* SSS */}
        {faqs.length > 0 && (
          <section className="py-16 bg-[#FAFAF8]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 text-center mb-10">
                Sik Sorulan Sorular
              </h2>

              {/* FAQ Schema */}
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map(f => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              })}} />

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left">
                      <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RELATED DOCTORS */}
        {related.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-black text-slate-900 mb-8">Diger Doktorlarimiz</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(d => (
                  <Link key={d.id} to={`/doktorlarimiz/${d.slug}`}
                    className="group bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-transparent transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      {d.photo && (
                        <img src={d.photo} alt={d.name} className="w-14 h-14 rounded-xl object-cover" />
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900">{d.name}</h3>
                        <p className="text-sm text-indigo-500 font-semibold">{d.specialty}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2">{d.bio}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 mt-3 group-hover:gap-2 transition-all">
                      Detayli Bilgi <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-4">
              {doctor.name} ile Randevu Alin
            </h2>
            <p className="text-indigo-200 mb-8">Uzman hekimimizle tedavi planlamanizi olusturalim.</p>
            <Link to="/#randevu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Ucretsiz Muayene Randevusu
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
