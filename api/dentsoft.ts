// ── Dentsoft API Proxy ─────────────────────────────────────────
// Frontend → /api/dentsoft?path=Clinic/DoctorList&ClinicID=xxx
// Proxy  → https://api.dentsoft.com.tr/Api/v1/Clinic/DoctorList?ClinicID=xxx

const BASE = "https://api.dentsoft.com.tr/Api/v1";
const TOKEN = process.env.DENTSOFT_BEARER_TOKEN || "";
const CLINIC_NISANTASI = process.env.DENTSOFT_CLINIC_ID_NISANTASI || "";

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
      return Response.json({ error: "path parametresi gerekli" }, { status: 400 });
    }

    const isAllowed = ALLOWED_PATHS.some(p => apiPath.startsWith(p));
    if (!isAllowed) {
      return Response.json({ error: "Bu endpoint'e erişim izni yok", path: apiPath }, { status: 403 });
    }

    if (!TOKEN) {
      return Response.json({ error: "Dentsoft Bearer Token yapılandırılmamış" }, { status: 500 });
    }

    // Query params — path hariç hepsini Dentsoft'a ilet
    const query = new URLSearchParams();
    url.searchParams.forEach((val, key) => {
      if (key !== "path") query.set(key, val);
    });

    if (!query.has("ClinicID") && CLINIC_NISANTASI) {
      query.set("ClinicID", CLINIC_NISANTASI);
    }

    const targetUrl = `${BASE}/${apiPath}${query.toString() ? "?" + query.toString() : ""}`;
    console.log("[Dentsoft proxy]", req.method, targetUrl);

    const fetchOpts: RequestInit = {
      method: req.method || "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    };

    if (req.method === "POST" || req.method === "PUT") {
      try {
        const body = await req.json();
        if (body && typeof body === "object") {
          const formData = new URLSearchParams();
          for (const [key, val] of Object.entries(body)) {
            if (val !== undefined && val !== null) formData.set(key, String(val));
          }
          fetchOpts.body = formData.toString();
          (fetchOpts.headers as Record<string, string>)["Content-Type"] = "application/x-www-form-urlencoded";
        }
      } catch {}
    }

    const response = await fetch(targetUrl, fetchOpts);
    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": req.method === "GET" ? "s-maxage=60, stale-while-revalidate=300" : "no-store",
      },
    });
  } catch (err: any) {
    console.error("Dentsoft proxy error:", err);
    return Response.json(
      { error: "Dentsoft API bağlantı hatası", detail: err.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
