import { useState, useEffect } from "react";
import { supabase, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload, type Testimonial } from "./shared";

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleApprove = async (id: string, val: boolean) => {
    await supabase.from("testimonials").update({ is_approved: !val }).eq("id", id);
    load();
  };

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("testimonials").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Hasta Yorumları</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} yorum · {items.filter(t => t.is_approved).length} onaylı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Yorum
        </button>
      </div>

      {showForm && (
        <TestimonialForm
          testimonial={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="⭐" title="Yorum bulunamadı" desc="Yeni yorum eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(t => (
              <div key={t.id} className="p-5 flex gap-4">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-indigo-600">
                      {t.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <span className="text-amber-400 text-sm">{"★".repeat(t.rating)}</span>
                    <Badge color={t.is_approved ? "green" : "amber"}>
                      {t.is_approved ? "Onaylı" : "Beklemede"}
                    </Badge>
                    {!t.is_active && <Badge color="gray">Pasif</Badge>}
                    {t.branch && <Badge color="indigo">{t.branch}</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.role} · {new Date(t.created_at).toLocaleDateString("tr-TR")}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditing(t); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleApprove(t.id, t.is_approved)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${t.is_approved ? "text-amber-600 bg-amber-50 hover:bg-amber-100" : "text-green-600 bg-green-50 hover:bg-green-100"}`}>
                    {t.is_approved ? "Onayı Kaldır" : "Onayla"}
                  </button>
                  <button onClick={() => toggleActive(t.id, t.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {t.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteItem(t.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function TestimonialForm({ testimonial, onSave, onCancel }: {
  testimonial: Testimonial | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    text: testimonial?.text || "",
    rating: testimonial?.rating || 5,
    image: testimonial?.image || "",
    branch: testimonial?.branch || "",
    is_approved: testimonial?.is_approved ?? true,
    is_active: testimonial?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    if (testimonial?.id) {
      await supabase.from("testimonials").update(form).eq("id", testimonial.id);
    } else {
      await supabase.from("testimonials").insert(form);
    }
    setSaving(false);
    onSave();
  };

  const imageFileName = form.name ? `testimonial_${slugify(form.name)}` : "";

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{testimonial ? "Yorumu Düzenle" : "Yeni Yorum"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Hasta Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Tedavi / Rol" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Puan</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? "text-amber-400" : "text-gray-300"}`}>
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 font-semibold">{form.rating}/5</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şube</label>
          <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="">Tümü / Belirtilmemiş</option>
            <option value="istanbul">İstanbul Nişantaşı</option>
            <option value="adana">Adana Türkmenbaşı</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <FormField label="Yorum Metni" value={form.text} onChange={v => setForm(f => ({ ...f, text: v }))} multiline />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.image}
            bucket="testimonials"
            fileName={imageFileName}
            onUploaded={url => setForm(f => ({ ...f, image: url }))}
            label="Hasta Fotoğrafı"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_approved}
              onChange={e => setForm(f => ({ ...f, is_approved: e.target.checked }))}
              className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Onaylı</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      {/* Önizleme */}
      <div className="mt-5 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Önizleme</p>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: form.rating }).map((_, i) => (
              <span key={i} className="text-amber-400 text-sm">★</span>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{form.text || "Yorum metni..."}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-indigo-600">
                  {form.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{form.name || "İsim"}</p>
              <p className="text-xs text-gray-400">{form.role || "Tedavi türü"}</p>
            </div>
            <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">Doğrulandı</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
          İptal
        </button>
      </div>
    </Card>
  );
}
