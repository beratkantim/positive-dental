const SITE = "https://positive-dental.vercel.app";
const PAGES = [
  { p: "/", pr: "1.0", ch: "daily" },
  { p: "/hizmetlerimiz", pr: "0.9", ch: "weekly" },
  { p: "/doktorlarimiz", pr: "0.9", ch: "weekly" },
  { p: "/fiyat-listesi", pr: "0.9", ch: "weekly" },
  { p: "/hakkimizda", pr: "0.8", ch: "monthly" },
  { p: "/kliniklerimiz", pr: "0.8", ch: "monthly" },
  { p: "/iletisim", pr: "0.8", ch: "monthly" },
  { p: "/blog", pr: "0.8", ch: "daily" },
  { p: "/cocuk-dis-hekimligi", pr: "0.7", ch: "monthly" },
  { p: "/anlasmali-kurumlar", pr: "0.6", ch: "monthly" },
  { p: "/anlasmali-sigortalar", pr: "0.6", ch: "monthly" },
  { p: "/randevu", pr: "0.7", ch: "monthly" },
];

export default function handler() {
  const d = new Date().toISOString().split("T")[0];
  const urls = PAGES.map(x => `  <url><loc>${SITE}${x.p}</loc><lastmod>${d}</lastmod><changefreq>${x.ch}</changefreq><priority>${x.pr}</priority></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" },
  });
}
