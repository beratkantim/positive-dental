const BASE = "https://api.dentsoft.com.tr/Api/v1";
const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC = process.env.DENTSOFT_CLINIC_ID_NISANTASI || "";

const ALLOWED = ["Clinic/List","Clinic/DoctorList","Appointment/Doctor","Appointment/List","Appointment/New","Appointment/Info","Appointment/ReNew","Appointment/Cancel","Patient/ClinicInfo"];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const apiPath = req.query.path || "";
    if (!apiPath) return res.status(400).json({ error: "path parametresi gerekli" });
    if (!ALLOWED.some(a => apiPath.startsWith(a))) return res.status(403).json({ error: "Izin yok" });
    if (!TOKEN) return res.status(500).json({ error: "DENTSOFT_BEARER_TOKEN env eksik" });

    const query = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => { if (k !== "path") query.set(k, v); });
    if (!query.has("ClinicID") && CLINIC) query.set("ClinicID", CLINIC);

    const url = `${BASE}/${apiPath}${query.toString() ? "?" + query.toString() : ""}`;

    const opts = { method: req.method || "GET", headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" } };

    if (req.method === "POST" || req.method === "PUT") {
      if (req.body && typeof req.body === "object") {
        const fd = new URLSearchParams();
        Object.entries(req.body).forEach(([k, v]) => { if (v != null) fd.set(k, String(v)); });
        opts.body = fd.toString();
        opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }

    const response = await fetch(url, opts);
    const data = await response.json();
    if (req.method === "GET") res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy hatası", detail: err.message });
  }
};
