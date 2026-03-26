import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import {
  Star, Phone, ArrowRight, ArrowUpRight, Play, Calendar, ExternalLink,
  Users, Stethoscope, Building2, ThumbsUp, ChevronLeft, ChevronRight,
  CheckCircle2, Zap, Eye, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { useTable } from "../hooks/useSupabase";
import type { HeroSlide, Testimonial } from "@/lib/supabase";
import livePositiveLogo from "../../assets/live-positive-logo.webp";

// Sayfa altındaki ağır bileşenler — kullanıcı scroll edince yüklenir
const SmilePositive = lazy(() => import("../components/SmilePositive").then(m => ({ default: m.SmilePositive })));
const BookingWizard = lazy(() => import("../components/BookingWizard").then(m => ({ default: m.BookingWizard })));

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BOOKING_URL = "https://randevu.positivedental.com";

// Unsplash görselleri mobilde küçük boyutta iste
function responsiveImg(url: string, desktopW = 900, mobileW = 480): string {
  if (!url || !url.includes("unsplash.com")) return url;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const w = isMobile ? mobileW : desktopW;
  return url.replace(/[?&]w=\d+/, `?w=${w}`).replace(/[?&]q=\d+/, `&q=${isMobile ? 60 : 80}`);
}

// ─── TAG COLOR → ICON MAP ────────────────────────────────────────────────────

const TAG_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "text-violet-300": Zap,
  "text-teal-300": Eye,
  "text-amber-300": Sparkles,
  "text-rose-300": Star,
  "text-sky-300": Eye,
  "text-emerald-300": CheckCircle2,
};

// tag_color → accent renkleri
const ACCENT_MAP: Record<string, { from: string; to: string }> = {
  "text-violet-300": { from: "from-indigo-500", to: "to-violet-600" },
  "text-teal-300": { from: "from-teal-500", to: "to-cyan-600" },
  "text-amber-300": { from: "from-amber-500", to: "to-orange-500" },
  "text-rose-300": { from: "from-rose-500", to: "to-pink-600" },
  "text-sky-300": { from: "from-sky-500", to: "to-blue-600" },
  "text-emerald-300": { from: "from-emerald-500", to: "to-teal-600" },
};

interface SlideData {
  tag: string;
  tagIcon: React.ComponentType<any>;
  tagColor: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  features: string[];
  image: string;
  accentFrom: string;
  accentTo: string;
  badge: string;
}

function mapSlide(s: HeroSlide): SlideData {
  const accent = ACCENT_MAP[s.tag_color] || ACCENT_MAP["text-violet-300"];
  return {
    tag: s.tag,
    tagIcon: TAG_ICON_MAP[s.tag_color] || Sparkles,
    tagColor: s.tag_color,
    title: s.title,
    titleGradient: s.title_gradient,
    subtitle: s.subtitle,
    features: s.features || [],
    image: s.image,
    accentFrom: accent.from,
    accentTo: accent.to,
    badge: s.badge,
  };
}

