import { useState, useEffect } from "react";
import {
  supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState,
  FormField, ImageUpload, usePagination, Pagination,
} from "../shared";
import { sanitizeHTML } from "@/lib/sanitize";
import type { TreatmentCategory, Treatment } from "../../../../lib/supabase";

export function TreatmentsList() {
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
    await logAction("toggle_active", "treatments", id, `Tedavi ${!val ? "aktif" : "pasif"} yapıldı`);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu tedaviyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("treatments").delete().eq("id", id);
    await logAction("delete", "treatments", id, "Tedavi silindi");
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

function TreatmentForm({ treatment, categories, onSave, onCancel }: {
  treatment: Treatment | null;
  categories: TreatmentCategory[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: treatment?.title || "",
    title_en: treatment?.title_en || "",
    slug: treatment?.slug || "",
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
    description: treatment?.description || "",
    image: treatment?.image || "",
    content: treatment?.content || "",
    meta_description: treatment?.meta_description || "",
    keywords: (treatment?.keywords || []).join(", "),
    faqs: treatment?.faqs || [],
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"basic" | "content" | "seo" | "faq">("basic");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: treatment ? f.slug : slugify(title) }));
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

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title,
      title_en: form.title_en,
      slug: form.slug || slugify(form.title),
      category_id: form.category_id || null,
      tooth_type: form.tooth_type !== "" ? Number(form.tooth_type) : null,
      exam_type: form.exam_type !== "" ? Number(form.exam_type) : null,
      price: Number(form.price),
      discount_rate: Number(form.discount_rate),
      cost: Number(form.cost),
      currency: form.currency,
      duration_minutes: Number(form.duration_minutes),
      sort_order: Number(form.sort_order),
      is_active: form.is_active,
      description: form.description,
      image: form.image,
      content: form.content,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      faqs: form.faqs,
    };
    if (treatment?.id) {
      await supabase.from("treatments").update(payload).eq("id", treatment.id);
      await logAction("update", "treatments", treatment.id, `Tedavi güncellendi: ${payload.title}`);
    } else {
      await supabase.from("treatments").insert(payload);
      await logAction("create", "treatments", "", `Tedavi eklendi: ${payload.title}`);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
          <div>
            <h3 className="font-bold text-gray-900">{treatment ? "Tedavi Düzenle" : "Yeni Tedavi"}</h3>
            <p className="text-xs text-gray-400">{form.slug ? `/tedavilerimiz/.../` + form.slug : "slug otomatik oluşturulacak"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {([
          { key: "basic", label: "⚙️ Temel" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField label="Tedavi Adı (TR)" value={form.title} onChange={handleTitleChange} />
          </div>
          <FormField label="Tedavi Adı (EN)" value={form.title_en} onChange={v => setForm(f => ({ ...f, title_en: v }))} />
          <FormField label="Slug (URL)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
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
      )}

      {tab === "content" && (
        <div className="space-y-4">
          <div className="md:col-span-2">
            <FormField label="Kısa Açıklama (kart için)" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} multiline />
          </div>
          <ImageUpload currentUrl={form.image} bucket="treatments" fileName={form.slug || slugify(form.title)}
            onUploaded={url => setForm(f => ({ ...f, image: url }))} label="Kapak Görseli" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Detaylı İçerik (HTML)
              <span className="text-gray-400 font-normal ml-2">h2, h3, p, ul, li, table, strong, a destekler</span>
            </label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={16} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
            <p className="text-xs text-gray-400 mt-1">{form.content.length} karakter</p>
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
            <p className="text-blue-700 text-lg font-medium truncate">{form.title} | Positive Dental Studio</p>
            <p className="text-green-700 text-sm mt-1">positivedental.com.tr/tedavilerimiz/.../{form.slug}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.meta_description || "..."}</p>
          </div>
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
        </div>
      )}

      {tab === "faq" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">SSS'ler Google arama sonuçlarında zengin snippet olarak görünür.</p>
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
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
          İptal
        </button>
      </div>
    </Card>
  );
}
