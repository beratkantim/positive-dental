const BASE = "https://clinic.dentsoft.com.tr/Api/v1";

const ALLOWED = [
  "Clinic/List", "Clinic/DoctorList",
  "Appointment/Doctor", "Appointment/List", "Appointment/New",
  "Appointment/Info", "Appointment/ReNew", "Appointment/Cancel",
  "Patient/ClinicInfo",
];

// Basit rate limit: IP başına dakikada max 30 istek
var rateMap = {};
function checkRate(ip) {
  var now = Date.now();
  if (!rateMap[ip]) rateMap[ip] = [];
  rateMap[ip] = rateMap[ip].filter(function(t) { return now - t < 60000; });
  if (rateMap[ip].length >= 30) return false;
  rateMap[ip].push(now);
  // Bellek temizliği
  if (Object.keys(rateMap).length > 1000) rateMap = {};
  return true;
}

module.exports = function handler(req, res) {
  var TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
  var CLINIC = process.env.DENTSOFT_CLINIC_ID || "";
  var ORIGIN = req.headers.origin || "";

  // CORS: sadece kendi domain'imiz
  var allowedOrigins = [
    "https://positive-dental.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  // Vercel preview URL'leri de kabul et
  var isVercelPreview = ORIGIN && ORIGIN.endsWith(".vercel.app");
  var corsOrigin = allowedOrigins.includes(ORIGIN) || isVercelPreview ? ORIGIN : allowedOrigins[0];
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Rate limit
  var ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown";
  if (!checkRate(ip)) {
    return res.status(429).json({ error: "Çok fazla istek. Lütfen bekleyin." });
  }

  var apiPath = (req.query && req.query.path) || "";

  // Health check (debug bilgisi sızdırmadan)
  if (!apiPath || apiPath === "health") {
    return res.status(200).json({ ok: true, configured: TOKEN.length > 0 && CLINIC.length > 0 });
  }

  // Path güvenlik kontrolü
  var isAllowed = ALLOWED.some(function(a) { return apiPath.indexOf(a) === 0; });
  if (!isAllowed) {
    return res.status(403).json({ error: "Bu endpoint'e erişim izni yok" });
  }

  if (!TOKEN) {
    return res.status(500).json({ error: "API yapılandırılmamış" });
  }

  var params = new URLSearchParams();
  if (req.query) {
    Object.keys(req.query).forEach(function(k) {
      if (k !== "path") params.set(k, String(req.query[k]));
    });
  }
  if (!params.has("ClinicID")) params.set("ClinicID", CLINIC);

  var url = BASE + "/" + apiPath + "?" + params.toString();

  var fetchOpts = {
    method: req.method || "GET",
    headers: { Authorization: "Bearer " + TOKEN, Accept: "application/json" },
  };

  // POST/PUT body
  if ((req.method === "POST" || req.method === "PUT") && req.body) {
    var fd = new URLSearchParams();
    Object.keys(req.body).forEach(function(k) {
      if (req.body[k] != null) fd.set(k, String(req.body[k]));
    });
    fetchOpts.body = fd.toString();
    fetchOpts.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  fetch(url, fetchOpts)
    .then(function(resp) { return resp.text(); })
    .then(function(text) {
      try {
        res.status(200).json(JSON.parse(text));
      } catch(e) {
        res.status(502).json({ error: "Geçersiz API yanıtı" });
      }
    })
    .catch(function(err) {
      res.status(500).json({ error: "API bağlantı hatası" });
    });
};
