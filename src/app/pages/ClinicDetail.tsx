import { useParams, Link, Navigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Calendar, Phone, ChevronDown, ChevronLeft, ChevronRight,
  MapPin, Clock, Mail, Star, Shield, Heart, CreditCard, CheckCircle,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { BranchData, Doctor, Testimonial } from "@/lib/supabase";
import { SEO } from "../components/SEO";
import { sanitizeHTML } from "@/lib/sanitize";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const BOOKING_URL = "/randevu";

// extend BranchData for fields in the DB but not in the TS type
interface ExtendedBranch extends BranchData {
  google_rating?: number;
}

export function ClinicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [branch, setBranch] = useState<ExtendedBranch | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const doctorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const [branchRes, doctorsRes, testimonialsRes] = await Promise.all([
        supabase.from("branches").select("*").eq("slug", slug ?? "").single(),
        supabase.from("doctors").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("testimonials").select("*").eq("is_active", true).eq("is_approved", true),
      ]);

      if (branchRes.data) {
        setBranch(branchRes.data as ExtendedBranch);

        // filter doctors by branch — doctors have branches[] array or branch field
        const allDocs = (doctorsRes.data || []) as Doctor[];
        const branchSlug = branchRes.data.slug;
        const filtered = allDocs.filter(
          (d) => d.branch === branchSlug || d.branches?.includes(branchSlug)
        );
        setDoctors(filtered);

        // filter testimonials by branch
        const allTests = (testimonialsRes.data || []) as Testimonial[];
        const branchTests = allTests.filter((t) => t.branch === branchSlug);
        setTestimonials(branchTests.length > 0 ? branchTests : allTests.slice(0, 6));
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

  if (!branch) return <Navigate to="/kliniklerimiz" replace />;

  const faqs = branch.faqs || [];
  const gallery = branch.gallery || [];
  const allImages = branch.image ? [branch.image, ...gallery] : gallery;
  const mapsQuery = branch.map_url || `Positive+Dental+Studio+${branch.city}+${branch.name}`.replace(/\s+/g, "+");
  const googleMapsUrl = branch.map_url?.startsWith("http")
    ? branch.map_url
    : `https://maps.google.com/?q=${mapsQuery}`;

  const scrollGallery = (dir: "left" | "right") => {
    if (!galleryRef.current) return;
    const amount = galleryRef.current.clientWidth * 0.8;
    galleryRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const scrollDoctors = (dir: "left" | "right") => {
    if (!doctorsRef.current) return;
    const amount = 200;
    doctorsRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const advantages = [
    { icon: Shield, title: "Seffaf Fiyatlandirma", desc: "Net ve anlasilir fiyat politikasi, gizli maliyet yok" },
    { icon: Heart, title: "Hasta Memnuniyeti", desc: "Tedavi oncesi ve sonrasi tam destek garantisi" },
    { icon: CreditCard, title: "Kolay Odeme", desc: "Taksit secenekleri ve anlasmali sigorta destegi" },
    { icon: CheckCircle, title: "Modern Teknoloji", desc: "Son teknoloji cihazlar ile guvenli tedaviler" },
  ];

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
        {/* ===== BREADCRUMB ===== */}
        <div className="bg-[#0D1235]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <Link to="/kliniklerimiz" className="inline-flex items-center gap-2 text-indigo-300 text-sm font-semibold hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Tum Klinikler
            </Link>
          </div>
        </div>

        {/* ===== PHOTO GALLERY CAROUSEL ===== */}
        {allImages.length > 0 && (
          <section className="relative bg-[#0D1235] pb-6">
            {/* Main image */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <ImageWithFallback
                  src={allImages[activeGalleryIdx]}
                  alt={`${branch.name} - ${activeGalleryIdx + 1}`}
                  className="w-full h-[300px] sm:h-[420px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {activeGalleryIdx + 1} / {allImages.length}
                </div>
                {/* Nav arrows on main image */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveGalleryIdx((p) => (p === 0 ? allImages.length - 1 : p - 1)); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveGalleryIdx((p) => (p === allImages.length - 1 ? 0 : p + 1)); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="relative mt-3">
                  <div ref={galleryRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveGalleryIdx(i)}
                        className={`flex-shrink-0 rounded-xl overflow-hidden snap-start transition-all duration-200 ${
                          activeGalleryIdx === i
                            ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0D1235] opacity-100"
                            : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img src={img} alt={`${branch.name} ${i + 1}`} className="w-20 h-14 sm:w-24 sm:h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                  {allImages.length > 5 && (
                    <>
                      <button onClick={() => scrollGallery("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => scrollGallery("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setLightboxOpen(false)}
              >
                <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-50" onClick={() => setLightboxOpen(false)}>
                  &times;
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGalleryIdx((p) => (p === 0 ? allImages.length - 1 : p - 1)); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <img
                  src={allImages[activeGalleryIdx]}
                  alt={`${branch.name} ${activeGalleryIdx + 1}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGalleryIdx((p) => (p === allImages.length - 1 ? 0 : p + 1)); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ===== CLINIC INFO + ACTION BUTTONS ===== */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    {branch.name}
                  </h1>
                  {branch.google_rating && branch.google_rating > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {branch.google_rating.toFixed(1)}
                      <span className="text-amber-500 font-medium">Google</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm sm:text-base mb-4">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>{branch.city}{branch.address ? ` — ${branch.address}` : ""}</span>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {branch.phone && (
                    <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition font-medium">
                      <Phone className="w-4 h-4" /> {branch.phone}
                    </a>
                  )}
                  {branch.email && (
                    <a href={`mailto:${branch.email}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition font-medium">
                      <Mail className="w-4 h-4" /> {branch.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <Link to={BOOKING_URL}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg hover:shadow-xl hover:from-indigo-400 hover:to-violet-500 transition-all text-center">
                  <Calendar className="w-5 h-5" /> Randevu Al
                </Link>
                <a href={`tel:${branch.phone?.replace(/\s/g, "") || ""}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all text-center">
                  <Phone className="w-5 h-5" /> Iletisim
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DOCTORS SECTION ===== */}
        {doctors.length > 0 && (
          <section className="py-12 sm:py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                  Doktorlarimiz
                </h2>
                {doctors.length > 4 && (
                  <div className="flex gap-2">
                    <button onClick={() => scrollDoctors("left")}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => scrollDoctors("right")}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div ref={doctorsRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
                {doctors.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doktorlarimiz/${doc.slug}`}
                    className="flex-shrink-0 flex flex-col items-center text-center group snap-start w-[130px] sm:w-[150px]"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-3 ring-white shadow-lg mb-3 group-hover:ring-indigo-300 transition-all">
                      <ImageWithFallback
                        src={doc.photo}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition">
                      {doc.title} {doc.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 leading-tight">{doc.specialty}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== ADVANTAGES ===== */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 text-center mb-10">
              Neden {branch.name}?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {advantages.map((adv, i) => {
                const Icon = adv.icon;
                return (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{adv.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{adv.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CONTENT (from CMS) ===== */}
        {branch.content && (
          <section className="py-12 sm:py-16 bg-slate-50">
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

        {/* ===== PATIENT REVIEWS ===== */}
        {testimonials.length > 0 && (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Hasta Yorumlari
                </h2>
                <p className="text-slate-500 text-sm">Hastalarimizin deneyimlerinden</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.slice(0, 6).map((t) => (
                  <div key={t.id} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4">{t.text}</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      {t.image ? (
                        <ImageWithFallback
                          src={t.image}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                        {t.role && <p className="text-xs text-slate-400">{t.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== WORKING HOURS + MAP ===== */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Working Hours */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-display text-xl font-black text-slate-900">Calisma Saatleri</h2>
                </div>
                {branch.working_hours ? (
                  <div className="space-y-3">
                    {branch.working_hours.split("\n").filter(Boolean).map((line, i) => {
                      const parts = line.split(":");
                      const day = parts[0]?.trim();
                      const hours = parts.slice(1).join(":").trim();
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                          <span className="text-slate-700 font-medium text-sm">{day}</span>
                          <span className="text-slate-900 font-bold text-sm">{hours || line}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Calisma saatleri bilgisi icin luffen bizi arayin.</p>
                )}

                {/* Contact info inside working hours card */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  {branch.phone && (
                    <a href={`tel:${branch.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold">{branch.phone}</span>
                    </a>
                  )}
                  {branch.email && (
                    <a href={`mailto:${branch.email}`}
                      className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span>{branch.email}</span>
                    </a>
                  )}
                  {branch.address && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{branch.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                {branch.map_url?.includes("embed") ? (
                  <iframe
                    src={branch.map_url}
                    className="w-full h-full min-h-[350px] lg:min-h-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${branch.name} Harita`}
                  />
                ) : (
                  <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display font-black text-slate-900 text-lg mb-2">{branch.name}</h3>
                    <p className="text-slate-500 text-sm mb-6">{branch.address}</p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm hover:from-indigo-400 hover:to-violet-500 transition shadow-lg"
                    >
                      <MapPin className="w-4 h-4" /> Google Maps'te Ac
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ (SSS) — Kept for SEO schema markup ===== */}
        {faqs.length > 0 && (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 text-center mb-10">
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
                  <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-100/50 transition">
                      <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-violet-700 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-4">
              {branch.name} Subemizde Randevu Alin
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">
              Ucretsiz ilk muayene ile tedavi planinizi olusturalim.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={BOOKING_URL}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Ucretsiz Muayene Randevusu
              </Link>
              {branch.phone && (
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all">
                  <Phone className="w-5 h-5" /> {branch.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
