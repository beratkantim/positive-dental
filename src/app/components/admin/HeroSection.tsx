import { useState, useEffect } from "react";
import { supabase, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload, type HeroSlide } from "./shared";

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
    setSlides(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("hero_slides").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Bu slide'ı silmek istediğinize emin misiniz?")) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Hero Slider</h1>
          <p className="text-gray-500 text-sm mt-0.5">{slides.length} slide kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Slide
        </button>
      </div>

      {showForm && (
        <HeroForm
          slide={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : slides.length === 0 ? (
          <EmptyState icon="🖼️" title="Slide bulunamadı" desc="Ana sayfaya slider eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {slides.map((s, i) => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className="w-20 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {s.image ? (
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg text-gray-300">🖼️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 truncate">{s.title}</p>
                    {s.tag && <Badge color="indigo">{s.tag}</Badge>}
                    <Badge color={s.is_active ? "green" : "gray"}>
                      {s.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                    <span className="text-xs text-gray-400">Sıra: {s.sort_order}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{s.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(s); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(s.id, s.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {s.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteSlide(s.id)}
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

function HeroForm({ slide, onSave, onCancel }: {
  slide: HeroSlide | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    tag: slide?.tag || "",
    tag_color: slide?.tag_color || "text-violet-300",
    title: slide?.title || "",
    title_gradient: slide?.title_gradient || "from-indigo-400 via-violet-400 to-purple-400",
    subtitle: slide?.subtitle || "",
    badge: slide?.badge || "",
    image: slide?.image || "",
    features: slide?.features?.join("\n") || "",
    is_active: slide?.is_active ?? true,
    sort_order: slide?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
    };
    if (slide?.id) {
      await supabase.from("hero_slides").update(payload).eq("id", slide.id);
    } else {
      await supabase.from("hero_slides").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  const imageFileName = form.title ? `hero_${slugify(form.title)}` : "";

  // Gradient seçenekleri
  const GRADIENT_OPTIONS = [
    { label: "İndigo-Violet", value: "from-indigo-400 via-violet-400 to-purple-400" },
    { label: "Teal-Cyan", value: "from-teal-300 via-cyan-300 to-indigo-300" },
    { label: "Amber-Orange", value: "from-amber-300 via-orange-300 to-rose-300" },
    { label: "Emerald-Teal", value: "from-emerald-300 via-teal-300 to-cyan-300" },
    { label: "Rose-Pink", value: "from-rose-300 via-pink-300 to-violet-300" },
    { label: "Sky-Blue", value: "from-sky-300 via-blue-300 to-indigo-300" },
  ];

  const TAG_COLOR_OPTIONS = [
    { label: "Violet", value: "text-violet-300" },
    { label: "Teal", value: "text-teal-300" },
    { label: "Amber", value: "text-amber-300" },
    { label: "Rose", value: "text-rose-300" },
    { label: "Sky", value: "text-sky-300" },
    { label: "Emerald", value: "text-emerald-300" },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{slide ? "Slide Düzenle" : "Yeni Slide"}</h3>

      {/* Önizleme */}
      <div className="mb-6 rounded-2xl overflow-hidden relative" style={{ height: 180, background: "#0D1235" }}>
        {form.image && (
          <img src={form.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="relative p-6 flex flex-col justify-center h-full">
          {form.tag && (
            <span className={`text-xs font-bold mb-2 ${form.tag_color}`}>{form.tag}</span>
          )}
          <h4 className="text-white font-black text-xl leading-tight whitespace-pre-line">
            {form.title || "Başlık buraya gelecek"}
          </h4>
          {form.subtitle && (
            <p className="text-white/50 text-sm mt-1 line-clamp-2">{form.subtitle}</p>
          )}
          {form.badge && (
            <span className="mt-2 inline-block text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full w-fit">{form.badge}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Etiket (Tag)" value={form.tag} onChange={v => setForm(f => ({ ...f, tag: v }))} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Etiket Rengi</label>
          <select value={form.tag_color} onChange={e => setForm(f => ({ ...f, tag_color: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            {TAG_COLOR_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <FormField label="Başlık (satır atlamak için Enter)" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} multiline />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Başlık Gradient</label>
          <select value={form.title_gradient} onChange={e => setForm(f => ({ ...f, title_gradient: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            {GRADIENT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <FormField label="Rozet (Badge)" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} />

        <div className="md:col-span-2">
          <FormField label="Alt Başlık" value={form.subtitle} onChange={v => setForm(f => ({ ...f, subtitle: v }))} multiline />
        </div>

        <div className="md:col-span-2">
          <FormField label="Özellikler (her satıra bir)" value={form.features} onChange={v => setForm(f => ({ ...f, features: v }))} multiline />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.image}
            bucket="hero"
            fileName={imageFileName}
            onUploaded={url => setForm(f => ({ ...f, image: url }))}
            label="Slide Görseli"
          />
        </div>

        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />

        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-700">Aktif</label>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-indigo-500" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
          </button>
          <span className="text-sm text-gray-500">{form.is_active ? "Evet" : "Hayır"}</span>
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
