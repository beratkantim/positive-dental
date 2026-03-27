import { useState, useEffect, useRef } from "react";
import {
  supabase, Card, Badge, LoadingSpinner, EmptyState,
  FormField, type PriceItem,
} from "./shared";

const CATEGORIES = [
  "Muayene Fiyatları", "Koruyucu Diş Hekimliği", "Çocuk Diş Tedavileri",
  "Dolgu ve Kanal Tedavileri", "Diş Estetiği Tedavileri", "Diş Beyazlatma",
  "Diş Çekimi Fiyatları", "İmplant Tedavisi", "Ortodontik Tedaviler",
  "Protez Tedavileri", "Ağız ve Çene Cerrahisi", "Dijital Diş Hekimliği",
];

export function PricesSection() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PriceItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("price_items").select("*").order("category").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filterCat ? items.filter(i => i.category === filterCat) : items;
  const categories = [...new Set(items.map(i => i.category))];

  const deleteItem = async (id: string) => {
    if (!confirm("Bu fiyat kalemini silmek istediğinize emin misiniz?")) return;
    await supabase.from("price_items").delete().eq("id", id);
    load();
  };

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("price_items").update({ is_active: !val }).eq("id", id);
    load();
  };

  // ── EXCEL EXPORT ──
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

  // ── EXCEL IMPORT ──
  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").slice(1).filter(l => l.trim());
    const newItems: Omit<PriceItem, "id">[] = [];

    for (const line of lines) {
      const cols = line.match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/^"|"$/g, "").trim()) || [];
      if (cols.length < 4) continue;
      newItems.push({
        category: cols[0],
        name: cols[1],
        price_min: parseInt(cols[2]) || 0,
        price_max: parseInt(cols[3]) || 0,
        price_note: cols[4] || "",
        is_active: cols[5] !== "false",
        sort_order: parseInt(cols[6]) || 0,
      });
    }

    if (newItems.length === 0) { alert("CSV'de geçerli satır bulunamadı"); return; }

    if (!confirm(`${newItems.length} fiyat kalemi içe aktarılacak. Mevcut veriler silinecek. Devam?`)) return;

    await supabase.from("price_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("price_items").insert(newItems);
    load();
    alert(`${newItems.length} fiyat kalemi başarıyla içe aktarıldı`);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fiyat Listesi</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} kalem · {categories.length} kategori</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Import */}
          <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-xl text-sm hover:bg-emerald-100 transition">
            📥 CSV İçe Aktar
          </button>
          {/* Export */}
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-600 font-semibold rounded-xl text-sm hover:bg-sky-100 transition">
            📤 CSV Dışa Aktar
          </button>
          {/* Yeni */}
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
            + Yeni Kalem
          </button>
        </div>
      </div>

      {/* Kategori filtresi */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setFilterCat("")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${!filterCat ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Tümü ({items.length})
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${filterCat === c ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c} ({items.filter(i => i.category === c).length})
          </button>
        ))}
      </div>

      {showForm && (
        <PriceForm
          item={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
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
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
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
                        <button onClick={() => { setEditing(item); setShowForm(true); }}
                          className="px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition">Düzenle</button>
                        <button onClick={() => toggleActive(item.id, item.is_active)}
                          className="px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded transition">
                          {item.is_active ? "Pasif" : "Aktif"}
                        </button>
                        <button onClick={() => deleteItem(item.id)}
                          className="px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded transition">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function PriceForm({ item, onSave, onCancel }: {
  item: PriceItem | null;
  onSave: () => void;
  onCancel: () => void;
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

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{item ? "Fiyat Düzenle" : "Yeni Fiyat Kalemi"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="">Seçin veya yazın...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <FormField label="İşlem Adı" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Minimum Fiyat (₺)" value={String(form.price_min)} onChange={v => setForm(f => ({ ...f, price_min: parseInt(v) || 0 }))} type="number" />
        <FormField label="Maksimum Fiyat (₺)" value={String(form.price_max)} onChange={v => setForm(f => ({ ...f, price_max: parseInt(v) || 0 }))} type="number" />
        <FormField label="Not / Açıklama" value={form.price_note} onChange={v => setForm(f => ({ ...f, price_note: v }))} />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: parseInt(v) || 0 }))} type="number" />
      </div>

      {/* Önizleme */}
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
