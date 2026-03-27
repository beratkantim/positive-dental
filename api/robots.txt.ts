import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE_URL = "https://positivedental.com";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap_29471.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.status(200).send(txt);
}
