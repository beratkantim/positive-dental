module.exports = function handler(req, res) {
  var txt = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://positive-dental.vercel.app/sitemap.xml\n";
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(txt);
};
