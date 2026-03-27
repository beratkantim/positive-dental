import { useState, useEffect, useRef } from "react";
import {
  supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, ImageUpload, usePagination, Pagination, type PriceItem,
} from "./shared";

interface PriceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

const GRADIENT_OPTIONS = [
  { label: "İndigo-Violet", value: "from-indigo-500 to-violet-600" },
  { label: "Teal-Cyan", value: "from-teal-500 to-cyan-600" },
  { label: "Pink-Rose", value: "from-pink-500 to-rose-600" },
  { label: "Amber-Orange", value: "from-amber-500 to-orange-500" },
  { label: "Violet-Purple", value: "from-violet-500 to-purple-600" },
  { label: "Sky-Blue", value: "from-sky-500 to-blue-600" },
  { label: "Rose-Red", value: "from-rose-500 to-red-600" },
  { label: "Slate-Dark", value: "from-slate-600 to-slate-800" },
  { label: "Green-Emerald", value: "from-green-500 to-emerald-600" },
  { label: "Orange-Amber", value: "from-orange-500 to-amber-600" },
  { label: "Red-Rose", value: "from-red-600 to-rose-700" },
  { label: "İndigo-Blue", value: "from-indigo-600 to-blue-700" },
];

export function PricesSection() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [cats, setCats] = useState<PriceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PriceItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);
  const [editingCat, setEditingCat] = useState<PriceCategory | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from("price_items").select("*").order("category").order("sort_order"),
      supabase.from("price_categories").select("*").order("sort_order"),
    ]);
    setItems(itemsRes.data || []);
    setCats(catsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filterCat ? items.filter(i => i.category === filterCat) : items;
  const { page, setPage, totalPages, paged, total, perPage } = usePagination(filtered, 50);
  const catNames = cats.map(c => c.name);

  const deleteItem = async (id: string) => {
    if (!confirm("Bu fiyat kalemini silmek istediğinize emin misiniz?")) return;
    await supabase.from("price_items").delete().eq("id", id);
    load();
  };

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("price_items").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteCat = async (cat: PriceCategory) => {
    const count = items.filter(i => i.category === cat.name).length;
    if (!confirm(`"${cat.name}" kategorisi ve altındaki ${count} kalem silinecek. Emin misiniz?`)) return;
    await supabase.from("price_items").delete().eq("category", cat.name);
    await supabase.from("price_categories").delete().eq("id", cat.id);
    if (filterCat === cat.name) setFilterCat("");
    load();
  };

  // CSV Export
  const exportCSV = () => {
    const header = "Kategori,İsim,Fiyat (Min),Fiyat (Max),Not,Aktif,Sıra\n";
    const rows = items.map(i =>
      `"${i.category}","${i.name}",${i.price_min},${i.price_max},"${i.price_note || ""}",${i.is_active},${i.sort_order}`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fiyat-listesi-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").slice(1).filter(l => l.trim());
    const newItems: any[] = [];
    for (const line of lines) {
      const cols = line.match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/^"|"$/g, "").trim()) || [];
      if (cols.length < 4) continue;
      newItems.push({
        category: cols[0], name: cols[1],
        price_min: parseInt(cols[2]) || 0, price_max: parseInt(cols[3]) || 0,
        price_note: cols[4] || "", is_active: cols[5] !== "false", sort_order: parseInt(cols[6]) || 0,
      });
    }
    if (newItems.length === 0) { alert("CSV'de geçerli satır bulunamadı"); return; }
    if (!confirm(`${newItems.length} kalem içe aktarılacak. Mevcut veriler silinecek. Devam?`)) return;
    await supabase.from("price_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("price_items").insert(newItems);
    load();
    alert(`${newItems.length} kalem başarıyla içe aktarıldı`);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fiyat Listesi</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} kalem · {cats.length} kategori</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowCatManager(!showCatManager)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 text-violet-600 font-semibold rounded-xl text-sm hover:bg-violet-100 transition">
            🏷️ Kategoriler
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-xl text-sm hover:bg-emerald-100 transition">
            📥 CSV İçe Aktar
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-100 transition">
            📤 CSV Dışa Aktar
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
            + Yeni Kalem
          </button>
        </div>
      </div>

      {/* ── KATEGORİ YÖNETİMİ ── */}
      {showCatManager && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Kategori Yönetimi</h3>
            <button onClick={() => { setEditingCat(null); setShowCatForm(true); }}
              className="px-3 py-1.5 bg-indigo-500 text-white font-bold rounded-lg text-xs hover:bg-indigo-400 transition">
              + Yeni Kategori
            </button>
          </div>

          {showCatForm && (
            <CategoryForm
              category={editingCat}
              onSave={() => { setShowCatForm(false); load(); }}
              onCancel={() => setShowCatForm(false)}
            />
          )}

          <div className="space-y-2">
            {cats.map(cat => {
              const count = items.filter(i => i.category === cat.name).length;
              return (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center">
                    {cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">🏷️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                      <span className={`h-2 w-8 rounded-full bg-gradient-to-r ${cat.color}`} />
                    </div>
                    <p className="text-xs text-gray-400">{count} kalem · Sıra: {cat.sort_order}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingCat(cat); setShowCatForm(true); }}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                      Düzenle
                    </button>
                    <button onClick={() => deleteCat(cat)}
                      className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                      Sil
                    </button>
                  </div>
                </div>
              );
            })}
            {cats.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Henüz kategori yok</p>}
          </div>
        </Card>
      )}

      {/* Kategori filtresi */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setFilterCat("")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${!filterCat ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Tümü ({items.length})
        </button>
        {cats.map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${filterCat === c.name ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c.icon && <img src={c.icon} alt="" className="w-4 h-4 rounded object-cover" />}
            {c.name} ({items.filter(i => i.category === c.name).length})
          </button>
        ))}
      </div>

      {/* Yeni kalem formu (sadece yeni eklerken üstte) */}
      {showForm && !editing && (
        <PriceForm item={null} categories={catNames} onSave={() => { setShowForm(false); load(); }} onCancel={() => setShowForm(false)} />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon="💰" title="Fiyat kalemi bulunamadı" desc="Yeni ekleyin veya CSV içe aktarın" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-bold text-gray-600">Kategori</th>
                  <th className="px-4 py-3 font-bold text-gray-600">İşlem</th>
                  <th className="px-4 py-3 font-bold text-gray-600 text-right">Fiyat</th>
                  <th className="px-4 py-3 font-bold text-gray-600">Not</th>
                  <th className="px-4 py-3 font-bold text-gray-600 text-center">Durum</th>
                  <th className="px-4 py-3 font-bold text-gray-600 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map(item => (
                  <>
                    <tr key={item.id} className={`transition-colors ${editing?.id === item.id ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                      <td className="px-4 py-3 text-gray-500 text-xs">{item.category}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        {item.price_min === 0 && item.price_max === 0 ? "Ücretsiz" :
                         item.price_max > item.price_min ? `₺${item.price_min.toLocaleString("tr-TR")} – ₺${item.price_max.toLocaleString("tr-TR")}` :
                         `₺${item.price_min.toLocaleString("tr-TR")}`}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{item.price_note || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={item.is_active ? "green" : "gray"}>{item.is_active ? "Aktif" : "Pasif"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditing(editing?.id === item.id ? null : item); setShowForm(false); }}
                            className={`px-2 py-1 text-xs font-semibold rounded transition ${editing?.id === item.id ? "text-white bg-indigo-500" : "text-indigo-600 hover:bg-indigo-50"}`}>
                            {editing?.id === item.id ? "Kapat" : "Düzenle"}
                          </button>
                          <button onClick={() => toggleActive(item.id, item.is_active)}
                            className="px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded transition">
                            {item.is_active ? "Pasif" : "Aktif"}
                          </button>
                          <button onClick={() => deleteItem(item.id)}
                            className="px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded transition">Sil</button>
                        </div>
                      </td>
                    </tr>
                    {/* Akordiyon: inline düzenleme formu */}
                    {editing?.id === item.id && (
                      <tr key={`edit-${item.id}`}>
                        <td colSpan={6} className="p-0">
                          <div className="border-t-2 border-indigo-200 bg-indigo-50/30 p-4">
                            <PriceForm
                              item={editing}
                              categories={catNames}
                              onSave={() => { setEditing(null); setShowForm(false); load(); }}
                              onCancel={() => setEditing(null)}
                              inline
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} total={total} perPage={perPage} />
      </Card>
    </div>
  );
}

// ── KATEGORİ FORM ──
function CategoryForm({ category, onSave, onCancel }: {
  category: PriceCategory | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name || "",
    icon: category?.icon || "",
    color: category?.color || "from-indigo-500 to-violet-600",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    if (category?.id) {
      // Kategori adı değiştiyse price_items'daki kategori adını da güncelle
      if (category.name !== form.name) {
        await supabase.from("price_items").update({ category: form.name }).eq("category", category.name);
      }
      await supabase.from("price_categories").update(form).eq("id", category.id);
    } else {
      await supabase.from("price_categories").insert(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="mb-4 p-4 bg-white border border-indigo-100 rounded-xl space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Kategori Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Renk</label>
          <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            {GRADIENT_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <ImageUpload
          currentUrl={form.icon}
          bucket="price-categories"
          fileName={form.name ? `kategori_${slugify(form.name)}` : ""}
          onUploaded={url => setForm(f => ({ ...f, icon: url }))}
          label="Kategori İkonu"
          hint="64x64px, kare ikon"
        />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: parseInt(v) || 0 }))} type="number" />
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg text-sm hover:bg-indigo-400 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-50 transition">İptal</button>
      </div>
    </div>
  );
}

// ── FİYAT FORM ──
function PriceForm({ item, categories, onSave, onCancel, inline }: {
  item: PriceItem | null;
  categories: string[];
  onSave: () => void;
  onCancel: () => void;
  inline?: boolean;
}) {
  const [form, setForm] = useState({
    category: item?.category || "",
    name: item?.name || "",
    price_min: item?.price_min || 0,
    price_max: item?.price_max || 0,
    price_note: item?.price_note || "",
    is_active: item?.is_active ?? true,
    sort_order: item?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    if (item?.id) {
      await supabase.from("price_items").update(form).eq("id", item.id);
    } else {
      await supabase.from("price_items").insert(form);
    }
    setSaving(false);
    onSave();
  };

  const Wrapper = inline ? "div" : Card;
  const wrapperClass = inline ? "" : "p-6";

  return (
    <Wrapper className={wrapperClass}>
      {!inline && <h3 className="font-bold text-gray-900 mb-5">{item ? "Fiyat Düzenle" : "Yeni Fiyat Kalemi"}</h3>}
      <div className={`grid gap-3 ${inline ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 md:grid-cols-2 gap-4"}`}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
          <input list={`cat-list-${item?.id || 'new'}`} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Kategori..."
            className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-400 outline-none" />
          <datalist id={`cat-list-${item?.id || 'new'}`}>{categories.map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <FormField label="İşlem Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Min Fiyat (₺)" value={String(form.price_min)} onChange={v => setForm(f => ({ ...f, price_min: parseInt(v) || 0 }))} type="number" />
        <FormField label="Max Fiyat (₺)" value={String(form.price_max)} onChange={v => setForm(f => ({ ...f, price_max: parseInt(v) || 0 }))} type="number" />
        <FormField label="Not" value={form.price_note} onChange={v => setForm(f => ({ ...f, price_note: v }))} />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: parseInt(v) || 0 }))} type="number" />
      </div>
      {!inline && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{form.name || "İşlem adı"}</p>
            <p className="text-xs text-gray-400">{form.category} {form.price_note && `· ${form.price_note}`}</p>
          </div>
          <p className="font-bold text-gray-900">
            {form.price_min === 0 && form.price_max === 0 ? "Ücretsiz" :
             form.price_max > form.price_min ? `₺${form.price_min.toLocaleString("tr-TR")} – ₺${form.price_max.toLocaleString("tr-TR")}` :
             `₺${form.price_min.toLocaleString("tr-TR")}`}
          </p>
        </div>
      )}
      <div className={`flex items-center gap-2 ${inline ? "mt-3" : "mt-6"}`}>
        <button onClick={save} disabled={saving}
          className={`bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60 ${inline ? "px-4 py-2" : "px-6 py-2.5"}`}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={onCancel}
          className={`border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition ${inline ? "px-4 py-2" : "px-6 py-2.5"}`}>
          İptal
        </button>
      </div>
    </Wrapper>
  );
}
