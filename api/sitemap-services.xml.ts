import { supabase, SITE_URL } from "./_supabase";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export default async function handler() {
  const [servicesRes, doctorsRes] = await Promise.all([
    supabase.from("services").select("title, image").eq("is_active", true),
    supabase.from("doctors").select("name, photo").eq("is_active", true),
  ]);

  const today = new Date().toISOString().split("T")[0];

  const svcImgs = (servicesRes.data || []).filter(s => s.image).map(s =>
    `    <image:image>
      <image:loc>${esc(s.image)}</image:loc>
      <image:title>${esc(s.title)}</image:title>
    </image:image>`).join("\n");

  const docImgs = (doctorsRes.data || []).filter(d => d.photo).map(d =>
    `    <image:image>
      <image:loc>${esc(d.photo)}</image:loc>
      <image:title>${esc(d.name)}</image:title>
    </image:image>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/hizmetlerimiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${svcImgs}
  </url>
  <url>
    <loc>${SITE_URL}/doktorlarimiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
${docImgs}
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
