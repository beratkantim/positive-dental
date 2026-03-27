export default function handler() {
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://positive-dental.vercel.app/sitemap.xml
`;

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
