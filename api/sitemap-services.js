const { SITE_URL, sbQuery, esc } = require("./_supabase");

module.exports = async function handler(req, res) {
  const [svcs, docs] = await Promise.all([
    sbQuery("services", "is_active=eq.true&select=title,image"),
    sbQuery("doctors", "is_active=eq.true&select=name,photo"),
  ]);
  const d = new Date().toISOString().split("T")[0];
  const si = svcs.filter(s => s.image).map(s => `    <image:image><image:loc>${esc(s.image)}</image:loc><image:title>${esc(s.title)}</image:title></image:image>`).join("\n");
  const di = docs.filter(x => x.photo).map(x => `    <image:image><image:loc>${esc(x.photo)}</image:loc><image:title>${esc(x.name)}</image:title></image:image>`).join("\n");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${SITE_URL}/hizmetlerimiz</loc><lastmod>${d}</lastmod><priority>0.9</priority>\n${si}\n  </url>
  <url><loc>${SITE_URL}/doktorlarimiz</loc><lastmod>${d}</lastmod><priority>0.9</priority>\n${di}\n  </url>
</urlset>`);
};
