import { lazy, Suspense } from "react";
import { SEO } from "../components/SEO";
import {
  Star, Phone, ArrowRight, ArrowUpRight,
  Users, Stethoscope, Building2, ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { useTable } from "../hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import type { HeroSlide, Testimonial } from "@/lib/supabase";

// ─── Sub-components ──────────────────────────────────────────────────────────
import { HeroSlider, mapSlide, FALLBACK_SLIDES, responsiveImg } from "../components/home/HeroSlider";
import type { SlideData } from "../components/home/HeroSlider";
import { ServicesGrid } from "../components/home/ServicesGrid";
import { KidsTeaser } from "../components/home/KidsTeaser";
import { WhyUs } from "../components/home/WhyUs";
import { FamilyClinic } from "../components/home/FamilyClinic";

// Sayfa altındaki ağır bileşenler — kullanıcı scroll edince yüklenir
const SmilePositive = lazy(() => import("../components/SmilePositive").then(m => ({ default: m.SmilePositive })));
const BookingWizard = lazy(() => import("../components/BookingWizard").then(m => ({ default: m.BookingWizard })));

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STATS = [
  { value: "15.000+", label: "Mutlu Hasta",  icon: Users },
  { value: "25+",     label: "Uzman Hekim",  icon: Stethoscope },
  { value: "4",       label: "Klinik",       icon: Building2 },
  { value: "4.9★",    label: "Google Puanı", icon: ThumbsUp },
];

// Testimonials Supabase'den çekilir, fallback aşağıda
const FALLBACK_TESTIMONIALS = [
  { name: "Selin Y.", role: "İmplant Hastası",  text: "Hayatımda dişçiye gitmekten bu kadar keyif aldığımı hiç düşünmezdim. Ekip inanılmaz sıcak, ortam çok modern.", rating: 5, img: "https://images.unsplash.com/photo-1679486479476-5ff4ee182334?w=100&q=75&auto=format" },
  { name: "Kaan M.", role: "Ortodonti Hastası", text: "Şeffaf plak ile 8 ayda çarpık dişlerimi düzelttim. Kimse fark etmedi, sonuç muhteşem!", rating: 5, img: "https://images.unsplash.com/photo-1769559893692-c6d0623bf8e4?w=100&q=75&auto=format" },
  { name: "Buse T.", role: "Gülüş Tasarımı",    text: "Gülüş tasarımı sonuçlarım harika — fotoğraflarda bile belli oluyor! Kesinlikle tavsiye ediyorum.", rating: 5, img: "https://images.unsplash.com/photo-1763739906082-a6093d4939f9?w=100&q=75&auto=format" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function Home() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const { data: rawSlides } = useTable<HeroSlide>("hero_slides", "sort_order");
  const { data: rawTestimonials } = useTable<Testimonial>("testimonials", "created_at", false);

  const TESTIMONIALS = rawTestimonials.length > 0
    ? rawTestimonials.map(t => ({ name: t.name, role: t.role, text: t.text, rating: t.rating, img: t.image }))
    : FALLBACK_TESTIMONIALS;

  // SEO text section
  const [seoText, setSeoText] = useState<{ heading: string; content: string }>({ heading: "", content: "" });
  useEffect(() => {
    supabase.from("site_settings").select("key,value").eq("group_name", "seo_anasayfa").then(({ data }) => {
      if (!data) return;
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.key] = d.value || ""; });
      setSeoText({ heading: map.seo_homepage_heading || "", content: map.seo_homepage_content || "" });
    });
  }, []);

  const HERO_SLIDES: SlideData[] = rawSlides.length > 0
    ? rawSlides.map(mapSlide)
    : FALLBACK_SLIDES;

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const slideCount = HERO_SLIDES.length;
  const prev = () => goTo((active - 1 + slideCount) % slideCount);
  const next = useCallback(() => goTo((active + 1) % slideCount), [active, slideCount, goTo]);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [active, next]);

  return (
    <>
    <SEO
      title="Modern Diş Kliniği — İstanbul, Ankara, İzmir, Antalya"
      description="Positive Dental Studio ile sağlıklı ve estetik gülüşlere kavuşun. İmplant, gülüş tasarımı, ortodonti, çocuk diş hekimliği. 4 şehir, 8 klinik. Ücretsiz ilk muayene."
      url="/"
      keywords={["diş kliniği istanbul", "implant fiyatları", "gülüş tasarımı", "ortodonti istanbul"]}
      schemaType="dental"
    />
    <div className="bg-white overflow-hidden">

      {/* ── BOOKING WIZARD ── */}
      <Suspense fallback={null}><BookingWizard /></Suspense>

      {/* ── HERO SLIDER ── */}
      <HeroSlider
        slides={HERO_SLIDES}
        active={active}
        setActive={setActive}
        direction={direction}
        goTo={goTo}
        prev={prev}
        next={next}
      />

      {/* ── KIDS TEASER ── */}
      <KidsTeaser />

      {/* ── SERVICES ── */}
      <ServicesGrid />

      {/* ── NEDEN BİZ ── */}
      <WhyUs />

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8] content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hasta Yorumları</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900">Gülüşler konuşuyor.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                key={i}
                className={`relative bg-white rounded-3xl p-7 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all ${i === 1 ? "lg:-translate-y-4" : ""}`}
              >
                <div className="absolute top-5 right-6 text-5xl text-slate-100 font-serif leading-none select-none">"</div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3">
                  <img src={responsiveImg(t.img, 200, 100)} alt={t.name} className="w-11 h-11 rounded-full object-cover object-top" loading="lazy" decoding="async" width="44" height="44" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Doğrulandı</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-slate-600 text-sm">
              <span className="font-black text-slate-900">4.9/5</span> ortalama · <span className="font-bold">1.200+ Google Yorumu</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="pt-10 pb-0 bg-[#0D1235] content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5 bg-[#1A2248] rounded-3xl overflow-hidden">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  key={s.label}
                  className="relative flex flex-col items-center justify-center py-10 px-6 text-center group overflow-hidden"
                >
                  {/* hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-violet-600/0 group-hover:from-indigo-600/10 group-hover:to-violet-600/10 transition-all duration-500" />

                  {/* icon */}
                  <div className="w-10 h-10 mb-4 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-300">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-300 transition-colors duration-300" />
                  </div>

                  <p className="font-display text-3xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-widest mt-1.5 font-medium">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GÜLÜŞ TASARIMI ── */}
      <Suspense fallback={null}><SmilePositive /></Suspense>

      {/* ── AİLENİZİN DİŞ KLİNİĞİ ── */}
      <FamilyClinic />

      {/* ── SEO TEXT ── */}
      {seoText.content && (
        <section className="bg-[#0B0F2E] py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {seoText.heading && (
              <h2 className="text-xl font-bold text-white/90 mb-4">{seoText.heading}</h2>
            )}
            <div className="text-sm text-blue-200/60 leading-relaxed whitespace-pre-line">
              {seoText.content}
            </div>
          </div>
        </section>
      )}

    </div>
    </>
  );
}
