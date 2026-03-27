import { useState, useEffect } from "react";
import {
  supabase, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, ImageUpload, type Service,
} from "./shared";
import type { TreatmentCategory } from "../../../lib/supabase";

const GRADIENT_OPTIONS = [
  { label: "Teal-Cyan", from: "from-teal-500", to: "to-cyan-600" },
  { label: "İndigo-Violet", from: "from-indigo-500", to: "to-violet-600" },
  { label: "Violet-Purple", from: "from-violet-500", to: "to-purple-600" },
  { label: "Sky-Blue", from: "from-sky-500", to: "to-blue-600" },
  { label: "Pink-Rose", from: "from-pink-500", to: "to-rose-500" },
  { label: "Amber-Orange", from: "from-amber-500", to: "to-orange-500" },
  { label: "Emerald-Green", from: "from-emerald-500", to: "to-green-600" },
];

/* ═══════════════════════════════════════════════════════════
   TAB: Tedaviler (Hizmetler + Kategoriler)
   ═══════════════════════════════════════════════════════════ */
export function ServicesSection() {
  const [tab, setTab] = useState<"treatments" | "categories">("treatments");

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("treatments")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
            tab === "treatments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🦷 Tedaviler
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
            tab === "categories" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📁 Tedavi Kategorileri
        </button>
      </div>

      {tab === "treatments" ? <TreatmentsList /> : <CategoriesList />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tedaviler Listesi (eski hizmetler)
   ═══════════════════════════════════════════════════════════ */
function TreatmentsList() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [svc, cats] = await Promise.all([
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("treatment_categories").select("*").order("sort_order"),
    ]);
    setServices(svc.data || []);
    setCategories(cats.data || []);
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
    if (!confirm("Bu tedaviyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return "Kategorisiz";
    return categories.find(c => c.id === catId)?.name || "Kategorisiz";
  };

  const filtered = filterCat === "all"
    ? services
    : filterCat === "none"
      ? services.filter(s => !s.category_id)
      : services.filter(s => s.category_id === filterCat);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tedaviler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{services.length} tedavi kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Tedavi
        </button>
      </div>

      {/* Kategori filtresi */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterCat === "all" ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}>
            Tümü ({services.length})
          </button>
          {categories.map(c => {
            const count = services.filter(s => s.category_id === c.id).length;
            return (
              <button key={c.id} onClick={() => setFilterCat(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterCat === c.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}>
                {c.icon} {c.name} ({count})
              </button>
            );
          })}
          <button onClick={() => setFilterCat("none")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterCat === "none" ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}>
            ❓ Kategorisiz ({services.filter(s => !s.category_id).length})
          </button>
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={editing}
          categories={categories}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon="🦷" title="Tedavi bulunamadı" desc="Yeni tedavi eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(s => (
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
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {getCategoryName(s.category_id)}
                    </span>
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
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tedavi Formu
   ═══════════════════════════════════════════════════════════ */
function ServiceForm({ service, categories, onSave, onCancel }: {
  service: Service | null;
  categories: TreatmentCategory[];
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
    category_id: service?.category_id || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
      category_id: form.category_id || null,
    };
    if (service?.id) {
      await supabase.from("services").update(payload).eq("id", service.id);
    } else {
      await supabase.from("services").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{service ? "Tedavi Düzenle" : "Yeni Tedavi"}</h3>

      {/* Önizleme */}
      <div className="mb-6 p-5 bg-white rounded-2xl border border-gray-100 flex gap-5 items-start">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${form.color_from} ${form.color_to} flex items-center justify-center text-3xl flex-shrink-0`}>
          {form.icon || "🦷"}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{form.title || "Tedavi Başlığı"}</h4>
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

        {/* Kategori seçimi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tedavi Kategorisi</label>
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none"
          >
            <option value="">— Kategori Seçin —</option>
            {categories.filter(c => c.is_active).map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

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
            label="Tedavi Fotoğrafı"
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

/* ═══════════════════════════════════════════════════════════
   Tedavi Kategorileri CRUD
   ═══════════════════════════════════════════════════════════ */
function CategoriesList() {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TreatmentCategory | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("treatment_categories").select("*").order("sort_order");
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("treatment_categories").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Altındaki tedaviler kategorisiz kalacak.")) return;
    await supabase.from("treatment_categories").delete().eq("id", id);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tedavi Kategorileri</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} kategori kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Kategori
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : categories.length === 0 ? (
          <EmptyState icon="📁" title="Kategori bulunamadı" desc="Yeni kategori eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <Badge color={c.is_active ? "green" : "gray"}>
                      {c.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                    <span className="text-[10px] text-gray-400 font-mono">/{c.slug}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{c.description || "—"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(c); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(c.id, c.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {c.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteCategory(c.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Kategori Formu
   ═══════════════════════════════════════════════════════════ */
function CategoryForm({ category, onSave, onCancel }: {
  category: TreatmentCategory | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    icon: category?.icon || "🦷",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: category ? f.slug : slugify(name), // sadece yeni kayıtta otomatik slug
    }));
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };
    if (category?.id) {
      await supabase.from("treatment_categories").update(payload).eq("id", category.id);
    } else {
      await supabase.from("treatment_categories").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{category ? "Kategori Düzenle" : "Yeni Kategori"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Kategori Adı" value={form.name} onChange={handleNameChange} />
        <FormField label="İkon (emoji)" value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
        <FormField label="Slug (URL)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />
        <div className="md:col-span-2">
          <FormField label="Açıklama" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_active}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
          <span className="text-sm font-semibold text-gray-700">Aktif</span>
        </label>
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
