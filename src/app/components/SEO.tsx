import { Helmet } from "react-helmet-async";

const SITE_NAME = "Positive Dental Studio";
const SITE_URL = "https://positivedental.com";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?w=1200&q=80";
const DEFAULT_DESCRIPTION =
  "Positive Dental Studio — İstanbul, Ankara, İzmir ve Antalya'da modern diş kliniği. İmplant, estetik diş hekimliği, ortodonti ve çocuk diş hekimliği. Ücretsiz ilk muayene.";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
  schemaType?: "dental" | "blog" | "none";
  noindex?: boolean;
}

const DENTAL_CLINIC_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Positive Dental Studio",
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  telephone: "+908501234567",
  email: "info@positivedental.com",
  priceRange: "₺₺₺",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "18:00",
    },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Caferağa Mah., Moda Cad. No:45/3",
      addressLocality: "Kadıköy",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1248",
    bestRating: "5",
  },
  medicalSpecialty: [
    "Dentistry",
    "OralImplantology",
    "OrthodonticsOrthopaedicDentistry",
    "PediatricDentistry",
    "Periodontics",
  ],
  image: DEFAULT_IMAGE,
  sameAs: [
    "https://www.instagram.com/positivedental",
    "https://www.facebook.com/positivedental",
    "https://twitter.com/positivedental",
  ],
};

const BREADCRUMB_SCHEMA = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = DEFAULT_IMAGE,
  url = "",
  type = "website",
  publishedAt,
  author,
  schemaType = "dental",
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Modern Diş Kliniği`;
  const fullUrl = `${SITE_URL}${url}`;
  const defaultKeywords = [
    "diş kliniği",
    "diş hekimi",
    "positive dental",
    "implant",
    "ortodonti",
    "estetik diş hekimliği",
    "istanbul diş",
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  return (
    <Helmet>
      {/* ── Basic ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* ── Open Graph ── */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="tr_TR" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@positivedental" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ── Article specific ── */}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* ── JSON-LD ── */}
      {schemaType === "dental" && (
        <script type="application/ld+json">
          {JSON.stringify(DENTAL_CLINIC_SCHEMA)}
        </script>
      )}
    </Helmet>
  );
}

interface BlogSEOProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  author: string;
  publishedAt: string;
  keywords: string[];
  category: string;
}

export function BlogPostSEO({
  title,
  description,
  image,
  slug,
  author,
  publishedAt,
  keywords,
  category,
}: BlogSEOProps) {
  const fullTitle = `${title} | Positive Dental Studio Blog`;
  const fullUrl = `${SITE_URL}/blog/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: title,
    description,
    image,
    url: fullUrl,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author,
      worksFor: {
        "@type": "Dentist",
        name: "Positive Dental Studio",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Positive Dental Studio",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    about: {
      "@type": "MedicalCondition",
      name: category,
    },
    medicalAudience: {
      "@type": "Patient",
    },
    keywords: keywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };

  const breadcrumbSchema = BREADCRUMB_SCHEMA([
    { name: "Ana Sayfa", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: title, url: fullUrl },
  ]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Positive Dental Studio" />
      <meta property="og:locale" content="tr_TR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="article:published_time" content={publishedAt} />
      <meta property="article:author" content={author} />
      <meta property="article:section" content={category} />

      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
}
