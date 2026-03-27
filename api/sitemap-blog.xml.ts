import { supabase, SITE_URL } from "./_supabase";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export default async function handler() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, image, title, published_at, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const urls = (posts || []).map(p => {
    const lastmod = (p.published_at || p.created_at || "").split("T")[0];
    const img = p.image ? `
    <image:image>
      <image:loc>${esc(p.image)}</image:loc>
      <image:title>${esc(p.title)}</image:title>
    </image:image>` : "";
    return `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${img}
  </url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
