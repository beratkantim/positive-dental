// DentSoft API Proxy — Vercel Serverless Function
// Token ve ClinicID sunucu tarafında eklenir, frontend'e sızmaz.

const DENTSOFT_BASE = "https://clinic.dentsoft.com.tr/Api/v1";
const BEARER_TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC_ID = process.env.DENTSOFT_CLINIC_ID || "";

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Path: query parameter "path" ile gelir
    const apiPath = req.query.path || "";
    if (!apiPath) {
      return res.status(400).json({ error: "Missing path parameter" });
    }

    // Query parametrelerinden path'i çıkar, geri kalanı Dentsoft'a ilet
    const params = { ...req.query };
    delete params.path;

    // ClinicID yoksa otomatik ekle
    if (!params.ClinicID) {
      params.ClinicID = CLINIC_ID;
    }

    // URL oluştur
    const qs = new URLSearchParams(params).toString();
    const targetUrl = `${DENTSOFT_BASE}/${apiPath}${qs ? "?" + qs : ""}`;

    console.log("[Dentsoft proxy]", req.method, targetUrl);

    // Fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Accept": "application/json",
      },
    };

    // POST/PUT body
    if (req.method === "POST" || req.method === "PUT") {
      if (req.body && Object.keys(req.body).length > 0) {
        // multipart/form-data olarak gönder (Dentsoft bunu bekliyor)
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(req.body)) {
          formData.append(key, String(value));
        }
        fetchOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
        fetchOptions.body = formData.toString();
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("[Dentsoft proxy error]", error);
    return res.status(500).json({
      error: "Proxy error",
      message: error.message || "Unknown error",
    });
  }
};
