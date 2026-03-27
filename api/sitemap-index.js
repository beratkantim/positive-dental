var SITE_URL = "https://positive-dental.vercel.app";

module.exports = function (req, res) {
  var now = new Date().toISOString().split("T")[0];
  var xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <sitemap>",
    "    <loc>" + SITE_URL + "/sitemap-static.xml</loc>",
    "    <lastmod>" + now + "</lastmod>",
    "  </sitemap>",
    "  <sitemap>",
    "    <loc>" + SITE_URL + "/sitemap-blog.xml</loc>",
    "    <lastmod>" + now + "</lastmod>",
    "  </sitemap>",
    "  <sitemap>",
    "    <loc>" + SITE_URL + "/sitemap-services.xml</loc>",
    "    <lastmod>" + now + "</lastmod>",
    "  </sitemap>",
    "</sitemapindex>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
};
