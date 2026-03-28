import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Link } from "react-router";
import {
  Calendar,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye,
  Sparkles,
  Star,
} from "lucide-react";
import type { HeroSlide } from "@/lib/supabase";
import livePositiveLogo from "../../../assets/live-positive-logo.webp";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BOOKING_URL = "https://randevu.positivedental.com";

// Unsplash görselleri mobilde küçük boyutta iste
export function responsiveImg(url: string, desktopW = 900, mobileW = 480): string {
  if (!url || !url.includes("unsplash.com")) return url;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const w = isMobile ? mobileW : desktopW;
  return url.replace(/[?&]w=\d+/, `?w=${w}`).replace(/[?&]q=\d+/, `&q=${isMobile ? 60 : 80}`);
}

// ─── TAG COLOR → ICON MAP ────────────────────────────────────────────────────

export const TAG_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "text-violet-300": Zap,
  "text-teal-300": Eye,
  "text-amber-300": Sparkles,
  "text-rose-300": Star,
  "text-sky-300": Eye,
  "text-emerald-300": CheckCircle2,
};

// tag_color → accent renkleri
export const ACCENT_MAP: Record<string, { from: string; to: string }> = {
  "text-violet-300": { from: "from-indigo-500", to: "to-violet-600" },
  "text-teal-300": { from: "from-teal-500", to: "to-cyan-600" },
  "text-amber-300": { from: "from-amber-500", to: "to-orange-500" },
  "text-rose-300": { from: "from-rose-500", to: "to-pink-600" },
  "text-sky-300": { from: "from-sky-500", to: "to-blue-600" },
  "text-emerald-300": { from: "from-emerald-500", to: "to-teal-600" },
};

export interface SlideData {
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

export function mapSlide(s: HeroSlide): SlideData {
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
export const FALLBACK_SLIDES: SlideData[] = [
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

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface HeroSliderProps {
  slides: SlideData[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  direction: number;
  goTo: (idx: number) => void;
  prev: () => void;
  next: () => void;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function HeroSlider({ slides, active, setActive, direction, goTo, prev, next }: HeroSliderProps) {
  const HERO_SLIDES = slides;
  const safeActive = active < HERO_SLIDES.length ? active : 0;
  const slide = HERO_SLIDES[safeActive];
  const TagIcon = slide.tagIcon;

  return (
    <section className="relative bg-[#0B5FBF] overflow-hidden min-h-screen lg:min-h-[92vh] flex flex-col">

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
                <Link to="/hizmetlerimiz"
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
                  width={520} height={390}
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
  );
}
