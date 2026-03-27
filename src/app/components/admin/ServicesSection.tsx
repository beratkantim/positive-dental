import { useState, useEffect } from "react";
import {
  supabase, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, ImageUpload, type Service,
} from "./shared";

const GRADIENT_OPTIONS = [
  { label: "Teal-Cyan", from: "from-teal-500", to: "to-cyan-600" },
  { label: "İndigo-Violet", from: "from-indigo-500", to: "to-violet-600" },
  { label: "Violet-Purple", from: "from-violet-500", to: "to-purple-600" },
  { label: "Sky-Blue", from: "from-sky-500", to: "to-blue-600" },
  { label: "Pink-Rose", from: "from-pink-500", to: "to-rose-500" },
  { label: "Amber-Orange", from: "from-amber-500", to: "to-orange-500" },
  { label: "Emerald-Green", from: "from-emerald-500", to: "to-green-600" },
];

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("services").update({ is_active: !val }).eq("id", id);
    load();
  };

  const toggleFeatured = async (id: string, val: boolean) => {
    await supabase.from("services").update({ is_featured: !val }).eq("id", id);
    load();
  };

  const deleteService = async (id: string) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Hizmetler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{services.length} hizmet kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Hizmet
        </button>
      </div>

      {showForm && (
        <ServiceForm
          service={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : services.length === 0 ? (
          <EmptyState icon="🦷" title="Hizmet bulunamadı" desc="Yeni hizmet eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color_from} ${s.color_to} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{s.title}</p>
                    <Badge color={s.is_active ? "green" : "gray"}>
                      {s.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                    {s.is_featured && <Badge color="amber">Öne Çıkan</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{s.description}</p>
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
                  <button onClick={() => deleteService(s.id)}
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

function ServiceForm({ service, onSave, onCancel }: {
  service: Service | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    icon: service?.icon || "",
    color_from: service?.color_from || "from-indigo-500",
    color_to: service?.color_to || "to-violet-600",
    image: service?.image || "",
    price_range: service?.price_range || "",
    features: service?.features?.join("\n") || "",
    is_featured: service?.is_featured || false,
    is_active: service?.is_active ?? true,
    sort_order: service?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
    };
    if (service?.id) {
      await supabase.from("services").update(payload).eq("id", service.id);
    } else {
      await supabase.from("services").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  const selectedGradient = GRADIENT_OPTIONS.find(g => g.from === form.color_from) || GRADIENT_OPTIONS[1];

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{service ? "Hizmet Düzenle" : "Yeni Hizmet"}</h3>

      {/* Önizleme */}
      <div className="mb-6 p-5 bg-white rounded-2xl border border-gray-100 flex gap-5 items-start">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${form.color_from} ${form.color_to} flex items-center justify-center text-3xl flex-shrink-0`}>
          {form.icon || "🦷"}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{form.title || "Hizmet Başlığı"}</h4>
          <p className="text-gray-500 text-sm mt-1">{form.description || "Açıklama..."}</p>
          {form.features && (
            <ul className="mt-2 space-y-1">
              {form.features.split("\n").filter(Boolean).slice(0, 3).map((f, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-center gap-1">✓ {f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Başlık" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
        <FormField label="İkon (emoji)" value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />

        <div className="md:col-span-2">
          <FormField label="Açıklama" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gradient Renk</label>
          <select
            value={`${form.color_from}|${form.color_to}`}
            onChange={e => {
              const [from, to] = e.target.value.split("|");
              setForm(f => ({ ...f, color_from: from, color_to: to }));
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none"
          >
            {GRADIENT_OPTIONS.map(g => (
              <option key={g.label} value={`${g.from}|${g.to}`}>{g.label}</option>
            ))}
          </select>
        </div>

        <FormField label="Fiyat Aralığı" value={form.price_range} onChange={v => setForm(f => ({ ...f, price_range: v }))} />

        <div className="md:col-span-2">
          <FormField label="Özellikler (her satıra bir)" value={form.features} onChange={v => setForm(f => ({ ...f, features: v }))} multiline />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            currentUrl={form.image}
            bucket="services"
            fileName={form.title ? slugify(form.title) : ""}
            onUploaded={url => setForm(f => ({ ...f, image: url }))}
            label="Hizmet Fotoğrafı"
            hint="400x176px, yatay, 16:7 oran"
          />
        </div>
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Öne Çıkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Aktif</span>
          </label>
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
