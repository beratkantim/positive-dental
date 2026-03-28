import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

// ── AUDIT LOG ────────────────────────────────────────────────
export async function logAction(action: string, tableName: string, recordId = "", details = "") {
  const { data: session } = await supabase.auth.getSession();
  const email = session?.session?.user?.email || "unknown";
  await supabase.from("audit_logs").insert({
    user_email: email,
    action,
    table_name: tableName,
    record_id: recordId,
    details: details.slice(0, 500),
  }).then(() => {}); // fire and forget
}

// ── IMAGE UPLOAD (WebP dönüştürme + otomatik adlandırma) ─────
export function slugify(text: string): string {
  const trMap: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  return text
    .split("").map(c => trMap[c] || c).join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });
}

export function convertToWebp(dataUrl: string, maxWidth = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas desteklenmiyor")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else reject(new Error("WebP dönüştürme başarısız"));
          },
          "image/webp",
          0.85
        );
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Görsel yüklenemedi"));
    img.src = dataUrl;
  });
}

export async function uploadImage(file: File, bucket: string, fileName: string): Promise<string> {
  const dataUrl = await readFileAsDataURL(file);
  const webpBlob = await convertToWebp(dataUrl);
  const path = `${fileName}.webp`;

  // Önce eski dosyayı silmeyi dene (üzerine yazma sorunu için)
  await supabase.storage.from(bucket).remove([path]);

  // Yeni dosyayı yükle
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, webpBlob, { contentType: "image/webp", upsert: true });

  if (error) throw new Error(`Yükleme hatası: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  // Cache buster ekle — tarayıcı eski görseli cache'den göstermesin
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteImage(bucket: string, url: string): Promise<void> {
  if (!url) return;
  try {
    // URL'den dosya yolunu çıkar
    const parts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length < 2) return;
    const path = parts[1].split("?")[0]; // cache buster'ı kaldır
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Silme başarısız olursa sessizce devam et
  }
}

export function ImageUpload({ currentUrl, bucket, fileName, onUploaded, label = "Fotoğraf", hint }: {
  currentUrl: string;
  bucket: string;
  fileName: string;
  onUploaded: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl);

  useEffect(() => { setPreview(currentUrl); }, [currentUrl]);

  const handleDelete = async () => {
    if (!preview) return;
    if (!confirm("Fotoğrafı silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    await deleteImage(bucket, preview);
    setPreview("");
    onUploaded("");
    setDeleting(false);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/heic", "image/heif", "image/avif"];
    if (!file.type.startsWith("image/") && !validTypes.includes(file.type)) {
      setError("Desteklenen formatlar: JPG, PNG, WebP, GIF, BMP, AVIF");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Yerel önizleme göster
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      // WebP'ye çevir ve yükle
      const url = await uploadImage(file, bucket, fileName);

      URL.revokeObjectURL(localUrl);
      setPreview(url);
      onUploaded(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Yükleme başarısız. Supabase Storage bucket'ını kontrol edin.");
      setPreview(currentUrl);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {hint && <span className="ml-2 font-normal text-xs text-gray-400">({hint})</span>}
      </label>
      <div className="flex items-start gap-4">
        {/* Önizleme */}
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl text-gray-300">📷</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || deleting || !fileName}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
            >
              {uploading ? "Yükleniyor..." : preview ? "Değiştir" : "Fotoğraf Yükle"}
            </button>
            {preview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 transition disabled:opacity-50"
              >
                {deleting ? "Siliniyor..." : "Sil"}
              </button>
            )}
          </div>

          {!fileName && (
            <p className="text-xs text-amber-600">Önce isim alanını doldurun</p>
          )}

          {fileName && (
            <p className="text-xs text-gray-400">
              Dosya adı: <span className="font-mono text-gray-500">{fileName}.webp</span>
            </p>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── TYPES (tek kaynak: src/lib/supabase.ts) ──────────────────
export type { Branch, Doctor, Service, BlogPost, BranchData, Testimonial, ContactMessage, SiteSetting, HeroSlide, PriceItem } from "@/lib/supabase";

export type Section =
  | "dashboard" | "hero" | "doctors" | "services"
  | "blog" | "branches" | "testimonials" | "messages"
  | "prices" | "settings" | "users" | "analytics"
  | "partners" | "insurances" | "pages" | "footer" | "audit_log" | "service_pages";

// ── HELPERS ──────────────────────────────────────────────────
export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </div>
  );
}

export function FormField({ label, value, onChange, multiline = false, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition";
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          rows={3} className={cls} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

// ── PAGINATION ──────────────────────────────────────────────
export function usePagination<T>(items: T[], perPage = 50) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safeP = Math.min(page, totalPages);
  const paged = items.slice((safeP - 1) * perPage, safeP * perPage);
  // Reset to 1 when items change significantly
  useEffect(() => { if (page > totalPages) setPage(1); }, [items.length]);
  return { page: safeP, setPage, totalPages, paged, total: items.length, perPage };
}

export function Pagination({ page, totalPages, setPage, total, perPage }: {
  page: number; totalPages: number; setPage: (p: number) => void; total: number; perPage: number;
}) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  // Show max 5 page buttons around current
  const pages: number[] = [];
  const lo = Math.max(1, page - 2);
  const hi = Math.min(totalPages, page + 2);
  for (let i = lo; i <= hi; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        {start}–{end} / <strong>{total}</strong> kayıt
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => setPage(1)} disabled={page === 1}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          «
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          ‹ Önceki
        </button>
        {lo > 1 && <span className="text-xs text-gray-400">…</span>}
        {pages.map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-8 h-8 text-xs font-bold rounded-lg transition ${p === page ? "bg-indigo-500 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
            {p}
          </button>
        ))}
        {hi < totalPages && <span className="text-xs text-gray-400">…</span>}
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          Sonraki ›
        </button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          »
        </button>
      </div>
    </div>
  );
}

// ── NAV ITEMS ────────────────────────────────────────────────
export const NAV_ITEMS: { id: Section; label: string; icon: string; badge?: string }[] = [
  { id: "dashboard",    label: "Dashboard",        icon: "📊" },
  { id: "hero",         label: "Hero Slider",       icon: "🖼️" },
  { id: "doctors",      label: "Doktorlar",         icon: "👨‍⚕️" },
  { id: "services",     label: "Tedaviler",         icon: "🦷" },
  { id: "blog",         label: "Blog",              icon: "📝" },
  { id: "branches",     label: "Şubeler",           icon: "📍" },
  { id: "testimonials", label: "Yorumlar",          icon: "⭐" },
  { id: "messages",     label: "Mesajlar",          icon: "💬", badge: "!" },
  { id: "prices",       label: "Fiyat Listesi",     icon: "💰" },
  { id: "partners",     label: "Anlaşmalı Kurumlar", icon: "🏢" },
  { id: "insurances",   label: "Sigortalar",         icon: "🛡️" },
  { id: "service_pages", label: "Tedavi Sayfaları",   icon: "📋" },
  { id: "pages",        label: "Sayfa İçerikleri",   icon: "📄" },
  { id: "footer",       label: "Footer",             icon: "🔻" },
  { id: "analytics",    label: "Analitik",           icon: "📈" },
  { id: "settings",     label: "Site Ayarları",     icon: "⚙️" },
  { id: "users",        label: "Kullanıcılar",      icon: "👥" },
  { id: "audit_log",    label: "İşlem Kayıtları",   icon: "📋" },
];
