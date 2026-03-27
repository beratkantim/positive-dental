import { useState, useEffect } from "react";
import { supabase, logAction, slugify, Card, Badge, LoadingSpinner, EmptyState, FormField, type BlogPost } from "./shared";
import { sanitizeHTML } from "@/lib/sanitize";

export const BLOG_CATEGORY_OPTIONS = [
  { label: "Fiyat Rehberi", color: "bg-emerald-100 text-emerald-700" },
  { label: "İmplantoloji", color: "bg-blue-100 text-blue-700" },
  { label: "Estetik Diş Hekimliği", color: "bg-pink-100 text-pink-700" },
  { label: "Ortodonti", color: "bg-violet-100 text-violet-700" },
  { label: "Çocuk Diş Hekimliği", color: "bg-amber-100 text-amber-700" },
  { label: "Genel Diş Hekimliği", color: "bg-indigo-100 text-indigo-700" },
  { label: "Periodontoloji", color: "bg-rose-100 text-rose-700" },
];

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (id: string, val: boolean) => {
    await supabase.from("blog_posts").update({
      is_published: !val,
      published_at: !val ? new Date().toISOString() : null,
    }).eq("id", id);
    await logAction("toggle_publish", "blog_posts", id, `Yazı ${!val ? "yayınlandı" : "yayından alındı"}`);
    load();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    await logAction("delete", "blog_posts", id, "Blog yazısı silindi");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Blog Yazıları</h1>
          <p className="text-gray-500 text-sm mt-0.5">{posts.length} yazı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Yazı
        </button>
      </div>

      {showForm && (
        <BlogForm post={editing} onSave={() => { setShowForm(false); load(); }} onCancel={() => setShowForm(false)} />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : posts.length === 0 ? (
          <EmptyState icon="📝" title="Yazı bulunamadı" desc="İlk blog yazınızı ekleyin" />
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-4 p-4">
                <img src={post.image || "https://via.placeholder.com/56"} alt={post.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 truncate">{post.title}</p>
                    <Badge color={post.is_published ? "green" : "gray"}>
                      {post.is_published ? "Yayında" : "Taslak"}
                    </Badge>
                    {post.is_featured && <Badge color="amber">Öne Çıkan</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">{post.category} · {post.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(post); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => togglePublish(post.id, post.is_published)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {post.is_published ? "Yayından Al" : "Yayınla"}
                  </button>
                  <button onClick={() => deletePost(post.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function BlogForm({ post, onSave, onCancel }: { post: BlogPost | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: post?.slug || "",
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    category: post?.category || "",
    category_color: post?.category_color || "bg-indigo-100 text-indigo-700",
    author: post?.author || "",
    author_title: post?.author_title || "",
    content: post?.content || "",
    image: post?.image || "",
    keywords: post?.keywords?.join(", ") || "",
    meta_description: post?.meta_description || "",
    read_time: post?.read_time || "",
    is_featured: post?.is_featured || false,
    is_published: post?.is_published || false,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "preview">("content");

  // Otomatik slug
  useEffect(() => {
    if (!post && form.title) {
      setForm(f => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, post]);

  // Kategori seçince rengi otomatik ayarla
  const handleCategoryChange = (cat: string) => {
    const found = BLOG_CATEGORY_OPTIONS.find(c => c.label === cat);
    setForm(f => ({
      ...f,
      category: cat,
      category_color: found?.color || "bg-indigo-100 text-indigo-700",
    }));
  };

  // Okuma süresi otomatik hesapla
  useEffect(() => {
    if (form.content) {
      const wordCount = form.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      setForm(f => ({ ...f, read_time: `${minutes} dk okuma` }));
    }
  }, [form.content]);

  // Meta description otomatik (excerpt'ten)
  useEffect(() => {
    if (!post && form.excerpt && !form.meta_description) {
      setForm(f => ({ ...f, meta_description: f.excerpt.slice(0, 160) }));
    }
  }, [form.excerpt, post]);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      published_at: form.is_published ? (post?.published_at || new Date().toISOString()) : null,
    };
    if (post?.id) {
      await supabase.from("blog_posts").update(payload).eq("id", post.id);
      await logAction("update", "blog_posts", post.id, `Yazı güncellendi: ${payload.title}`);
    } else {
      await supabase.from("blog_posts").insert(payload);
      await logAction("create", "blog_posts", "", `Yazı eklendi: ${payload.title}`);
    }
    setSaving(false);
    onSave();
  };

  const seoScore = (() => {
    let score = 0;
    if (form.title.length >= 30 && form.title.length <= 70) score++;
    if (form.meta_description.length >= 120 && form.meta_description.length <= 160) score++;
    if (form.keywords.split(",").filter(Boolean).length >= 3) score++;
    if (form.slug) score++;
    if (form.excerpt.length >= 50) score++;
    if (form.image) score++;
    return score;
  })();

  const seoColor = seoScore >= 5 ? "text-green-600 bg-green-50" : seoScore >= 3 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  const seoLabel = seoScore >= 5 ? "İyi" : seoScore >= 3 ? "Orta" : "Zayıf";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">{post ? "Yazıyı Düzenle" : "Yeni Yazı"}</h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${seoColor}`}>
            SEO: {seoLabel} ({seoScore}/6)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {(["content", "seo", "preview"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab === "content" ? "📝 İçerik" : tab === "seo" ? "🔍 SEO" : "👁️ Önizleme"}
          </button>
        ))}
      </div>

      {/* ── İÇERİK TAB ── */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Başlık" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
            <FormField label="Slug (URL)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
                <option value="">Seçin...</option>
                {BLOG_CATEGORY_OPTIONS.map(c => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori Rengi</label>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${form.category_color}`}>
                  {form.category || "Önizleme"}
                </span>
                <input value={form.category_color} onChange={e => setForm(f => ({ ...f, category_color: e.target.value }))}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
            </div>

            <FormField label="Yazar" value={form.author} onChange={v => setForm(f => ({ ...f, author: v }))} />
            <FormField label="Yazar Unvanı" value={form.author_title} onChange={v => setForm(f => ({ ...f, author_title: v }))} />

            <FormField label="Kapak Görseli URL" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} />
            <FormField label="Okuma Süresi (otomatik)" value={form.read_time} onChange={v => setForm(f => ({ ...f, read_time: v }))} />
          </div>

          <FormField label="Özet (blog listesinde görünür)" value={form.excerpt} onChange={v => setForm(f => ({ ...f, excerpt: v }))} multiline />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              İçerik (HTML)
              <span className="text-gray-400 font-normal ml-2">h2, p, ul, li, table, strong destekler</span>
            </label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={16}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition font-mono"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                className="rounded" />
              <span className="text-sm font-semibold text-gray-700">⭐ Öne Çıkan</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="rounded" />
              <span className="text-sm font-semibold text-gray-700">🌐 Yayınla</span>
            </label>
          </div>
        </div>
      )}

      {/* ── SEO TAB ── */}
      {activeTab === "seo" && (
        <div className="space-y-5">
          {/* Google önizleme */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Arama Önizlemesi</label>
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <p className="text-blue-700 text-lg font-medium leading-tight truncate">
                {form.title ? `${form.title} | Positive Dental Studio Blog` : "Başlık girilmedi..."}
              </p>
              <p className="text-green-700 text-sm mt-1">
                positivedental.com/blog/{form.slug || "..."}
              </p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {form.meta_description || form.excerpt || "Meta açıklama girilmedi..."}
              </p>
            </div>
          </div>

          <div>
            <FormField label={`Meta Başlık (Title Tag) — ${form.title.length}/70 karakter`}
              value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
            <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                form.title.length >= 30 && form.title.length <= 70 ? "bg-green-500" : form.title.length > 70 ? "bg-red-500" : "bg-amber-500"
              }`} style={{ width: `${Math.min(100, (form.title.length / 70) * 100)}%` }} />
            </div>
          </div>

          <div>
            <FormField label={`Meta Açıklama — ${form.meta_description.length}/160 karakter`}
              value={form.meta_description} onChange={v => setForm(f => ({ ...f, meta_description: v }))} multiline />
            <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                form.meta_description.length >= 120 && form.meta_description.length <= 160 ? "bg-green-500" : form.meta_description.length > 160 ? "bg-red-500" : "bg-amber-500"
              }`} style={{ width: `${Math.min(100, (form.meta_description.length / 160) * 100)}%` }} />
            </div>
          </div>

          <FormField label="Slug (URL Yolu)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />

          <div>
            <FormField label="Anahtar Kelimeler (virgülle ayır, min 3 önerilir)" value={form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} multiline />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.keywords.split(",").map(k => k.trim()).filter(Boolean).map(k => (
                <span key={k} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">#{k.replace(/\s+/g, "")}</span>
              ))}
            </div>
          </div>

          <FormField label="Kapak Görseli URL (OG Image)" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} />

          {/* SEO Kontrol Listesi */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 text-sm mb-3">SEO Kontrol Listesi</h4>
            <div className="space-y-2">
              {[
                { ok: form.title.length >= 30 && form.title.length <= 70, text: "Başlık 30-70 karakter" },
                { ok: form.meta_description.length >= 120 && form.meta_description.length <= 160, text: "Meta açıklama 120-160 karakter" },
                { ok: form.keywords.split(",").filter(Boolean).length >= 3, text: "En az 3 anahtar kelime" },
                { ok: !!form.slug, text: "URL slug tanımlı" },
                { ok: form.excerpt.length >= 50, text: "Özet en az 50 karakter" },
                { ok: !!form.image, text: "Kapak görseli tanımlı (OG Image)" },
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

      {/* ── ÖNİZLEME TAB ── */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {form.image && (
            <img src={form.image} alt="" className="w-full h-48 object-cover rounded-xl" />
          )}
          <div className="flex items-center gap-2">
            {form.category && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${form.category_color}`}>{form.category}</span>
            )}
            {form.is_featured && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">⭐ Öne Çıkan</span>
            )}
            {form.read_time && <span className="text-xs text-gray-400">{form.read_time}</span>}
          </div>
          <h2 className="text-2xl font-black text-gray-900">{form.title || "Başlık"}</h2>
          {form.excerpt && <p className="text-gray-500 leading-relaxed">{form.excerpt}</p>}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{form.author}</span>
            {form.author_title && <span>· {form.author_title}</span>}
          </div>
          {form.content && (
            <div className="prose-article mt-4 border-t pt-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
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
