import { Link, useNavigate, useLocation } from "react-router";
import { Menu, Phone, X, Calendar, ChevronDown, Building2, Shield, Info, ExternalLink, Stethoscope, MapPin, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* Kurumsal dropdown içeriği */
const DROPDOWN_ITEMS = [
  {
    path: "/hakkimizda",
    label: "Hakkımızda",
    icon: Info,
    desc: "Hikayemiz, ekibimiz ve değerlerimiz",
    badge: null,
    badgeColor: "",
  },
  {
    path: "/hizmetlerimiz",
    label: "Hizmetlerimiz",
    icon: Stethoscope,
    desc: "Tüm diş tedavisi hizmetlerimiz",
    badge: null,
    badgeColor: "",
  },
  {
    path: "/kliniklerimiz",
    label: "Kliniklerimiz",
    icon: MapPin,
    desc: "Adana Türkmenbaşı · İstanbul Nişantaşı",
    badge: "2 Şube",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    path: "/doktorlarimiz",
    label: "Doktorlarımız",
    icon: Users,
    desc: "Uzman hekim kadromuz · Online randevu",
    badge: "7 Uzman",
    badgeColor: "bg-sky-100 text-sky-700",
  },
  {
    path: "/iletisim",
    label: "İletişim",
    icon: Phone,
    desc: "Bize ulaşın, randevu alın",
    badge: null,
    badgeColor: "",
  },
  {
    path: "/anlasmali-kurumlar",
    label: "Anlaşmalı Kurumlar",
    icon: Building2,
    desc: "Çalışanlara %15–30 özel indirim",
    badge: "%30'a kadar",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    path: "/anlasmali-sigortalar",
    label: "Anlaşmalı Sigortalar",
    icon: Shield,
    desc: "12+ sigorta şirketi ile anlaşmalı",
    badge: "12+ Şirket",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
];

const BOOKING_URL = "https://randevu.positivedental.com";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"TR" | "EN">("TR");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Ana nav */
  const navLinks = [
    { path: "/", label: "Ana Sayfa" },
    { path: "/fiyat-listesi", label: "Fiyat Listesi" },
    { path: "/cocuk-dis-hekimligi", label: "Kids 🌟", highlight: true },
  ];

  const socials = [
    { Icon: InstagramIcon, href: "https://www.instagram.com/positivedental", label: "Instagram" },
    { Icon: LinkedinIcon, href: "https://www.linkedin.com/company/positivedental", label: "LinkedIn" },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const isCorporateActive =
    location.pathname === "/hakkimizda" ||
    location.pathname === "/hizmetlerimiz" ||
    location.pathname === "/kliniklerimiz" ||
    location.pathname === "/doktorlarimiz" ||
    location.pathname === "/iletisim" ||
    location.pathname === "/anlasmali-kurumlar" ||
    location.pathname === "/anlasmali-sigortalar";

  /* Dışarı tıklanınca kapat */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50">

      {/* ── Üst çubuk ─────────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#111A3E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            {/* Sosyal medya */}
            <div className="flex items-center gap-3.5">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} title={label}
                  className="text-slate-500 hover:text-white transition-colors">
                  <Icon />
                </a>
              ))}
              <span className="w-px h-3.5 bg-slate-700 mx-1" />
              <a href="mailto:info@positivedental.com" title="E-posta gönder"
                className="text-slate-500 hover:text-white text-xs transition-colors">
                info@positivedental.com
              </a>
            </div>
            {/* Sağ */}
            <div className="flex items-center gap-4">
              {/* Dil */}
              <div className="flex items-center gap-0.5">
                {["TR", "EN"].map((l) => (
                  <button key={l} onClick={() => setLang(l as "TR" | "EN")}
                    className={`text-xs px-2 py-0.5 rounded font-medium transition-all ${
                      lang === l ? "text-white" : "text-slate-500 hover:text-white"
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
              <span className="w-px h-3.5 bg-slate-700" />
              <a href="tel:+908501234567" title="Hemen ara: 0850 123 45 67"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-medium whitespace-nowrap">
                <Phone className="w-3 h-3" /> 0850 123 45 67
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ana navigasyon ────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-lg backdrop-saturate-150 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-2">

            {/* Logo */}
            <Link to="/" title="Positive Dental Studio Ana Sayfa" className="flex-shrink-0 mr-4">
              <img src={logo} alt="Positive Dental Studio"
                className="h-5 sm:h-6 w-auto hover:opacity-90 transition-opacity" loading="eager" decoding="async" width="180" height="24" />
            </Link>

            {/* Boşluk — nav sağa yaslanır */}
            <div className="flex-1" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {/* Ana Sayfa */}
              <Link to="/" title="Ana Sayfa"
                className={`relative px-3 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive("/") ? "text-indigo-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Ana Sayfa
                {isActive("/") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" />
                )}
              </Link>

              {/* ── Kurumsal dropdown ── */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`relative flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                    isCorporateActive
                      ? "text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Kurumsal
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  {isCorporateActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" />
                  )}
                </button>

                {/* Dropdown paneli */}
                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100 overflow-hidden z-50">
                    {/* Ok */}
                    <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-l border-t border-slate-100 rotate-45" />

                    <div className="p-2">
                      {/* Klinik sayfaları grubu */}
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">Klinik</p>
                      {DROPDOWN_ITEMS.slice(0, 5).map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link key={item.path} to={item.path} title={item.label}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                              active ? "bg-indigo-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                              active
                                ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md"
                                : "bg-indigo-100"
                            }`}>
                              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-indigo-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-bold text-sm ${active ? "text-indigo-700" : "text-slate-800 group-hover:text-indigo-700"} transition-colors`}>
                                  {item.label}
                                </p>
                                {item.badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}

                      {/* Ayırıcı + anlaşmalar grubu */}
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1 mt-1 border-t border-slate-100">Anlaşmalar</p>
                      {DROPDOWN_ITEMS.slice(5).map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link key={item.path} to={item.path} title={item.label}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                              active ? "bg-indigo-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                              active
                                ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md"
                                : "bg-emerald-100"
                            }`}>
                              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-emerald-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-bold text-sm ${active ? "text-indigo-700" : "text-slate-800 group-hover:text-indigo-700"} transition-colors`}>
                                  {item.label}
                                </p>
                                {item.badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mx-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 mb-1">Kurumsal anlaşma için</p>
                      <a href="mailto:kurum@positivedental.com" title="Kurumsal anlaşma için e-posta gönder"
                        className="text-indigo-600 text-xs font-bold hover:text-indigo-700 transition-colors">
                        kurum@positivedental.com →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Fiyat Listesi */}
              <Link to="/fiyat-listesi" title="Fiyat Listesi"
                className={`relative px-3 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive("/fiyat-listesi") ? "text-indigo-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Fiyat Listesi
                {isActive("/fiyat-listesi") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" />
                )}
              </Link>

              {/* Kids */}
              <Link to="/cocuk-dis-hekimligi" title="Çocuk Diş Hekimliği"
                className={`relative px-4 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive("/cocuk-dis-hekimligi")
                    ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-md"
                    : "bg-gradient-to-r from-pink-50 to-violet-50 text-pink-600 hover:from-pink-100 hover:to-violet-100 border border-pink-100"
                }`}
              >
                Kids 🌟
              </Link>

            </nav>

            {/* Sağ CTA grubu */}
            <div className="hidden lg:flex items-center gap-2 ml-auto flex-shrink-0">
              <button
                onClick={() => navigate("/randevu")}
                className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-200/60 hover:shadow-indigo-300/60 hover:shadow-xl transition-all whitespace-nowrap">
                <Calendar className="w-4 h-4" />
                Randevu Al
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-bounce" />
              </button>
            </div>

            {/* Mobil hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 flex-shrink-0">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobil menü ─────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 pb-5">
            {/* Üst bar */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100 mb-2">
              <a href="tel:+908501234567" title="Hemen ara: 0850 123 45 67" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone className="w-4 h-4 text-indigo-500" /> 0850 123 45 67
              </a>
              <div className="flex items-center gap-1">
                {["TR", "EN"].map((l) => (
                  <button key={l} onClick={() => setLang(l as "TR" | "EN")}
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                      lang === l ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-500"
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} title={link.label}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                    link.highlight
                      ? isActive(link.path)
                        ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                        : "text-pink-600 bg-pink-50"
                      : isActive(link.path)
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}>
                  {link.label}
                </Link>
              ))}

              {/* Kurumsal grubu mobil */}
              <div className="mt-2 px-3 pt-3 pb-1 border-t border-slate-100">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Kurumsal</p>
                <div className="flex flex-col gap-0.5">
                  {DROPDOWN_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link key={item.path} to={item.path} title={item.label}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                        }`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            active ? "bg-white/20 text-white" : item.badgeColor
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => { setMobileOpen(false); navigate("/randevu"); }}
                className="mt-3 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-200">
                <Calendar className="w-4 h-4" /> Online Randevu Al
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}