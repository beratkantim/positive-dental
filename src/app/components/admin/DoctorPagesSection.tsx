import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, ImageUpload } from "./shared";
import { sanitizeHTML } from "@/lib/sanitize";
import type { Doctor } from "@/lib/supabase";

export function DoctorPagesSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Doctor | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("doctors").select("*").eq("is_active", true).order("sort_order");
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Doktor Detay Sayfalari</h1>
        <p className="text-gray-500 text-sm mt-0.5">Her doktor icin SEO aciklama, icerik ve SSS yonetimi</p>
      </div>

      {editing ? (
        <DoctorPageEditor doctor={editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
      ) : (
        <Card>
          {loading ? <LoadingSpinner /> : doctors.length === 0 ? (
            <EmptyState icon="👨‍⚕️" title="Doktor bulunamadi" desc="Once Doktorlar bolumunden doktor ekleyin" />
          ) : (
            <div className="divide-y divide-gray-50">
              {doctors.map(d => {
                const hasSlug = !!d.slug;
                const hasContent = !!d.content;
                const hasMeta = !!d.meta_description;
                const hasKeywords = d.keywords && d.keywords.length > 0;
                const hasFaqs = d.faqs && d.faqs.length > 0;
                const hasPhoto = !!d.photo;
                const score = (hasSlug ? 1 : 0) + (hasContent ? 1 : 0) + (hasMeta ? 1 : 0) + (hasKeywords ? 1 : 0) + (hasFaqs ? 1 : 0) + (hasPhoto ? 1 : 0);
                const scoreColor = score >= 5 ? "green" : score >= 3 ? "amber" : "red";

                return (
                  <div key={d.id} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-50">
                      {d.photo ? (
                        <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👨‍⚕️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{d.name}</p>
                        <Badge color={scoreColor}>SEO {score}/6</Badge>
                        {!hasSlug && <Badge color="red">Slug yok</Badge>}
                        {!hasContent && <Badge color="gray">Icerik yok</Badge>}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">
                        /doktorlarimiz/{d.slug || "—"}
                        {hasFaqs && ` · ${(d.faqs as any[]).length} SSS`}
                      </p>
                    </div>
                    <button onClick={() => setEditing(d)}
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

function DoctorPageEditor({ doctor, onSave, onCancel }: { doctor: Doctor; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: doctor.slug || slugify(doctor.name),
    content: doctor.content || "",
    meta_description: doctor.meta_description || (doctor.bio || "").slice(0, 160),
    keywords: (doctor.keywords || []).join(", "),
    faqs: doctor.faqs || [],
    photo: doctor.photo || "",
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
    await supabase.from("doctors").update({
      slug: form.slug,
      content: form.content,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      faqs: form.faqs,
      photo: form.photo,
    }).eq("id", doctor.id);
    await logAction("update", "doctors", doctor.id, `Doktor sayfasi guncellendi: ${doctor.name}`);
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
    if (form.photo) s++;
    return s;
  })();
  const seoColor = seoScore >= 5 ? "text-green-600 bg-green-50" : seoScore >= 3 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">←</button>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 flex-shrink-0">
            {doctor.photo ? (
              <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">👨‍⚕️</div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
            <p className="text-xs text-gray-400">/doktorlarimiz/{form.slug}</p>
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
          <ImageUpload currentUrl={form.photo} bucket="doctors" fileName={form.slug || slugify(doctor.name)}
            onUploaded={url => setForm(f => ({ ...f, photo: url }))} label="Doktor Fotografi"
            hint="📐 Önerilen: 600×800px (portre), WebP formatı, max 150KB" />
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
            <p className="text-blue-700 text-lg font-medium truncate">{doctor.name} | Positive Dental Studio</p>
            <p className="text-green-700 text-sm mt-1">positive-dental.vercel.app/doktorlarimiz/{form.slug}</p>
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
                { ok: !!form.photo, text: "Doktor fotografi" },
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
          {form.photo && <img src={form.photo} alt="" className="w-full h-48 object-contain rounded-2xl bg-gray-50" />}
          <h2 className="text-2xl font-black text-gray-900">{doctor.name}</h2>
          <p className="text-indigo-500 font-semibold">{doctor.specialty}</p>
          <p className="text-gray-500">{doctor.bio}</p>
          {form.content && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
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
