const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC = process.env.DENTSOFT_CLINIC_ID || "";
const BASE = "https://clinic.dentsoft.com.tr/Api/v1";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiPath = req.query?.path || "";

  if (!apiPath || apiPath === "health") {
    return res.status(200).json({ ok: true, hasToken: !!TOKEN, hasClinic: !!CLINIC });
  }

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query || {})) {
    if (k !== "path") params.set(k, String(v));
  }
  if (!params.has("ClinicID")) params.set("ClinicID", CLINIC);

  const url = `${BASE}/${apiPath}?${params}`;

  const resp = await fetch(url, {
    method: req.method,
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
  });

  const text = await resp.text();
  try {
    return res.status(200).json(JSON.parse(text));
  } catch {
    return res.status(502).json({ error: "Invalid JSON from Dentsoft", raw: text.substring(0, 200) });
  }
}
