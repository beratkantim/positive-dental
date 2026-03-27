import { useState, useEffect } from "react";
import {
  supabase, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, usePagination, Pagination,
} from "./shared";
import type { TreatmentCategory, Treatment } from "../../../lib/supabase";

/* ═══════════════════════════════════════════════════════════
   TAB: Tedaviler + Kategoriler
   ═══════════════════════════════════════════════════════════ */
export function ServicesSection() {
  const [tab, setTab] = useState<"treatments" | "categories">("treatments");

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("treatments")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === "treatments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          🦷 Tedaviler
        </button>
        <button onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === "categories" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          📁 Tedavi Kategorileri
        </button>
      </div>
      {tab === "treatments" ? <TreatmentsList /> : <CategoriesList />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tedaviler Listesi — treatments tablosundan
   ═══════════════════════════════════════════════════════════ */
function TreatmentsList() {
  const [items, setItems] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [t, c] = await Promise.all([
      supabase.from("treatments").select("*").order("sort_order"),
      supabase.from("treatment_categories").select("*").order("sort_order"),
    ]);
    setItems(t.data || []);
    setCategories(c.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("treatments").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu tedaviyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("treatments").delete().eq("id", id);
    load();
  };

  const getCatName = (catId: string | null) => {
    if (!catId) return "Kategorisiz";
    return categories.find(c => c.id === catId)?.name || "Kategorisiz";
  };

  const getCatIcon = (catId: string | null) => {
    if (!catId) return "❓";
    return categories.find(c => c.id === catId)?.icon || "🦷";
  };

  const filtered = filterCat === "all"
    ? items
    : filterCat === "none"
      ? items.filter(t => !t.category_id)
      : items.filter(t => t.category_id === filterCat);

  const formatPrice = (p: number) => p > 0 ? `₺${p.toLocaleString("tr-TR")}` : "—";
  const { page, setPage, totalPages, paged, total, perPage } = usePagination(filtered, 50);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tedaviler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} tedavi kayıtlı</p>
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterCat === "all" ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
            Tümü ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(t => t.category_id === c.id).length;
            return (
              <button key={c.id} onClick={() => setFilterCat(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterCat === c.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                {c.icon} {c.name} ({count})
              </button>
            );
          })}
          <button onClick={() => setFilterCat("none")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterCat === "none" ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
            ❓ Kategorisiz ({items.filter(t => !t.category_id).length})
          </button>
        </div>
      )}

      {showForm && (
        <TreatmentForm
          treatment={editing}
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
            {paged.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                  {getCatIcon(t.category_id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                    <Badge color={t.is_active ? "green" : "gray"}>
                      {t.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {getCatName(t.category_id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-bold text-indigo-600">{formatPrice(t.price)}</span>
                    {t.discount_rate > 0 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        %{t.discount_rate} İndirim
                      </span>
                    )}
                    {t.duration_minutes > 0 && (
                      <span className="text-xs text-gray-400">{t.duration_minutes} dk</span>
                    )}
                    {t.title_en && (
                      <span className="text-xs text-gray-300 truncate">{t.title_en}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(t); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(t.id, t.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {t.is_active ? "Pasif" : "Aktif"}
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
        <Pagination page={page} totalPages={totalPages} setPage={setPage} total={total} perPage={perPage} />
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tedavi Formu — treatments tablosu
   ═══════════════════════════════════════════════════════════ */
function TreatmentForm({ treatment, categories, onSave, onCancel }: {
  treatment: Treatment | null;
  categories: TreatmentCategory[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: treatment?.title || "",
    title_en: treatment?.title_en || "",
    category_id: treatment?.category_id || "",
    price: treatment?.price || 0,
    discount_rate: treatment?.discount_rate || 0,
    cost: treatment?.cost || 0,
    currency: treatment?.currency || "TL",
    tooth_type: treatment?.tooth_type ?? "",
    duration_minutes: treatment?.duration_minutes || 0,
    exam_type: treatment?.exam_type ?? "",
    is_active: treatment?.is_active ?? true,
    sort_order: treatment?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      category_id: form.category_id || null,
      tooth_type: form.tooth_type !== "" ? Number(form.tooth_type) : null,
      exam_type: form.exam_type !== "" ? Number(form.exam_type) : null,
      price: Number(form.price),
      discount_rate: Number(form.discount_rate),
      cost: Number(form.cost),
      duration_minutes: Number(form.duration_minutes),
      sort_order: Number(form.sort_order),
    };
    if (treatment?.id) {
      await supabase.from("treatments").update(payload).eq("id", treatment.id);
    } else {
      await supabase.from("treatments").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{treatment ? "Tedavi Düzenle" : "Yeni Tedavi"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField label="Tedavi Adı (TR)" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
        </div>
        <FormField label="Tedavi Adı (EN)" value={form.title_en} onChange={v => setForm(f => ({ ...f, title_en: v }))} />

        {/* Kategori */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
          <select value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="">— Kategori Seçin —</option>
            {categories.filter(c => c.is_active).map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <FormField label="Fiyat (₺)" value={String(form.price)} onChange={v => setForm(f => ({ ...f, price: Number(v) }))} type="number" />
        <FormField label="İndirim Oranı (%)" value={String(form.discount_rate)} onChange={v => setForm(f => ({ ...f, discount_rate: Number(v) }))} type="number" />
        <FormField label="Maliyet (₺)" value={String(form.cost)} onChange={v => setForm(f => ({ ...f, cost: Number(v) }))} type="number" />
        <FormField label="Süre (dk)" value={String(form.duration_minutes)} onChange={v => setForm(f => ({ ...f, duration_minutes: Number(v) }))} type="number" />

        {/* Para birimi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Para Birimi</label>
          <select value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="TL">TL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <FormField label="Diş Tipi" value={String(form.tooth_type)} onChange={v => setForm(f => ({ ...f, tooth_type: v }))} type="number" />
        <FormField label="Muayene Tipi" value={String(form.exam_type)} onChange={v => setForm(f => ({ ...f, exam_type: v }))} type="number" />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />

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
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
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
        <CategoryForm category={editing}
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
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <Badge color={c.is_active ? "green" : "gray"}>{c.is_active ? "Aktif" : "Pasif"}</Badge>
                    <span className="text-[10px] text-gray-400 font-mono">/{c.slug}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{c.description || "—"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(c); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">Düzenle</button>
                  <button onClick={() => toggleActive(c.id, c.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {c.is_active ? "Pasif" : "Aktif"}</button>
                  <button onClick={() => deleteCategory(c.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">Sil</button>
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

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: category ? f.slug : slugify(name) }));
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
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
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">İptal</button>
      </div>
    </Card>
  );
}
