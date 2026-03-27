var SITE_URL = "https://positive-dental.vercel.app";

module.exports = function (req, res) {
  var body = [
    "User-agent: *",
    "Allow: /",
    "",
    "Sitemap: " + SITE_URL + "/sitemap.xml",
    "",
    "# Positive Dental Studio",
    "# https://positive-dental.vercel.app",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.status(200).send(body);
};
