const { SITE_URL } = require("./_supabase");
const PAGES = [
  ["/","1.0","daily"],["/hizmetlerimiz","0.9","weekly"],["/doktorlarimiz","0.9","weekly"],
  ["/fiyat-listesi","0.9","weekly"],["/hakkimizda","0.8","monthly"],["/kliniklerimiz","0.8","monthly"],
  ["/iletisim","0.8","monthly"],["/blog","0.8","daily"],["/cocuk-dis-hekimligi","0.7","monthly"],
  ["/anlasmali-kurumlar","0.6","monthly"],["/anlasmali-sigortalar","0.6","monthly"],["/randevu","0.7","monthly"],
];

module.exports = function handler(req, res) {
  const d = new Date().toISOString().split("T")[0];
  const urls = PAGES.map(([p,pr,ch]) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${d}</lastmod><changefreq>${ch}</changefreq><priority>${pr}</priority></url>`).join("\n");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
};
