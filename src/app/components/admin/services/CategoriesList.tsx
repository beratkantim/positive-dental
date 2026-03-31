import { useState, useEffect } from "react";
import {
  supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, ImageUpload,
} from "../shared";
import { sanitizeHTML } from "@/lib/sanitize";
import type { TreatmentCategory } from "../../../../lib/supabase";

export function CategoriesList() {
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
    await logAction("toggle_active", "treatment_categories", id, `Kategori ${!val ? "aktif" : "pasif"} yapıldı`);
    load();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("treatment_categories").delete().eq("id", id);
    await logAction("delete", "treatment_categories", id, "Tedavi kategorisi silindi");
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
    is_featured: category?.is_featured ?? false,
    image: category?.image || "",
    color_from: category?.color_from || "",
    color_to: category?.color_to || "",
    features: category?.features || [],
    content: category?.content || "",
    meta_description: category?.meta_description || "",
    keywords: (category?.keywords || []).join(", "),
    faqs: category?.faqs || [],
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"basic" | "visual" | "content" | "seo" | "faq">("basic");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: category ? f.slug : slugify(name) }));
  };

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setForm(f => ({ ...f, faqs: [...f.faqs, { q: newQ.trim(), a: newA.trim() }] }));
    setNewQ("");
    setNewA("");
  };

  const removeFaq = (i: number) => setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));

  const moveFaq = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= form.faqs.length) return;
    const n = [...form.faqs];
    [n[i], n[j]] = [n[j], n[i]];
    setForm(f => ({ ...f, faqs: n }));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm(f => ({ ...f, features: [...f.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      icon: form.icon,
      sort_order: Number(form.sort_order),
      is_active: form.is_active,
      is_featured: form.is_featured,
      image: form.image,
      color_from: form.color_from,
      color_to: form.color_to,
      features: form.features,
      content: form.content,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      faqs: form.faqs,
    };
    if (category?.id) {
      await supabase.from("treatment_categories").update(payload).eq("id", category.id);
      await logAction("update", "treatment_categories", category.id, `Kategori güncellendi: ${payload.name}`);
    } else {
      await supabase.from("treatment_categories").insert(payload);
      await logAction("create", "treatment_categories", "", `Kategori eklendi: ${payload.name}`);
    }
    setSaving(false);
    onSave();
  };

  const seoScore = (() => {
    let s = 0;
    if (form.slug) s++;
    if (form.meta_description.length >= 120 && form.meta_description.length <= 160) s++;
    if (form.keywords.split(",").filter(Boolean).length >= 3) s++;
    if (form.content.length >= 500) s++;
    if (form.faqs.length >= 3) s++;
    if (form.image) s++;
    return s;
  })();
  const seoColor = seoScore >= 5 ? "text-green-600 bg-green-50" : seoScore >= 3 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{form.icon}</div>
          <div>
            <h3 className="font-bold text-gray-900">{category ? "Kategori Düzenle" : "Yeni Kategori"}</h3>
            <p className="text-xs text-gray-400">/tedavilerimiz/{form.slug || "..."}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${seoColor}`}>SEO {seoScore}/6</span>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {([
          { key: "basic", label: "⚙️ Temel" },
          { key: "visual", label: "🎨 Görsel" },
          { key: "content", label: "📝 İçerik" },
          { key: "seo", label: "🔍 SEO" },
          { key: "faq", label: "❓ SSS" },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Kategori Adı" value={form.name} onChange={handleNameChange} />
          <FormField label="İkon (emoji)" value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
          <FormField label="Slug (URL)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
          <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />
          <div className="md:col-span-2">
            <FormField label="Kısa Açıklama" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Anasayfada Göster</span>
          </label>
        </div>
      )}

      {tab === "visual" && (
        <div className="space-y-4">
          <ImageUpload currentUrl={form.image} bucket="treatments" fileName={form.slug || slugify(form.name)}
            onUploaded={url => setForm(f => ({ ...f, image: url }))} label="Kapak Görseli" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gradient Başlangıç (ör: from-teal-500)" value={form.color_from} onChange={v => setForm(f => ({ ...f, color_from: v }))} />
            <FormField label="Gradient Bitiş (ör: to-cyan-600)" value={form.color_to} onChange={v => setForm(f => ({ ...f, color_to: v }))} />
          </div>
          {form.color_from && form.color_to && (
            <div className={`h-16 rounded-xl bg-gradient-to-br ${form.color_from} ${form.color_to} flex items-center justify-center text-3xl`}>
              {form.icon}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Öne Çıkan Özellikler</label>
            <div className="space-y-2 mb-3">
              {form.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm text-gray-700">{feat}</span>
                  <button onClick={() => removeFeature(i)} className="text-red-500 text-xs hover:bg-red-50 px-2 py-1 rounded">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addFeature()}
                placeholder="Yeni özellik ekle..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none" />
              <button onClick={addFeature} className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition">+</button>
            </div>
          </div>
        </div>
      )}

      {tab === "content" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Detaylı İçerik (HTML)
              <span className="text-gray-400 font-normal ml-2">h2, h3, p, ul, li, table, strong, a destekler</span>
            </label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={20} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
            <p className="text-xs text-gray-400 mt-1">{form.content.length} karakter · {form.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length} kelime</p>
          </div>
          {form.content && (
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-400 mb-3">ÖNİZLEME</p>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
            </div>
          )}
        </div>
      )}

      {tab === "seo" && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-blue-700 text-lg font-medium truncate">{form.name} | Positive Dental Studio</p>
            <p className="text-green-700 text-sm mt-1">positivedental.com.tr/tedavilerimiz/{form.slug}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.meta_description || "..."}</p>
          </div>
          <FormField label="URL Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
          <div>
            <FormField label={`Meta Açıklama — ${form.meta_description.length}/160`} value={form.meta_description}
              onChange={v => setForm(f => ({ ...f, meta_description: v }))} multiline />
            <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${form.meta_description.length >= 120 && form.meta_description.length <= 160 ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: `${Math.min(100, (form.meta_description.length / 160) * 100)}%` }} />
            </div>
          </div>
          <div>
            <FormField label="Anahtar Kelimeler (virgülle)" value={form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} multiline />
            <div className="flex flex-wrap gap-1 mt-2">
              {form.keywords.split(",").map(k => k.trim()).filter(Boolean).map(k => (
                <span key={k} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">#{k}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-sm mb-3">SEO Kontrol Listesi</h4>
            <div className="space-y-2">
              {[
                { ok: !!form.slug, text: "URL slug tanımlı" },
                { ok: form.meta_description.length >= 120 && form.meta_description.length <= 160, text: "Meta açıklama 120-160 karakter" },
                { ok: form.keywords.split(",").filter(Boolean).length >= 3, text: "En az 3 anahtar kelime" },
                { ok: form.content.length >= 500, text: "İçerik en az 500 karakter" },
                { ok: form.faqs.length >= 3, text: "En az 3 SSS" },
                { ok: !!form.image, text: "Kapak görseli" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <span className={item.ok ? "text-gray-700" : "text-red-600 font-medium"}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "faq" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">SSS'ler Google arama sonuçlarında zengin snippet olarak görünür (FAQPage schema).</p>
          <div className="space-y-2">
            {form.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{faq.q}</p>
                    <p className="text-gray-600 text-sm mt-1">{faq.a}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => moveFaq(i, -1)} disabled={i === 0} className="px-2 py-1 text-xs text-gray-400 hover:bg-gray-200 rounded disabled:opacity-30">↑</button>
                    <button onClick={() => moveFaq(i, 1)} disabled={i === form.faqs.length - 1} className="px-2 py-1 text-xs text-gray-400 hover:bg-gray-200 rounded disabled:opacity-30">↓</button>
                    <button onClick={() => removeFaq(i)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
            <FormField label="Soru" value={newQ} onChange={setNewQ} />
            <FormField label="Cevap" value={newA} onChange={setNewA} multiline />
            <button onClick={addFaq} className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition">
              + SSS Ekle
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6 pt-4 border-t">
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
