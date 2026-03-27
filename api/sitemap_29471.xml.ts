import { SITE_URL } from "./_supabase";

export default function handler() {
  const d = new Date().toISOString().split("T")[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-static.xml</loc><lastmod>${d}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-blog.xml</loc><lastmod>${d}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-services.xml</loc><lastmod>${d}</lastmod></sitemap>
</sitemapindex>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
