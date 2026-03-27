import type { VercelRequest, VercelResponse } from "@vercel/node";

// ── Dentsoft API Proxy ─────────────────────────────────────────
// Frontend → /api/dentsoft/Clinic/DoctorList?ClinicID=xxx
// Proxy  → https://api.dentsoft.com.tr/Api/v1/Clinic/DoctorList?ClinicID=xxx
//
// Token ve base URL sunucuda kalır, client'a sızmaz.
// Nişantaşı klinik için: DENTSOFT_CLINIC_ID_NISANTASI env var

const BASE = "https://api.dentsoft.com.tr/Api/v1";
const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC_NISANTASI = process.env.DENTSOFT_CLINIC_ID_NISANTASI || "";

// İzin verilen endpoint path'leri (güvenlik)
const ALLOWED_PATHS = [
  "Clinic/List",
  "Clinic/DoctorList",
  "Appointment/Doctor",
  "Appointment/List",
  "Appointment/New",
  "Appointment/Info",
  "Appointment/ReNew",
  "Appointment/Cancel",
  "Patient/ClinicInfo",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Path: /api/dentsoft/Clinic/DoctorList → Clinic/DoctorList
    const pathSegments = req.query.path;
    const apiPath = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments || "";

    // Güvenlik: sadece izinli endpoint'ler
    const isAllowed = ALLOWED_PATHS.some(p => apiPath.startsWith(p));
    if (!isAllowed) {
      return res.status(403).json({ error: "Bu endpoint'e erişim izni yok" });
    }

    // Token kontrolü
    if (!TOKEN) {
      return res.status(500).json({ error: "Dentsoft Bearer Token yapılandırılmamış" });
    }

    // Query string oluştur
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key === "path") continue; // Vercel catch-all param, atla
      if (typeof val === "string") query.set(key, val);
    }

    // ClinicID otomatik ekle (Nişantaşı)
    if (!query.has("ClinicID") && CLINIC_NISANTASI) {
      query.set("ClinicID", CLINIC_NISANTASI);
    }

    const url = `${BASE}/${apiPath}${query.toString() ? "?" + query.toString() : ""}`;

    // Fetch options
    const fetchOpts: RequestInit = {
      method: req.method || "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    };

    // POST/PUT body (multipart/form-data)
    if (req.method === "POST" || req.method === "PUT") {
      if (req.body && typeof req.body === "object") {
        const formData = new URLSearchParams();
        for (const [key, val] of Object.entries(req.body)) {
          if (val !== undefined && val !== null) {
            formData.set(key, String(val));
          }
        }
        fetchOpts.body = formData.toString();
        (fetchOpts.headers as Record<string, string>)["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }

    // Dentsoft API'ye istek
    const response = await fetch(url, fetchOpts);
    const data = await response.json();

    // Cache: GET istekleri 60 saniye cache
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    }

    return res.status(response.status).json(data);
  } catch (err: any) {
    console.error("Dentsoft proxy error:", err);
    return res.status(500).json({
      error: "Dentsoft API bağlantı hatası",
      detail: err.message,
    });
  }
}
