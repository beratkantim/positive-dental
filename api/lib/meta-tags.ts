// ── Dinamik SEO Meta Tag Üretimi ────────────────────────────────────────────────

const SITE = "Positive Dental Studio";
const BASE_URL = "https://positive-dental.vercel.app";

interface MetaConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  jsonLd?: object;
}

function buildTags(c: MetaConfig): string {
  const tags = [
    `<title>${esc(c.title)}</title>`,
    `<meta name="description" content="${esc(c.description)}" />`,
    `<link rel="canonical" href="${esc(c.url)}" />`,
    `<meta property="og:title" content="${esc(c.title)}" />`,
    `<meta property="og:description" content="${esc(c.description)}" />`,
    `<meta property="og:url" content="${esc(c.url)}" />`,
    `<meta property="og:type" content="${c.type || "website"}" />`,
  ];
  if (c.image) {
    tags.push(`<meta property="og:image" content="${esc(c.image)}" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:image" content="${esc(c.image)}" />`);
  }
  if (c.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(c.jsonLd)}</script>`);
  }
  return tags.join("\n    ");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Route bazlı meta tag üretimi ────────────────────────────────────────────────

export function generateMetaTags(path: string, data: Record<string, any>): string {
  // Blog post
  if (path.startsWith("/blog/") && data.blog_post) {
    const p = data.blog_post;
    return buildTags({
      title: `${p.title} — ${SITE}`,
      description: p.meta_description || p.excerpt || "",
      url: `${BASE_URL}${path}`,
      image: p.image,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: p.title,
        description: p.meta_description || p.excerpt,
        image: p.image,
        author: { "@type": "Person", name: p.author },
        datePublished: p.published_at,
        publisher: {
          "@type": "Organization",
          name: SITE,
          url: BASE_URL,
        },
      },
    });
  }

  // Route bazlı statik meta
  const routes: Record<string, MetaConfig> = {
    "/": {
      title: `${SITE} — Adana & İstanbul Diş Kliniği`,
      description: "Adana Türkmenbaşı ve İstanbul Nişantaşı'nda modern diş kliniği. İmplant, estetik diş hekimliği, ortodonti, çocuk diş hekimliği. Ücretsiz ilk muayene.",
      url: BASE_URL,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: SITE,
        url: BASE_URL,
        description: "Adana ve İstanbul'da uzman kadrosuyla hizmet veren modern diş kliniği.",
        address: [
          { "@type": "PostalAddress", addressLocality: "Adana", addressCountry: "TR" },
          { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
        ],
      },
    },
    "/hizmetlerimiz": {
      title: `Hizmetlerimiz — ${SITE}`,
      description: "İmplant, estetik diş hekimliği, ortodonti, endodonti, pedodonti ve daha fazlası. Modern teknoloji ile kaliteli diş tedavisi.",
      url: `${BASE_URL}/hizmetlerimiz`,
    },
    "/hakkimizda": {
      title: `Hakkımızda — ${SITE}`,
      description: "Positive Dental Studio ekibi, vizyonu ve modern diş kliniği anlayışı. Adana ve İstanbul'da hizmetinizdeyiz.",
      url: `${BASE_URL}/hakkimizda`,
    },
    "/kliniklerimiz": {
      title: `Kliniklerimiz — ${SITE}`,
      description: "Adana Türkmenbaşı ve İstanbul Nişantaşı şubelerimiz. Adresler, çalışma saatleri ve iletişim bilgileri.",
      url: `${BASE_URL}/kliniklerimiz`,
    },
    "/iletisim": {
      title: `İletişim — ${SITE}`,
      description: "Positive Dental Studio iletişim bilgileri. Randevu almak veya bilgi almak için bize ulaşın.",
      url: `${BASE_URL}/iletisim`,
    },
    "/cocuk-dis-hekimligi": {
      title: `Çocuk Diş Hekimliği — ${SITE}`,
      description: "Çocuğunuzun diş sağlığı için uzman pedodontistler. Korkusuz, eğlenceli ve güvenli diş tedavisi deneyimi.",
      url: `${BASE_URL}/cocuk-dis-hekimligi`,
    },
    "/blog": {
      title: `Blog — ${SITE}`,
      description: "Diş sağlığı, implant, ortodonti ve estetik diş hekimliği hakkında uzman makaleler ve bilgilendirici yazılar.",
      url: `${BASE_URL}/blog`,
    },
    "/anlasmali-kurumlar": {
      title: `Anlaşmalı Kurumlar — ${SITE}`,
      description: "Positive Dental Studio anlaşmalı kurumlar ve indirim oranları.",
      url: `${BASE_URL}/anlasmali-kurumlar`,
    },
    "/anlasmali-sigortalar": {
      title: `Anlaşmalı Sigortalar — ${SITE}`,
      description: "Positive Dental Studio anlaşmalı sigorta şirketleri ve tamamlayıcı sağlık sigortası bilgileri.",
      url: `${BASE_URL}/anlasmali-sigortalar`,
    },
    "/fiyat-listesi": {
      title: `Fiyat Listesi — ${SITE}`,
      description: "Diş tedavisi fiyatları. İmplant, ortodonti, dolgu, kanal tedavisi ve daha fazlası için güncel fiyat listesi.",
      url: `${BASE_URL}/fiyat-listesi`,
    },
    "/doktorlarimiz": {
      title: `Doktorlarımız — ${SITE}`,
      description: "Uzman diş hekimi kadromuz. Her branşta deneyimli doktorlarımızla tanışın.",
      url: `${BASE_URL}/doktorlarimiz`,
    },
    "/randevu": {
      title: `Online Randevu Al — ${SITE}`,
      description: "Hemen online randevu alın. Adana veya İstanbul şubelerimizde uzman hekimlerimizle görüşün.",
      url: `${BASE_URL}/randevu`,
    },
  };

  const config = routes[path] || {
    title: `${SITE} — Modern Diş Kliniği`,
    description: "Adana ve İstanbul'da uzman kadrosuyla hizmet veren modern diş kliniği.",
    url: `${BASE_URL}${path}`,
  };

  return buildTags(config);
}
