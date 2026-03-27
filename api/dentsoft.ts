const BASE = "https://api.dentsoft.com.tr/Api/v1";
const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC_NISANTASI = process.env.DENTSOFT_CLINIC_ID_NISANTASI || "";

const ALLOWED_PATHS = [
  "Clinic/List", "Clinic/DoctorList",
  "Appointment/Doctor", "Appointment/List", "Appointment/New",
  "Appointment/Info", "Appointment/ReNew", "Appointment/Cancel",
  "Patient/ClinicInfo",
];

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const apiPath = url.searchParams.get("path") || "";

    if (!apiPath) {
      return new Response(JSON.stringify({ error: "path parametresi gerekli", hint: "?path=Clinic/DoctorList" }), {
        status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!ALLOWED_PATHS.some(p => apiPath.startsWith(p))) {
      return new Response(JSON.stringify({ error: "Izin yok", path: apiPath }), {
        status: 403, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!TOKEN) {
      return new Response(JSON.stringify({ error: "DENTSOFT_BEARER_TOKEN env eksik" }), {
        status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const query = new URLSearchParams();
    url.searchParams.forEach((val, key) => { if (key !== "path") query.set(key, val); });
    if (!query.has("ClinicID") && CLINIC_NISANTASI) query.set("ClinicID", CLINIC_NISANTASI);

    const targetUrl = `${BASE}/${apiPath}${query.toString() ? "?" + query.toString() : ""}`;

    const fetchOpts: RequestInit = {
      method: req.method || "GET",
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
    };

    if (req.method === "POST" || req.method === "PUT") {
      try {
        const body = await req.json();
        const fd = new URLSearchParams();
        for (const [k, v] of Object.entries(body)) { if (v != null) fd.set(k, String(v)); }
        fetchOpts.body = fd.toString();
        (fetchOpts.headers as Record<string, string>)["Content-Type"] = "application/x-www-form-urlencoded";
      } catch {}
    }

    const res = await fetch(targetUrl, fetchOpts);
    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": req.method === "GET" ? "s-maxage=60, stale-while-revalidate=300" : "no-store",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Proxy hatası", detail: err.message }), {
      status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
