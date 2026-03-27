var SITE_URL = "https://positive-dental.vercel.app";
var SB_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
var SB_KEY = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

module.exports = function (req, res) {
  var headers = {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
  };

  fetch(SB_URL + "/rest/v1/blog_posts?select=slug,published_at&is_published=eq.true&order=published_at.desc", { headers: headers })
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      if (!Array.isArray(posts)) posts = [];

      var urls = posts.map(function (p) {
        var date = p.published_at ? p.published_at.split("T")[0] : new Date().toISOString().split("T")[0];
        return [
          "  <url>",
          "    <loc>" + SITE_URL + "/blog/" + p.slug + "</loc>",
          "    <lastmod>" + date + "</lastmod>",
          "    <changefreq>monthly</changefreq>",
          "    <priority>0.6</priority>",
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
    })
    .catch(function () {
      var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.status(200).send(xml);
    });
};
