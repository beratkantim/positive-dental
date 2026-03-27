import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase, SITE_URL, xmlHeader } from "./_supabase";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const [servicesRes, doctorsRes] = await Promise.all([
    supabase.from("services").select("title, image").eq("is_active", true).order("sort_order"),
    supabase.from("doctors").select("name, photo").eq("is_active", true).order("sort_order"),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const services = servicesRes.data || [];
  const doctors = doctorsRes.data || [];

  // Hizmetler sayfası — her hizmetin görseli
  const serviceImages = services
    .filter(s => s.image)
    .map(s => `    <image:image>
      <image:loc>${escapeXml(s.image)}</image:loc>
      <image:title>${escapeXml(s.title)}</image:title>
    </image:image>`)
    .join("\n");

  // Doktorlar sayfası — her doktorun fotoğrafı
  const doctorImages = doctors
    .filter(d => d.photo)
    .map(d => `    <image:image>
      <image:loc>${escapeXml(d.photo)}</image:loc>
      <image:title>${escapeXml(d.name)}</image:title>
    </image:image>`)
    .join("\n");

  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/hizmetlerimiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${serviceImages}
  </url>
  <url>
    <loc>${SITE_URL}/doktorlarimiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${doctorImages}
  </url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