// Fallback slide (veritabanı boşsa veya yüklenirken)
const FALLBACK_SLIDES: SlideData[] = [
  {
    tag: "Positive Dental Studio",
    tagIcon: Sparkles,
    tagColor: "text-violet-300",
    title: "Sağlıklı\nGülüşler",
    titleGradient: "from-indigo-400 via-violet-400 to-purple-400",
    subtitle: "Adana ve İstanbul'da uzman kadrosuyla hizmet veren modern diş kliniği.",
    features: ["Uzman hekim kadrosu", "Modern teknoloji", "Ücretsiz ilk muayene"],
    image: "https://images.unsplash.com/photo-1623867821208-c4d8025f8194?w=900&q=75&auto=format",
    accentFrom: "from-indigo-500",
    accentTo: "to-violet-600",
    badge: "Randevu Açık",
  },
];

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PAGE_SERVICES = [
  { title: "İmplant Tedavisi",     desc: "Kalıcı, doğal görünümlü diş çözümleri. Aynı gün implant mümkün.", icon: "🔩", color: "from-violet-500 to-purple-600" },
  { title: "Estetik & Gülüş",     desc: "Veneer, beyazlatma, dijital gülüş simülasyonu ile hayalindeki gülüş.", icon: "✨", color: "from-indigo-500 to-violet-600" },
  { title: "Ortodonti",            desc: "Şeffaf plak ve modern braketlerle görünmez, ağrısız tedavi.", icon: "😁", color: "from-sky-500 to-blue-600" },
  { title: "Genel Diş Hekimliği", desc: "Rutin kontrol, kanal, dolgu — önce sağlık, sonra estetik.", icon: "🦷", color: "from-teal-500 to-cyan-600" },
  { title: "Çocuk Diş Hekimliği", desc: "Çocuğunuzun dişçi korkusunu sevgiye dönüştürüyoruz.", icon: "🌟", color: "from-amber-400 to-orange-500" },
  { title: "Protez & Zirkonyum",  desc: "Doğal görünüm, uzun ömür. Tek seans dijital protez.", icon: "💎", color: "from-emerald-500 to-green-600" },
];

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

  // Active index'i slide sayısına sınırla
  const safeActive = active < HERO_SLIDES.length ? active : 0;
  const slide = HERO_SLIDES[safeActive];
  const TagIcon = slide.tagIcon;

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

      {/* ══════════════════════════════════════════════════════════
          HERO — SERVICE SLIDER
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D1235] overflow-hidden min-h-screen lg:min-h-[92vh] flex flex-col">

        {/* Ambient blobs — hidden on mobile for performance */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/25 blur-[130px] pointer-events-none transition-all duration-1000 hidden md:block" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-700/25 blur-[110px] pointer-events-none transition-all duration-1000 hidden md:block" />

        {/* Rings — hidden on mobile */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.04] hidden md:flex">
          {[300, 500, 700, 900, 1100].map((s) => (
            <div key={s} className="absolute rounded-full border border-white" style={{ width: s, height: s }} />
          ))}
        </div>

        {/* Grid dots — hidden on mobile */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden md:block"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        {/* ── Top bar ── */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-4 sm:pb-6 flex items-center justify-between">
          {/* Live badge */}
          <div
            className="anim-fade-in in-view inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <img src={livePositiveLogo} alt="live positive" className="h-4 w-auto"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.55 }} loading="eager" decoding="async" width="55" height="16" />
            <span className="text-white/40 text-xs">·</span>
            <span className="text-white/50 text-xs font-medium">Online Randevu Açık</span>
          </div>

          {/* Slide counter */}
          <div className="hidden sm:flex items-center gap-2 text-white/30 text-sm font-mono">
            <span className="text-white/60 font-bold">{String(active + 1).padStart(2, "0")}</span>
            <span>/</span>
            <span>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 xl:gap-20 w-full py-6 lg:py-0">

            {/* LEFT — text */}
            <div className="flex flex-col justify-center">
              <div
                key={active}
                className="slide-enter space-y-6"
              >
                {/* Service tag */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12`}>
                  <TagIcon className={`w-3.5 h-3.5 ${slide.tagColor}`} />
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{slide.tag}</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-semibold">{slide.badge}</span>
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.88] tracking-tight">
                  {slide.title.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {i === 1 ? (
                        <span className={`bg-gradient-to-r ${slide.titleGradient} bg-clip-text text-transparent`}>
                          {line}
                        </span>
                      ) : line}
                    </span>
                  ))}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>

                {/* Feature checklist */}
                <ul className="space-y-2">
                  {slide.features.map((f, i) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2.5 text-slate-300 text-sm anim-fade-in in-view ${i === 0 ? "delay-200" : i === 1 ? "delay-300" : "delay-400"}`}
                    >
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${slide.tagColor}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r ${slide.accentFrom} ${slide.accentTo} hover:opacity-90 text-white font-black shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all`}
                  >
                    <Calendar className="w-5 h-5" />
                    Online Randevu Al
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <Link to="/services"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/12 text-white font-bold transition-all">
                    Tüm Hizmetler <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — image */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div
                key={active}
                className="slide-enter-image relative w-full max-w-[520px]"
              >
                {/* Glow behind image */}
                <div className={`absolute inset-0 scale-90 translate-y-6 rounded-[2rem] bg-gradient-to-br ${slide.accentFrom} ${slide.accentTo} opacity-25 blur-3xl pointer-events-none`} />

                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
                  <ImageWithFallback
                    src={responsiveImg(slide.image)}
                    alt={slide.title.replace("\n", " ")}
                    className="w-full h-full object-cover"
                    loading={active === 0 ? "eager" : "lazy"}
                    fetchPriority={active === 0 ? "high" : undefined}
                  />
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07091A]/60 via-transparent to-transparent" />

                  {/* Floating service badge */}
                  <div
                    className="anim-float absolute bottom-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3"
                  >
                    <p className="text-white font-black text-sm">{slide.title.replace("\n", " ")}</p>
                    <p className={`text-xs mt-0.5 font-semibold ${slide.tagColor}`}>{slide.badge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation bar ── */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16 pt-6 sm:pt-8">
          <div className="flex items-center justify-between">

            {/* Slide tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-bold ${
                    active === i
                      ? "bg-white/12 border-white/20 text-white"
                      : "bg-transparent border-white/8 text-white/35 hover:text-white/60 hover:border-white/15"
                  }`}
                >
                  {/* Progress bar */}
                  {active === i && (
                    <span className="block w-12 h-0.5 bg-white/30 rounded-full overflow-hidden relative">
                      <span
                        className={`anim-progress absolute inset-y-0 left-0 bg-gradient-to-r ${s.accentFrom} ${s.accentTo} rounded-full`}
                        key={active}
                      />
                    </span>
                  )}
                  <span className="hidden sm:inline">
                    {s.title.replace("\n", " ")}
                  </span>
                  <span className="sm:hidden">{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 text-white flex items-center justify-center transition-all hover:scale-110"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 text-white flex items-center justify-center transition-all hover:scale-110"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOOKING WIZARD
      ══════════════════════════════════════════════════════════ */}
      <Suspense fallback={null}><BookingWizard /></Suspense>

      {/* ══════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8] content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hizmetlerimiz</span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Her ihtiyacın<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent"> bir çözümü var.</span>
              </h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
              Tüm Hizmetler <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAGE_SERVICES.map((s, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                key={s.title}
                delay={i < 3 ? `delay-${(i + 1) * 100}` : `delay-${Math.min((i - 2) * 100, 500)}`}
                className="hover-lift group bg-white rounded-2xl p-6 border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                  Detaylı Bilgi <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          KIDS TEASER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 bg-white overflow-hidden content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-indigo-50 border border-pink-100"
          >
            {/* Floating blobs — hidden on mobile for performance */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/40 rounded-full blur-[80px] pointer-events-none hidden md:block" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-200/40 rounded-full blur-[70px] pointer-events-none hidden md:block" />

            <div className="relative grid lg:grid-cols-2 gap-0 items-center">
              {/* Left – text */}
              <div className="p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-200 mb-6">
                  <span className="text-base">🌟</span>
                  <span className="text-pink-700 text-xs font-bold uppercase tracking-widest">Çocuk Diş Hekimliği</span>
                </div>

                <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5">
                  Küçük dişler,
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">büyük gülüşler.</span>
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
                  Özel eğitimli hekimlerimiz ve eğlenceli kliniğimizle çocukların dişçi korkusunu sevgiye dönüştürüyoruz. 0–18 yaş arası tüm diş bakımı ihtiyaçları burada.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {["Ağrısız Tedavi 🛡️", "Süt Dişi Uzmanı 🦷", "Eğlenceli Ortam 🎈", "Ücretsiz İlk Muayene ✓"].map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-pink-100 text-slate-600 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/kids"
                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold shadow-lg shadow-pink-200 hover:scale-105 transition-all"
                  >
                    Çocuk Sayfasını Keşfet
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-pink-100 text-slate-700 font-bold hover:border-pink-300 hover:shadow-md transition-all"
                  >
                    <Calendar className="w-4 h-4 text-pink-500" />
                    Randevu Al
                  </a>
                </div>
              </div>

              {/* Right – visual */}
              <div className="relative h-64 lg:h-auto lg:min-h-[420px] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1611146033545-5e1e5ad951d8?w=700&q=75&auto=format"
                  alt="Mutlu çocuk dişçide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50/60 via-transparent to-transparent lg:block hidden" />

                {/* Floating stat */}
                <div
                  className="anim-float absolute bottom-6 right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-xl">
                    😄
                  </div>
                  <div>
                    <p className="font-black text-slate-800">5.000+</p>
                    <p className="text-slate-400 text-xs">Mutlu Çocuk Hasta</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          NEDEN BİZ
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden h-52">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1769559893692-c6d0623bf8e4?w=400&q=75&auto=format" alt="Gülen hasta" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
                    <p className="font-display text-4xl font-black">%100</p>
                    <p className="text-indigo-100 text-sm mt-1">Sterilizasyon Güvencesi</p>
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  <div className="bg-slate-900 rounded-2xl p-5 text-white">
                    <p className="font-display text-4xl font-black text-white">10+</p>
                    <p className="text-slate-400 text-sm mt-1">Yıl Deneyim</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-52">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1763739906082-a6093d4939f9?w=400&q=75&auto=format" alt="Mutlu çift" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="pointer-events-auto w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/50 cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-0.5" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Neden Biz?</span>
                <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Positive Dental<br /><span className="italic">farkını</span> hisset.
                </h2>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Dişçi koltuğu artık stresin değil, özgüvenin başladığı yer. Her tedaviyi deneyim tasarımcısı gibi planlıyoruz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "", title: "Aynı Gün Randevu",      desc: "Online sistemle saniyeler içinde slot al." },
                  { icon: "🔬", title: "3D Dijital Planlama",   desc: "Tedavini başlamadan önce ekranda gör." },
                  { icon: "🛡️", title: "Steril & Güvenli",     desc: "Uluslararası sterilizasyon protokolü." },
                  { icon: "🌍", title: "International Patients", desc: "Yabancı hastalar için özel paketler." },
                ].map((w, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={w.title} delay={`delay-${(i + 1) * 100}`}
                    className="flex gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                    <span className="text-2xl flex-shrink-0">{w.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{w.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{w.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" /> Online Randevu Al
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8] content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hasta Yorumları</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900">Gülüşler konuşuyor.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={i}
                delay={`delay-${(i + 1) * 100}`}
                className={`relative bg-white rounded-3xl p-7 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all ${i === 1 ? "lg:-translate-y-4" : ""}`}>
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

      {/* ══════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-10 pb-0 bg-[#0D1235] content-lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5 bg-[#1A2248] rounded-3xl overflow-hidden">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  key={s.label}
                  delay={`delay-${Math.min((i + 1) * 100, 500)}`}
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

      {/* ══════════════════════════════════════════════════════════
          GÜLÜŞ TASARIMI
      ══════════════════════════════════════════════════════════ */}
      <Suspense fallback={null}><SmilePositive /></Suspense>

      {/* ══════════════════════════════════════════════════════════
          CTA — AİLENİZİN DİŞ KLİNİĞİ
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D1235] overflow-hidden py-24 lg:py-32 content-lazy">

        {/* Ambient glows */}
        {/* Ambient glows — hidden on mobile for performance */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-indigo-600/12 rounded-full blur-[160px] pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none hidden md:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-600/8 rounded-full blur-[80px] pointer-events-none hidden md:block" />

        {/* Dot grid — hidden on mobile */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none hidden md:block"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top label */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
              🏠 Ailenizin Yanında
            </span>
            <h2
              className="font-display font-black text-white tracking-tight leading-[0.9] mb-6"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
            >
              Ailenizin<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                diş kliniği.
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Bebekten büyükbabaya, her yaştan her bireye özel tedavi protokolleri.
              Tek bir çatı altında tüm ailenizin gülüşünü koruyoruz.
            </p>
          </motion.div>

          {/* Family cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {[
              {
                label: "Bebekler & Küçükler",
                age: "0–6 yaş",
                emoji: "👶",
                desc: "İlk diş muayenesi, alışma seansları ve ebeveyn eğitimi.",
                color: "from-pink-500 to-rose-500",
                glow: "bg-pink-500/15",
                img: "https://images.unsplash.com/photo-1722596540819-5947b7c75523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
              },
              {
                label: "Çocuklar",
                age: "7–14 yaş",
                emoji: "🌟",
                desc: "Oyunlu muayene, ortodonti takibi ve diş koruyucular.",
                color: "from-amber-500 to-orange-500",
                glow: "bg-amber-500/15",
                img: "https://images.unsplash.com/photo-1615462696310-09736533dbb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
              },
              {
                label: "Gençler & Yetişkinler",
                age: "15–50 yaş",
                emoji: "✨",
                desc: "Estetik, implant, ortodonti — tam kapsamlı tedavi.",
                color: "from-indigo-500 to-violet-500",
                glow: "bg-indigo-500/15",
                img: "https://images.unsplash.com/photo-1627964807070-e19d3ca29bdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
              },
              {
                label: "Büyükler & Yaşlılar",
                age: "50+ yaş",
                emoji: "💎",
                desc: "Protez, implant ve hassas dişler için özel protokoller.",
                color: "from-emerald-500 to-teal-500",
                glow: "bg-emerald-500/15",
                img: "https://images.unsplash.com/photo-1575267685970-7fbabf6ed7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=75&auto=format",
              },
            ].map((card, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                key={card.label}
                delay={`delay-${Math.min((i + 1) * 100, 500)}`}
                className="hover-lift relative group rounded-3xl overflow-hidden border border-white/8 cursor-default"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <ImageWithFallback
                    src={card.img}
                    alt={card.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235] via-[#0D1235]/40 to-transparent" />
                  {/* Emoji badge */}
                  <div className={`absolute top-4 right-4 w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg shadow-lg`}>
                    {card.emoji}
                  </div>
                  {/* Age pill */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
                    {card.age}
                  </div>
                </div>

                {/* Content */}
                <div className={`${card.glow} p-5 border-t border-white/6`}>
                  <h3 className="text-white font-black text-sm mb-1.5">{card.label}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
                  <div className={`mt-4 h-0.5 rounded-full bg-gradient-to-r ${card.color} opacity-60`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center feature: family photo + stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/10 mb-14"
          >
            {/* BG image */}
            <div className="relative h-72 sm:h-96 lg:h-[420px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1772723246543-213f2a4fc526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=75&auto=format"
                alt="Mutlu Aile"
                className="w-full h-full object-cover object-center"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1235]/90 via-[#0D1235]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1235]/60 via-transparent to-transparent" />

              {/* Left content */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16 max-w-lg">
                <span className="inline-flex items-center gap-1.5 text-indigo-300 text-xs font-black uppercase tracking-widest mb-4">
                  🏠 Positive Dental Studio
                </span>
                <h3 className="font-display font-black text-white text-3xl sm:text-4xl leading-tight mb-4">
                  Nesiller boyunca<br />
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    gülen aileler.
                  </span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Aile paket programlarımızla tüm bireyler tek muayenehanede takip edilir.
                  Ebeveynlere özel indirimler, çocuklara ücretsiz koruyucu diş uygulamaları.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-sm transition-all hover:scale-[1.03] shadow-xl shadow-indigo-900/40"
                  >
                    <Calendar className="w-4 h-4" /> Aile Randevusu Al <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:+908501234567"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/8 hover:bg-white/14 border border-white/10 text-white font-bold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-slate-400" /> 0850 123 45 67
                  </a>
                </div>
              </div>

              {/* Floating benefit badges */}
              <div
                className="anim-float absolute top-6 right-6 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 hidden sm:flex flex-col gap-1"
              >
                <span className="text-white font-black text-sm">Aile Paketi</span>
                <span className="text-indigo-300 text-xs font-bold">%20 İndirim</span>
              </div>

              <div
                className="anim-float absolute bottom-6 right-6 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 hidden sm:flex items-center gap-2.5"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-2xl">🦷</span>
                <div>
                  <p className="text-white font-black text-xs">Ücretsiz</p>
                  <p className="text-slate-300 text-xs">İlk Muayene</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom trust strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: "👨‍👩‍👧‍👦", value: "4.500+", label: "Mutlu Aile" },
              { icon: "🦷", value: "Her Yaş", label: "Özel Protokol" },
              { icon: "📋", value: "Aile Paketi", label: "Toplu İndirim" },
              { icon: "📍", value: "4 Klinik", label: "Size Yakın" },
            ].map((item, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                key={item.label}
                delay={`delay-${Math.min((i + 1) * 100, 500)}`}
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-5 py-4 hover:bg-white/8 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-white font-black text-sm">{item.value}</p>
                  <p className="text-slate-500 text-xs">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-xs mt-8">
            Pzt – Cts: 09:00–20:00 &nbsp;·&nbsp; 4 Klinik &nbsp;·&nbsp; Aile Paket Programları
          </p>

        </div>
      </section>

    </div>
    </>
  );
}
