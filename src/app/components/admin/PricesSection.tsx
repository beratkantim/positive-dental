import { useState, useEffect, useRef } from "react";
import {
  supabase, logAction, Card, Badge, LoadingSpinner, EmptyState,
  usePagination, Pagination, type PriceItem,
} from "./shared";
import { PriceCategoryForm, type PriceCategory } from "./prices/PriceCategoryForm";
import { PriceItemForm } from "./prices/PriceItemForm";

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
    await logAction("delete", "price_items", id, "Fiyat kalemi silindi");
    load();
  };

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("price_items").update({ is_active: !val }).eq("id", id);
    await logAction("toggle_active", "price_items", id, `Fiyat kalemi ${!val ? "aktif" : "pasif"} yapıldı`);
    load();
  };

  const deleteCat = async (cat: PriceCategory) => {
    const count = items.filter(i => i.category === cat.name).length;
    if (!confirm(`"${cat.name}" kategorisi ve altındaki ${count} kalem silinecek. Emin misiniz?`)) return;
    await supabase.from("price_items").delete().eq("category", cat.name);
    await supabase.from("price_categories").delete().eq("id", cat.id);
    await logAction("delete", "price_categories", cat.id, `Kategori silindi: ${cat.name} (${count} kalem)`);
    if (filterCat === cat.name) setFilterCat("");
    load();
  };

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
    await logAction("create", "price_items", "", `CSV ile ${newItems.length} kalem içe aktarıldı`);
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
            <PriceCategoryForm
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

      {showForm && !editing && (
        <PriceItemForm item={null} categories={catNames} onSave={() => { setShowForm(false); load(); }} onCancel={() => setShowForm(false)} />
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
                    {editing?.id === item.id && (
                      <tr key={`edit-${item.id}`}>
                        <td colSpan={6} className="p-0">
                          <div className="border-t-2 border-indigo-200 bg-indigo-50/30 p-4">
                            <PriceItemForm
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
