import { supabase } from "./audit";

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

  await supabase.storage.from(bucket).remove([path]);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, webpBlob, { contentType: "image/webp", upsert: true });

  if (error) throw new Error(`Yükleme hatası: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteImage(bucket: string, url: string): Promise<void> {
  if (!url) return;
  try {
    const parts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length < 2) return;
    const path = parts[1].split("?")[0];
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Silme başarısız olursa sessizce devam et
  }
}
