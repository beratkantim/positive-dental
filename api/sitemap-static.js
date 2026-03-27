var SITE_URL = "https://positive-dental.vercel.app";

var PAGES = [
  { loc: "/",                      priority: "1.0", changefreq: "daily" },
  { loc: "/hizmetlerimiz",         priority: "0.9", changefreq: "weekly" },
  { loc: "/doktorlarimiz",         priority: "0.9", changefreq: "weekly" },
  { loc: "/hakkimizda",            priority: "0.8", changefreq: "monthly" },
  { loc: "/kliniklerimiz",         priority: "0.8", changefreq: "monthly" },
  { loc: "/iletisim",              priority: "0.8", changefreq: "monthly" },
  { loc: "/fiyat-listesi",         priority: "0.8", changefreq: "weekly" },
  { loc: "/anlasmali-kurumlar",    priority: "0.7", changefreq: "monthly" },
  { loc: "/anlasmali-sigortalar",  priority: "0.7", changefreq: "monthly" },
  { loc: "/blog",                  priority: "0.8", changefreq: "daily" },
  { loc: "/cocuk-dis-hekimligi",   priority: "0.7", changefreq: "monthly" },
  { loc: "/galeri",                priority: "0.6", changefreq: "monthly" },
];

module.exports = function (req, res) {
  var now = new Date().toISOString().split("T")[0];
  var urls = PAGES.map(function (p) {
    return [
      "  <url>",
      "    <loc>" + SITE_URL + p.loc + "</loc>",
      "    <lastmod>" + now + "</lastmod>",
      "    <changefreq>" + p.changefreq + "</changefreq>",
      "    <priority>" + p.priority + "</priority>",
      "  </url>",
    ].join("\n");
  }).join("\n");

  var xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
};
