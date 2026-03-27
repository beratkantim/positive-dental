import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SITE_URL, xmlHeader } from "./_supabase";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/hizmetlerimiz", priority: "0.9", changefreq: "weekly" },
  { path: "/doktorlarimiz", priority: "0.9", changefreq: "weekly" },
  { path: "/fiyat-listesi", priority: "0.9", changefreq: "weekly" },
  { path: "/hakkimizda", priority: "0.8", changefreq: "monthly" },
  { path: "/kliniklerimiz", priority: "0.8", changefreq: "monthly" },
  { path: "/iletisim", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/cocuk-dis-hekimligi", priority: "0.7", changefreq: "monthly" },
  { path: "/anlasmali-kurumlar", priority: "0.6", changefreq: "monthly" },
  { path: "/anlasmali-sigortalar", priority: "0.6", changefreq: "monthly" },
  { path: "/randevu", priority: "0.7", changefreq: "monthly" },
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const today = new Date().toISOString().split("T")[0];

  const urls = STATIC_PAGES.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n");

  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
