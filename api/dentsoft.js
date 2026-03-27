const https = require("https");

const BASE = "https://clinic.dentsoft.com.tr";
const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC = process.env.DENTSOFT_CLINIC_ID || "";

function fetchJson(url, method, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: method || "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
      },
    };
    const req = https.request(opts, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body.substring(0, 500), parseError: true });
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const apiPath = (req.query && req.query.path) || "";

    // Debug endpoint
    if (!apiPath || apiPath === "health") {
      return res.status(200).json({
        ok: true,
        hasToken: TOKEN.length > 0,
        hasClinic: CLINIC.length > 0,
        tokenPreview: TOKEN ? TOKEN.substring(0, 8) + "..." : "EMPTY",
        clinicId: CLINIC || "EMPTY",
      });
    }

    // Build query params (exclude 'path' from forwarded params)
    const params = new URLSearchParams();
    if (req.query) {
      for (const [k, v] of Object.entries(req.query)) {
        if (k !== "path") params.set(k, String(v));
      }
    }
    if (!params.has("ClinicID")) {
      params.set("ClinicID", CLINIC);
    }

    const targetUrl = BASE + "/Api/v1/" + apiPath + "?" + params.toString();

    const data = await fetchJson(targetUrl, req.method, TOKEN);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy error",
      message: String(error && error.message ? error.message : error),
      stack: String(error && error.stack ? error.stack.substring(0, 300) : ""),
    });
  }
};
