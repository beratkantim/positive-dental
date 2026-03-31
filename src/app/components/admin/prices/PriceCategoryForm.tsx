import { useState } from "react";
import { supabase, logAction, slugify, FormField, ImageUpload } from "../shared";

interface PriceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

export const GRADIENT_OPTIONS = [
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

export type { PriceCategory };

export function PriceCategoryForm({ category, onSave, onCancel }: {
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
      if (category.name !== form.name) {
        await supabase.from("price_items").update({ category: form.name }).eq("category", category.name);
      }
      await supabase.from("price_categories").update(form).eq("id", category.id);
      await logAction("update", "price_categories", category.id, `Kategori güncellendi: ${form.name}`);
    } else {
      await supabase.from("price_categories").insert(form);
      await logAction("create", "price_categories", "", `Kategori eklendi: ${form.name}`);
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
