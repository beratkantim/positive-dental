import { useParams, Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, CheckCircle2, Calendar, Phone, ChevronDown,
  Star, Clock, ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/supabase";
import { SEO } from "../components/SEO";
import { sanitizeHTML } from "@/lib/sanitize";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const [single, all] = await Promise.all([
        supabase.from("services").select("*").eq("slug", slug ?? "").single(),
        supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (single.data) setService(single.data);
      if (all.data) setRelated(all.data.filter(s => s.slug !== slug).slice(0, 3));
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

  if (!service) return <Navigate to="/hizmetlerimiz" replace />;

  const faqs = service.faqs || [];

  return (
    <>
      <SEO
        title={`${service.title} — Tedavi Detayı`}
        description={service.meta_description || service.description}
        url={`/hizmetlerimiz/${service.slug}`}
        image={service.image}
        keywords={service.keywords || []}
        schemaType="dental"
        breadcrumbs={[
          { name: "Ana Sayfa", url: "https://positive-dental.vercel.app" },
          { name: "Hizmetlerimiz", url: "https://positive-dental.vercel.app/hizmetlerimiz" },
          { name: service.title, url: `https://positive-dental.vercel.app/hizmetlerimiz/${service.slug}` },
        ]}
      />

      <div className="bg-white">
        {/* HERO */}
        <section className="relative bg-[#0D1235] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Link to="/hizmetlerimiz" className="inline-flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-6 hover:text-white transition">
                  <ArrowLeft className="w-4 h-4" /> Tüm Hizmetler
                </Link>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color_from} ${service.color_to} flex items-center justify-center text-3xl shadow-xl mb-6`}>
                  {service.icon}
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
                  {service.title}
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  {service.description}
                </p>

                {service.features?.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {service.features.map((f, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link to="/online-randevu"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg hover:from-indigo-400 hover:to-violet-500 transition">
                    <Calendar className="w-4 h-4" /> Randevu Al
                  </Link>
                  <a href="tel:+908501234567"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition">
                    <Phone className="w-4 h-4" /> 0850 123 45 67
                  </a>
                </div>
              </div>

              {service.image && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <ImageWithFallback src={service.image} alt={service.title}
                      className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/40 to-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* İÇERİK */}
        {service.content && (
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
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.content) }} />
            </div>
          </section>
        )}

        {/* SSS */}
        {faqs.length > 0 && (
          <section className="py-16 bg-[#FAFAF8]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 text-center mb-10">
                Sık Sorulan Sorular
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

        {/* İLGİLİ TEDAVİLER */}
        {related.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-black text-slate-900 mb-8">Diğer Tedavilerimiz</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(s => (
                  <Link key={s.id} to={`/hizmetlerimiz/${s.slug}`}
                    className="group bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-transparent transition-all">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color_from} ${s.color_to} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      {s.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{s.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 mt-3 group-hover:gap-2 transition-all">
                      Detaylı Bilgi <ArrowRight className="w-3 h-3" />
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
              {service.title} için Randevu Alın
            </h2>
            <p className="text-indigo-200 mb-8">Ücretsiz ilk muayene ile tedavi planınızı oluşturalım.</p>
            <Link to="/online-randevu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Ücretsiz Muayene Randevusu
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
