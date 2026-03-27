// ── DentSoft API Client ────────────────────────────────────────
// Tüm istekler Vercel proxy üzerinden geçer: /api/dentsoft/...
// Token ve ClinicID sunucu tarafında eklenir.

const PROXY = "/api/dentsoft";

// ── Types ──────────────────────────────────────────────────────

export interface DentsoftStatus {
  Code: number;
  Message: string;
}

export interface DentsoftResponse<T = any> {
  Status: DentsoftStatus;
  Response: T;
  Error: any[];
}

// Klinik
export interface DentsoftClinic {
  ID: string;
  Name: string;
  Service?: string;
  OptiC?: string;
  WorkDay?: string;
  WorkBegin?: string;
  WorkEnd?: string;
  ContactData?: {
    ContactCity?: string;
    ContactDistrict?: string;
    ContactAddress?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    ContactWeb?: string;
    ContactMap?: string;
  };
}

// Doktor
export interface DentsoftDoctor {
  ID: string;
  Title?: string;
  Name: string;
  OptiC?: string;
  Avatar?: string;
  Salon?: string;
  WorkingHoursDaily?: {
    Work?: { Start?: string; End?: string };
    Online?: { Start?: string; End?: string };
  };
  Slience?: any[];
  RecordDay?: { Date?: string; Time?: { Start?: string; End?: string } }[];
}

// Slot
export interface DentsoftSlot {
  Type: "Available" | "NotAvailable" | "BreakTime";
  Begin?: string;
  End?: string;
}

export interface DentsoftSlotDay {
  Date: string;
  Slots: DentsoftSlot[];
}

// Randevu
export interface DentsoftAppointment {
  Appointment: {
    ID: string;
    BeginDate: string;
    BeginTime: string;
    EndTime: string;
    PNR: string;
    Note: string;
    Ico: string;
    CallType: number;
    Status: { ID: string; Text: string };
    TreatmentType: { ID: string | false; Text: string };
    Url: string;
  };
  User: {
    ID: string;
    User: string;
    Avatar: string;
  };
  Patient: {
    ID: string;
    Patient: string;
    PatientSex: string;
    Region: string | null;
    Mobile: string | null;
    Email: string | null;
    Avatar: string;
  };
}

// ── Helper ─────────────────────────────────────────────────────

async function dsGet<T>(path: string, params?: Record<string, string>): Promise<DentsoftResponse<T>> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${PROXY}/${path}${qs}`);
  if (!res.ok) throw new Error(`Dentsoft API hatası: ${res.status}`);
  return res.json();
}

async function dsPost<T>(path: string, params?: Record<string, string>, body?: Record<string, any>): Promise<DentsoftResponse<T>> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${PROXY}/${path}${qs}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Dentsoft API hatası: ${res.status}`);
  return res.json();
}

async function dsPut<T>(path: string, body?: Record<string, any>): Promise<DentsoftResponse<T>> {
  const res = await fetch(`${PROXY}/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Dentsoft API hatası: ${res.status}`);
  return res.json();
}

// ── API Fonksiyonları ──────────────────────────────────────────

/** Klinik listesi (ClinicID otomatik eklenir proxy'de) */
export async function getDoctors(clinicId?: string) {
  const params: Record<string, string> = {};
  if (clinicId) params.ClinicID = clinicId;
  const res = await dsGet<any>("Clinic/DoctorList", params);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);

  // Response yapısı: { Clinic: [...], SubClinic: [...] }
  // Doktorlar Clinic array'inin içindeki Team objeleri
  const doctors: DentsoftDoctor[] = [];
  const clinics = res.Response?.Clinic || [];

  for (const clinic of clinics) {
    if (clinic.Team) {
      for (const team of clinic.Team) {
        doctors.push(team);
      }
    }
  }

  // Eğer direkt array gelirse
  if (Array.isArray(res.Response)) {
    return res.Response as DentsoftDoctor[];
  }

  return doctors;
}

/** Doktor müsait slotları */
export async function getDoctorSlots(
  teamId: string,
  options?: { clinicId?: string; date?: string; range?: string; available?: "Available" | "NotAvailable" }
) {
  const params: Record<string, string> = { TeamID: teamId };
  if (options?.clinicId) params.ClinicID = options.clinicId;
  if (options?.date) params.Date = options.date;
  if (options?.range) params.Range = options.range;
  if (options?.available) params.Available = options.available;

  const res = await dsGet<any>("Appointment/Doctor", params);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}

/** Randevu listesi */
export async function getAppointments(
  dateStart: string,
  dateEnd: string,
  clinicId?: string
) {
  const params: Record<string, string> = { DateStart: dateStart, DateEnd: dateEnd };
  if (clinicId) params.ClinicID = clinicId;

  const res = await dsGet<DentsoftAppointment[]>("Appointment/List", params);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}

/** Yeni randevu oluştur */
export async function createAppointment(
  teamId: string,
  data: {
    BeginTime: string;   // "09:00"
    Date: string;        // "YYYY/MM/DD"
    PatientFirstName: string;
    PatientLastName: string;
    ContactRegion: string; // "90"
    ContactMobile: string; // "05320000000"
    PatientNumber: string; // TCKN
    ContactEmail?: string;
    PatientBirthday?: string;
    CompanyCode?: string;
    Language?: string;
  },
  clinicId?: string
) {
  const params: Record<string, string> = { TeamID: teamId };
  if (clinicId) params.ClinicID = clinicId;

  const res = await dsPost<any>(`Appointment/New`, params, data);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}

/** Randevu bilgisi getir */
export async function getAppointmentInfo(
  bni: string,
  patientNumber: string,
  companyCode?: string
) {
  const body: Record<string, any> = { BNI: bni, PatientNumber: patientNumber };
  if (companyCode) body.CompanyCode = companyCode;

  const res = await dsPut<any>("Appointment/Info", body);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}

/** Randevu iptal */
export async function cancelAppointment(bni: string, patientNumber: string) {
  const res = await dsPost<any>("Appointment/Cancel", undefined, {
    BNI: bni,
    PatientNumber: patientNumber,
  });
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}

/** Randevu değiştir */
export async function rescheduleAppointment(
  teamId: string,
  data: {
    BeginTime: string;
    Date: string;
    BNI: string;
    PatientNumber: string;
  },
  clinicId?: string
) {
  const params: Record<string, string> = { TeamID: teamId };
  if (clinicId) params.ClinicID = clinicId;

  const res = await dsPost<any>("Appointment/ReNew", params, data);
  if (res.Status.Code !== 100) throw new Error(res.Status.Message);
  return res.Response;
}
