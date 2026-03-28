import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload } from "./shared";
import { sanitizeHTML } from "@/lib/sanitize";
import type { BranchData } from "@/lib/supabase";

export function ClinicPagesSection() {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BranchData | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("branches").select("*").eq("is_active", true);
    setBranches(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Klinik Detay Sayfalari</h1>
        <p className="text-gray-500 text-sm mt-0.5">Her klinik icin SEO aciklama, icerik, galeri ve SSS yonetimi</p>
      </div>

      {editing ? (
        <ClinicPageEditor branch={editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
      ) : (
        <Card>
          {loading ? <LoadingSpinner /> : branches.length === 0 ? (
            <EmptyState icon="📍" title="Klinik bulunamadi" desc="Once Subeler bolumunden klinik ekleyin" />
          ) : (
            <div className="divide-y divide-gray-50">
              {branches.map(b => {
                const hasSlug = !!b.slug;
                const hasContent = !!b.content;
                const hasMeta = !!b.meta_description;
                const hasKeywords = b.keywords && b.keywords.length > 0;
                const hasFaqs = b.faqs && b.faqs.length > 0;
                const hasImage = !!b.image;
                const score = (hasSlug ? 1 : 0) + (hasContent ? 1 : 0) + (hasMeta ? 1 : 0) + (hasKeywords ? 1 : 0) + (hasFaqs ? 1 : 0) + (hasImage ? 1 : 0);
                const scoreColor = score >= 5 ? "green" : score >= 3 ? "amber" : "red";

                return (
                  <div key={b.id} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-50">
                      {b.image ? (
                        <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📍</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{b.name}</p>
                        <Badge color={scoreColor}>SEO {score}/6</Badge>
                        {!hasSlug && <Badge color="red">Slug yok</Badge>}
                        {!hasContent && <Badge color="gray">Icerik yok</Badge>}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">
                        /kliniklerimiz/{b.slug || "—"}
                        {hasFaqs && ` · ${(b.faqs as any[]).length} SSS`}
                        {b.gallery && b.gallery.length > 0 && ` · ${b.gallery.length} gorsel`}
                      </p>
                    </div>
                    <button onClick={() => setEditing(b)}
                      className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                      Duzenle
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function ClinicPageEditor({ branch, onSave, onCancel }: { branch: BranchData; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: branch.slug || slugify(branch.name),
    content: branch.content || "",
    meta_description: branch.meta_description || `${branch.name} - ${branch.address}`.slice(0, 160),
    keywords: (branch.keywords || []).join(", "),
    faqs: branch.faqs || [],
    image: branch.image || "",
    gallery: branch.gallery || [],
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"content" | "seo" | "faq" | "preview">("content");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

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

  const removeGalleryImage = (i: number) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }));
  };

  const save = async () => {
    setSaving(true);
    await supabase.from("branches").update({
      slug: form.slug,
      content: form.content,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      faqs: form.faqs,
      image: form.image,
      gallery: form.gallery,
    }).eq("id", branch.id);
    await logAction("update", "branches", branch.id, `Klinik sayfasi guncellendi: ${branch.name}`);
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
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">←</button>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 flex-shrink-0">
            {branch.image ? (
              <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">📍</div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{branch.name}</h3>
            <p className="text-xs text-gray-400">/kliniklerimiz/{form.slug}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${seoColor}`}>SEO {seoScore}/6</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {(["content", "seo", "faq", "preview"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {t === "content" ? "Icerik" : t === "seo" ? "SEO" : t === "faq" ? "SSS" : "Onizleme"}
          </button>
        ))}
      </div>

      {/* ICERIK */}
      {tab === "content" && (
        <div className="space-y-4">
          <ImageUpload currentUrl={form.image} bucket="branches" fileName={form.slug || slugify(branch.name)}
            onUploaded={url => setForm(f => ({ ...f, image: url }))} label="Kapak Gorseli" />

          {/* Gallery */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Galeri Gorselleri
              <span className="text-gray-400 font-normal ml-2">{form.gallery.length} gorsel</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {form.gallery.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                  <img src={img} alt={`Galeri ${i + 1}`} className="w-full h-24 object-cover" />
                  <button onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload
              currentUrl=""
              bucket="branches"
              fileName={`${form.slug || slugify(branch.name)}_gallery_${form.gallery.length}`}
              onUploaded={url => {
                if (url) setForm(f => ({ ...f, gallery: [...f.gallery, url] }));
              }}
              label="Yeni Galeri Gorseli Ekle"
              hint="Her seferinde bir gorsel yukleyin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Detayli Icerik (HTML)
              <span className="text-gray-400 font-normal ml-2">h2, h3, p, ul, li, table, strong, a destekler</span>
            </label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={20} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition" />
            <p className="text-xs text-gray-400 mt-1">{form.content.length} karakter · {form.content.replace(/<[^>]*>/g, "").split(/\s+/).length} kelime</p>
          </div>
        </div>
      )}

      {/* SEO */}
      {tab === "seo" && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-blue-700 text-lg font-medium truncate">{branch.name} | Positive Dental Studio</p>
            <p className="text-green-700 text-sm mt-1">positive-dental.vercel.app/kliniklerimiz/{form.slug}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.meta_description || "..."}</p>
          </div>
          <FormField label="URL Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
          <div>
            <FormField label={`Meta Aciklama — ${form.meta_description.length}/160`} value={form.meta_description}
              onChange={v => setForm(f => ({ ...f, meta_description: v }))} multiline />
            <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${form.meta_description.length >= 120 && form.meta_description.length <= 160 ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: `${Math.min(100, (form.meta_description.length / 160) * 100)}%` }} />
            </div>
          </div>
          <div>
            <FormField label="Anahtar Kelimeler (virgulle)" value={form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} multiline />
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
                { ok: !!form.slug, text: "URL slug tanimli" },
                { ok: form.meta_description.length >= 120 && form.meta_description.length <= 160, text: "Meta aciklama 120-160 karakter" },
                { ok: form.keywords.split(",").filter(Boolean).length >= 3, text: "En az 3 anahtar kelime" },
                { ok: form.content.length >= 500, text: "Icerik en az 500 karakter" },
                { ok: form.faqs.length >= 3, text: "En az 3 SSS" },
                { ok: !!form.image, text: "Kapak gorseli" },
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

      {/* SSS */}
      {tab === "faq" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">SSS'ler Google arama sonuclarinda zengin snippet olarak gorunur (FAQPage schema).</p>
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

      {/* ONIZLEME */}
      {tab === "preview" && (
        <div className="space-y-6">
          {form.image && <img src={form.image} alt="" className="w-full h-48 object-cover rounded-2xl" />}
          <h2 className="text-2xl font-black text-gray-900">{branch.name}</h2>
          <p className="text-gray-500">{branch.city} · {branch.address}</p>
          {form.content && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
          )}
          {form.gallery.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Galeri</h3>
              <div className="grid grid-cols-3 gap-2">
                {form.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Galeri ${i + 1}`} className="w-full h-24 object-cover rounded-xl" />
                ))}
              </div>
            </div>
          )}
          {form.faqs.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Sik Sorulan Sorular</h3>
              {form.faqs.map((f, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="font-semibold text-gray-800 text-sm">{f.q}</p>
                  <p className="text-gray-600 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-6 pt-4 border-t">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
          Iptal
        </button>
      </div>
    </Card>
  );
}
