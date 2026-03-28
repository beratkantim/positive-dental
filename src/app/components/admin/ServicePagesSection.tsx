import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload } from "./shared";
import { sanitizeHTML } from "@/lib/sanitize";
import type { Service } from "@/lib/supabase";

export function ServicePagesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Tedavi Detay Sayfaları</h1>
        <p className="text-gray-500 text-sm mt-0.5">Her tedavi için SEO açıklama, içerik ve SSS yönetimi</p>
      </div>

      {editing ? (
        <ServicePageEditor service={editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
      ) : (
        <Card>
          {loading ? <LoadingSpinner /> : services.length === 0 ? (
            <EmptyState icon="🦷" title="Hizmet bulunamadı" desc="Önce Tedaviler bölümünden hizmet ekleyin" />
          ) : (
            <div className="divide-y divide-gray-50">
              {services.map(s => {
                const hasContent = !!s.content;
                const hasMeta = !!s.meta_description;
                const hasFaqs = s.faqs && s.faqs.length > 0;
                const score = (hasContent ? 1 : 0) + (hasMeta ? 1 : 0) + (hasFaqs ? 1 : 0) + (s.slug ? 1 : 0);
                const scoreColor = score >= 3 ? "green" : score >= 2 ? "amber" : "red";

                return (
                  <div key={s.id} className="flex items-center gap-4 p-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color_from} ${s.color_to} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{s.title}</p>
                        <Badge color={scoreColor}>SEO {score}/4</Badge>
                        {!s.slug && <Badge color="red">Slug yok</Badge>}
                        {!hasContent && <Badge color="gray">İçerik yok</Badge>}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">
                        /hizmetlerimiz/{s.slug || "—"}
                        {hasFaqs && ` · ${(s.faqs as any[]).length} SSS`}
                      </p>
                    </div>
                    <button onClick={() => setEditing(s)}
                      className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                      Düzenle
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

function ServicePageEditor({ service, onSave, onCancel }: { service: Service; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: service.slug || slugify(service.title),
    content: service.content || "",
    meta_description: service.meta_description || service.description.slice(0, 160),
    keywords: (service.keywords || []).join(", "),
    faqs: service.faqs || [],
    image: service.image || "",
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

  const save = async () => {
    setSaving(true);
    await supabase.from("services").update({
      slug: form.slug,
      content: form.content,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      faqs: form.faqs,
      image: form.image,
    }).eq("id", service.id);
    await logAction("update", "services", service.id, `Tedavi sayfası güncellendi: ${service.title}`);
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
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color_from} ${service.color_to} flex items-center justify-center text-xl`}>
            {service.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{service.title}</h3>
            <p className="text-xs text-gray-400">/hizmetlerimiz/{form.slug}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${seoColor}`}>SEO {seoScore}/6</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {(["content", "seo", "faq", "preview"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {t === "content" ? "📝 İçerik" : t === "seo" ? "🔍 SEO" : t === "faq" ? "❓ SSS" : "👁️ Önizleme"}
          </button>
        ))}
      </div>

      {/* İÇERİK */}
      {tab === "content" && (
        <div className="space-y-4">
          <ImageUpload currentUrl={form.image} bucket="services" fileName={form.slug || slugify(service.title)}
            onUploaded={url => setForm(f => ({ ...f, image: url }))} label="Kapak Görseli" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Detaylı İçerik (HTML)
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
            <p className="text-blue-700 text-lg font-medium truncate">{service.title} | Positive Dental Studio</p>
            <p className="text-green-700 text-sm mt-1">positive-dental.vercel.app/hizmetlerimiz/{form.slug}</p>
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

      {/* SSS */}
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

      {/* ÖNİZLEME */}
      {tab === "preview" && (
        <div className="space-y-6">
          {form.image && <img src={form.image} alt="" className="w-full h-48 object-cover rounded-2xl" />}
          <h2 className="text-2xl font-black text-gray-900">{service.title}</h2>
          <p className="text-gray-500">{service.description}</p>
          {form.content && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
          )}
          {form.faqs.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Sık Sorulan Sorular</h3>
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
          İptal
        </button>
      </div>
    </Card>
  );
}
