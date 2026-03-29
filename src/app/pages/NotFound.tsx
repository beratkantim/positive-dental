import { Link } from "react-router";
import { Home, ArrowLeft, Search, Phone, Calendar } from "lucide-react";
import { SEO } from "../components/SEO";

const BOOKING_URL = "/online-randevu";

const POPULAR_PAGES = [
  { to: "/", label: "Ana Sayfa", icon: "🏠" },
  { to: "/hizmetlerimiz", label: "Hizmetlerimiz", icon: "🦷" },
  { to: "/doktorlarimiz", label: "Doktorlarımız", icon: "👨‍⚕️" },
  { to: "/fiyat-listesi", label: "Fiyat Listesi", icon: "💰" },
  { to: "/blog", label: "Blog", icon: "📝" },
  { to: "/iletisim", label: "İletişim", icon: "📞" },
];

export function NotFound() {
  return (
    <>
      <SEO title="Sayfa Bulunamadı — 404" noindex />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 büyük numara */}
          <div className="relative mb-8">
            <span className="text-[10rem] font-black text-slate-100 leading-none select-none block">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
                <Search className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Sayfa Bulunamadı
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            Aşağıdaki bağlantılardan devam edebilirsiniz.
          </p>

          {/* CTA butonlar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105">
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </Link>
            <Link to={BOOKING_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all">
              <Calendar className="w-4 h-4" />
              Randevu Al
            </Link>
          </div>

          {/* Popüler sayfalar */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Popüler Sayfalar</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_PAGES.map(page => (
                <Link key={page.to} to={page.to}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all">
                  <span>{page.icon}</span>
                  {page.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Telefon */}
          <p className="mt-8 text-sm text-slate-400">
            Yardıma mı ihtiyacınız var?{" "}
            <a href="tel:+908501234567" className="text-indigo-500 font-bold hover:underline">
              0850 123 45 67
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
