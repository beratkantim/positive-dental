import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";
import {
  fetchHomeData,
  fetchServicesData,
  fetchLocationsData,
  fetchBlogData,
  fetchBlogPostData,
  fetchPriceListData,
  fetchDoctorsData,
  fetchAppointmentData,
} from "./lib/data-fetchers";
import { generateMetaTags } from "./lib/meta-tags";

// ── HTML template — build çıktısından oku ───────────────────────────────────────
let htmlTemplate: string;
try {
  htmlTemplate = readFileSync(join(__dirname, "..", "dist", "index.html"), "utf-8");
} catch {
  try {
    htmlTemplate = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
  } catch {
    htmlTemplate = "";
  }
}

// ── Route → fetcher eşleştirmesi ────────────────────────────────────────────────
type Fetcher = (slug?: string) => Promise<Record<string, any>>;

const ROUTE_MAP: Record<string, Fetcher> = {
  "/": fetchHomeData,
  "/hizmetlerimiz": fetchServicesData,
  "/kliniklerimiz": fetchLocationsData,
  "/blog": fetchBlogData,
  "/fiyat-listesi": fetchPriceListData,
  "/doktorlarimiz": fetchDoctorsData,
  "/randevu": fetchAppointmentData,
};

// Cache süreleri (saniye)
const CACHE_MAP: Record<string, string> = {
  "/": "s-maxage=3600, stale-while-revalidate=86400",
  "/hizmetlerimiz": "s-maxage=3600, stale-while-revalidate=86400",
  "/kliniklerimiz": "s-maxage=3600, stale-while-revalidate=86400",
  "/blog": "s-maxage=1800, stale-while-revalidate=3600",
  "/fiyat-listesi": "s-maxage=3600, stale-while-revalidate=86400",
  "/doktorlarimiz": "s-maxage=3600, stale-while-revalidate=86400",
  "/randevu": "s-maxage=3600, stale-while-revalidate=86400",
};

// Statik sayfalar (veri yok, sadece meta)
const STATIC_ROUTES = [
  "/hakkimizda",
  "/iletisim",
  "/cocuk-dis-hekimligi",
  "/anlasmali-kurumlar",
  "/anlasmali-sigortalar",
];

// ── Handler ─────────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Template yoksa fallback — SPA olarak devam et
  if (!htmlTemplate) {
    return res.status(500).send("SSR template not found — SPA fallback");
  }

  const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
  const path = url.pathname;

  // Admin paneli — dokunma
  if (path.startsWith("/admin")) {
    return res.setHeader("Content-Type", "text/html").send(htmlTemplate);
  }

  // Static assets — bu noktaya gelmemeli (vercel.json'da handle edilir)
  if (path.startsWith("/assets/") || path.match(/\.(js|css|png|jpg|webp|svg|ico|woff2?)$/)) {
    return res.status(404).send("Not found");
  }

  try {
    let data: Record<string, any> = {};
    let cacheControl = "s-maxage=86400, stale-while-revalidate=604800"; // default: statik

    // Blog post (dinamik slug)
    if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "");
      data = await fetchBlogPostData(slug);
      cacheControl = "s-maxage=3600, stale-while-revalidate=86400";
    }
    // Bilinen data route'ları
    else if (ROUTE_MAP[path]) {
      data = await ROUTE_MAP[path]();
      cacheControl = CACHE_MAP[path] || cacheControl;
    }
    // Statik sayfalar — sadece meta tag
    else if (STATIC_ROUTES.includes(path)) {
      // data boş kalır, sadece meta enjekte edilir
    }

    // Meta tag'leri üret
    const metaTags = generateMetaTags(path, data);

    // HTML'e enjekte et
    let html = htmlTemplate;

    // 1) Mevcut <title> ve <meta description>'ı değiştir
    html = html.replace(/<title>[^<]*<\/title>/, "");
    html = html.replace(/<meta\s+name="description"[^>]*\/>/, "");
    html = html.replace(/<meta\s+property="og:title"[^>]*\/>/, "");
    html = html.replace(/<meta\s+property="og:description"[^>]*\/>/, "");
    html = html.replace(/<meta\s+property="og:url"[^>]*\/>/, "");
    html = html.replace(/<link\s+rel="canonical"[^>]*\/>/, "");

    // 2) Meta tag'leri <head>'e ekle
    html = html.replace("</head>", `    ${metaTags}\n  </head>`);

    // 3) SSR data'yı enjekte et (boş değilse)
    if (Object.keys(data).length > 0) {
      const script = `<script>window.__SSR_DATA__=${JSON.stringify({ route: path, data })}</script>`;
      html = html.replace("</head>", `    ${script}\n  </head>`);
    }

    // Cache header
    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (err) {
    // Hata durumunda SPA fallback — hiçbir şey kırılmaz
    console.error("SSR error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(htmlTemplate);
  }
}
