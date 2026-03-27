var SITE_URL = "https://positive-dental.vercel.app";
var SB_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
var SB_KEY = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

module.exports = function (req, res) {
  var headers = {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
  };

  var now = new Date().toISOString().split("T")[0];

  Promise.all([
    fetch(SB_URL + "/rest/v1/services?select=id,title,is_active&is_active=eq.true&order=sort_order.asc", { headers: headers })
      .then(function (r) { return r.json(); })
      .catch(function () { return []; }),
    fetch(SB_URL + "/rest/v1/doctors?select=id,name,is_active&is_active=eq.true&order=sort_order.asc", { headers: headers })
      .then(function (r) { return r.json(); })
      .catch(function () { return []; }),
  ]).then(function (results) {
    var services = Array.isArray(results[0]) ? results[0] : [];
    var doctors = Array.isArray(results[1]) ? results[1] : [];

    var urls = [];

    services.forEach(function (s) {
      urls.push([
        "  <url>",
        "    <loc>" + SITE_URL + "/hizmetlerimiz/" + s.id + "</loc>",
        "    <lastmod>" + now + "</lastmod>",
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n"));
    });

    doctors.forEach(function (d) {
      urls.push([
        "  <url>",
        "    <loc>" + SITE_URL + "/doktorlarimiz/" + d.id + "</loc>",
        "    <lastmod>" + now + "</lastmod>",
        "    <changefreq>monthly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n"));
    });

    var xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls.join("\n"),
      "</urlset>",
    ].join("\n");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml);
  }).catch(function () {
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  });
};
