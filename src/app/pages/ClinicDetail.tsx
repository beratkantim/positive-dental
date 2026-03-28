import { useParams, Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, Phone, ChevronDown,
  MapPin, Clock, Mail, Navigation, ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { BranchData } from "@/lib/supabase";
import { SEO } from "../components/SEO";
import { sanitizeHTML } from "@/lib/sanitize";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const BOOKING_URL = "https://randevu.positivedental.com";

export function ClinicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [branch, setBranch] = useState<BranchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("branches").select("*").eq("slug", slug ?? "").single();
      if (data) setBranch(data);
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

  if (!branch) return <Navigate to="/kliniklerimiz" replace />;

  const faqs = branch.faqs || [];
  const gallery = branch.gallery || [];
  const mapsQuery = branch.map_url || `Positive+Dental+Studio+${branch.city}+${branch.name}`.replace(/\s+/g, "+");

  return (
    <>
      <SEO
        title={`${branch.name} — Klinik Detayi`}
        description={branch.meta_description || `${branch.name} - ${branch.address}`}
        url={`/kliniklerimiz/${branch.slug}`}
        image={branch.image}
        keywords={branch.keywords || []}
        schemaType="dental"
        breadcrumbs={[
          { name: "Ana Sayfa", url: "https://positive-dental.vercel.app" },
          { name: "Kliniklerimiz", url: "https://positive-dental.vercel.app/kliniklerimiz" },
          { name: branch.name, url: `https://positive-dental.vercel.app/kliniklerimiz/${branch.slug}` },
        ]}
      />

      <div className="bg-white">
        {/* HERO */}
        <section className="relative bg-[#0D1235] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Link to="/kliniklerimiz" className="inline-flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-6 hover:text-white transition">
                  <ArrowLeft className="w-4 h-4" /> Tum Klinikler
                </Link>

                <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
                  {branch.name}
                </h1>
                <p className="text-lg text-indigo-300 font-semibold mb-6">{branch.city}</p>

                {/* Info cards */}
                <div className="space-y-3 mb-8">
                  {branch.address && (
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm leading-relaxed">{branch.address}</p>
                    </div>
                  )}
                  {branch.phone && (
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="text-slate-300 hover:text-white text-sm font-bold transition">
                        {branch.phone}
                      </a>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="text-slate-300 hover:text-white text-sm transition">
                        {branch.email}
                      </a>
                    </div>
                  )}
                  {branch.working_hours && (
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <Clock className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm leading-relaxed">{branch.working_hours}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg hover:from-indigo-400 hover:to-violet-500 transition">
                    <Calendar className="w-4 h-4" /> Randevu Al
                  </a>
                  <a href={`https://maps.google.com/?q=${mapsQuery}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition">
                    <Navigation className="w-4 h-4" /> Yol Tarifi Al
                  </a>
                </div>
              </div>

              {branch.image && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <ImageWithFallback src={branch.image} alt={branch.name}
                      className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/40 to-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {branch.content && (
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
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(branch.content) }} />
            </div>
          </section>
        )}

        {/* GALLERY */}
        {gallery.length > 0 && (
          <section className="py-16 bg-[#FAFAF8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 text-center mb-10">
                Klinik Gorselleri
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-2xl overflow-hidden shadow-lg">
                    <img src={img} alt={`${branch.name} - ${i + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SSS */}
        {faqs.length > 0 && (
          <section className="py-16 bg-white">
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

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-4">
              {branch.name} Subemizde Randevu Alin
            </h2>
            <p className="text-indigo-200 mb-8">Ucretsiz ilk muayene ile tedavi planinizi olusturalim.</p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Ucretsiz Muayene Randevusu
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
