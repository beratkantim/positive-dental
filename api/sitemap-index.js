const { SITE_URL } = require("./_supabase");

module.exports = function handler(req, res) {
  const d = new Date().toISOString().split("T")[0];
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-static.xml</loc><lastmod>${d}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-blog.xml</loc><lastmod>${d}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-services.xml</loc><lastmod>${d}</lastmod></sitemap>
</sitemapindex>`);
};
