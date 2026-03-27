import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase, SITE_URL, xmlHeader } from "./_supabase";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, image, title, published_at, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const urls = (posts || []).map(p => {
    const lastmod = (p.published_at || p.created_at || "").split("T")[0];
    const imageBlock = p.image ? `
    <image:image>
      <image:loc>${escapeXml(p.image)}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
    </image:image>` : "";

    return `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageBlock}
  </url>`;
  }).join("\n");

  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
