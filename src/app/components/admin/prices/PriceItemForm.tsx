import { useState } from "react";
import { supabase, logAction, Card, FormField, type PriceItem } from "../shared";

export function PriceItemForm({ item, categories, onSave, onCancel, inline }: {
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
      await logAction("update", "price_items", item.id, `Fiyat güncellendi: ${form.name}`);
    } else {
      await supabase.from("price_items").insert(form);
      await logAction("create", "price_items", "", `Fiyat eklendi: ${form.name}`);
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
