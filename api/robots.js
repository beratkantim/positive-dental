module.exports = function handler(req, res) {
  res.send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://positive-dental.vercel.app/sitemap.xml\n");
};
