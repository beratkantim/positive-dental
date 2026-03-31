import { useState, useEffect, useRef } from "react";
import { uploadImage, deleteImage } from "./image-utils";

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
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

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
