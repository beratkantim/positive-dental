import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  "hizmetlerimiz": "Hizmetlerimiz",
  "hakkimizda": "Hakkımızda",
  "kliniklerimiz": "Kliniklerimiz",
  "iletisim": "İletişim",
  "cocuk-dis-hekimligi": "Çocuk Diş Hekimliği",
  "blog": "Blog",
  "anlasmali-kurumlar": "Anlaşmalı Kurumlar",
  "anlasmali-sigortalar": "Anlaşmalı Sigortalar",
  "fiyat-listesi": "Fiyat Listesi",
  "doktorlarimiz": "Doktorlarımız",
  "randevu": "Randevu",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();

  // Ana sayfada gösterme
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs: { label: string; to: string }[] = [
    { label: "Ana Sayfa", to: "/" },
  ];

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = PATH_LABELS[seg] || decodeURIComponent(seg).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    crumbs.push({ label, to: path });
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-1.5 text-sm flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.to} className="flex items-center gap-1.5"
                itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
                {isLast ? (
                  <span className="text-slate-900 font-semibold truncate max-w-[200px]" itemProp="name">
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.to} title={crumb.label}
                    className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    itemProp="item">
                    {i === 0 && <Home className="w-3.5 h-3.5" />}
                    <span itemProp="name">{crumb.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
