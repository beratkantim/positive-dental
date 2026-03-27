import { SITE_URL, sbQuery, esc } from "./_supabase";

export default async function handler() {
  const posts = await sbQuery("blog_posts", "is_published=eq.true&order=created_at.desc&select=slug,image,title,published_at,created_at");
  const urls = posts.map(p => {
    const lm = (p.published_at || p.created_at || "").split("T")[0];
    const img = p.image ? `<image:image><image:loc>${esc(p.image)}</image:loc><image:title>${esc(p.title)}</image:title></image:image>` : "";
    return `  <url><loc>${SITE_URL}/blog/${p.slug}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}<priority>0.7</priority>${img}</url>`;
  }).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" },
  });
}
