import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import type {
  Doctor, BlogPost, Testimonial, ContactMessage,
  SiteSetting, HeroSlide, Service, BranchData, PriceItem
} from "../../lib/supabase";

// ── TYPES ────────────────────────────────────────────────────
type Section =
  | "dashboard" | "hero" | "doctors" | "services"
  | "blog" | "branches" | "testimonials" | "messages"
  | "prices" | "settings" | "users";

// ── HELPERS ──────────────────────────────────────────────────
function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </div>
  );
}

// ── NAV ITEMS ────────────────────────────────────────────────
const NAV_ITEMS: { id: Section; label: string; icon: string; badge?: string }[] = [
  { id: "dashboard",    label: "Dashboard",        icon: "📊" },
  { id: "hero",         label: "Hero Slider",       icon: "🖼️" },
  { id: "doctors",      label: "Doktorlar",         icon: "👨‍⚕️" },
  { id: "services",     label: "Hizmetler",         icon: "🦷" },
  { id: "blog",         label: "Blog",              icon: "📝" },
  { id: "branches",     label: "Şubeler",           icon: "📍" },
  { id: "testimonials", label: "Yorumlar",          icon: "⭐" },
  { id: "messages",     label: "Mesajlar",          icon: "💬", badge: "!" },
  { id: "prices",       label: "Fiyat Listesi",     icon: "💰" },
  { id: "settings",     label: "Site Ayarları",     icon: "⚙️" },
  { id: "users",        label: "Kullanıcılar",      icon: "👥" },
];

// ── LOGIN ────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email veya şifre hatalı.");
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1235] via-indigo-950 to-[#0D1235] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl font-black text-white tracking-tight">+DENTAL STUDIO</span>
          </div>
          <p className="text-indigo-300 text-sm">Yönetim Paneli</p>
        </div>
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm"
                placeholder="admin@positivedental.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [stats, setStats] = useState({ doctors: 0, blog: 0, messages: 0, testimonials: 0 });
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const load = async () => {
      const [d, b, m, t] = await Promise.all([
        supabase.from("doctors").select("id", { count: "exact" }),
        supabase.from("blog_posts").select("id", { count: "exact" }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("testimonials").select("id", { count: "exact" }),
      ]);
      setStats({
        doctors: d.count || 0,
        blog: b.count || 0,
        messages: m.data?.length || 0,
        testimonials: t.count || 0,
      });
      setMessages(m.data || []);
    };
    load();
  }, []);

  const statCards = [
    { label: "Doktor", value: stats.doctors, icon: "👨‍⚕️", color: "from-indigo-500 to-violet-600", section: "doctors" as Section },
    { label: "Blog Yazısı", value: stats.blog, icon: "📝", color: "from-sky-500 to-blue-600", section: "blog" as Section },
    { label: "Yorum", value: stats.testimonials, icon: "⭐", color: "from-amber-400 to-orange-500", section: "testimonials" as Section },
    { label: "Mesaj", value: stats.messages, icon: "💬", color: "from-emerald-500 to-teal-600", section: "messages" as Section },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Positive Dental Studio yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.section)}
            className="group text-left">
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </Card>
          </button>
        ))}
      </div>

      <Card>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Son Mesajlar</h2>
          <button onClick={() => onNavigate("messages")} className="text-indigo-500 text-sm font-semibold hover:underline">
            Tümünü gör →
          </button>
        </div>
        {messages.length === 0 ? (
          <EmptyState icon="💬" title="Mesaj yok" desc="Henüz iletişim formu mesajı gelmedi" />
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map(m => (
              <div key={m.id} className="px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                  {m.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                    {!m.is_read && <Badge color="indigo">Yeni</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.message}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(m.created_at).toLocaleDateString("tr-TR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Hero Slider", icon: "🖼️", section: "hero" as Section },
          { label: "Hizmetler", icon: "🦷", section: "services" as Section },
          { label: "Şubeler", icon: "📍", section: "branches" as Section },
          { label: "Site Ayarları", icon: "⚙️", section: "settings" as Section },
        ].map(item => (
          <button key={item.label} onClick={() => onNavigate(item.section)}
            className="flex items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition text-sm font-semibold text-gray-700">
            <span className="text-lg">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DOCTORS ──────────────────────────────────────────────────
function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("doctors").select("*").order("sort_order");
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("doctors").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteDoctor = async (id: string) => {
    if (!confirm("Bu doktoru silmek istediğinize emin misiniz?")) return;
    await supabase.from("doctors").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Doktorlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{doctors.length} doktor kayıtlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
          + Yeni Doktor
        </button>
      </div>

      {showForm && (
        <DoctorForm
          doctor={editing}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        {loading ? <LoadingSpinner /> : doctors.length === 0 ? (
          <EmptyState icon="👨‍⚕️" title="Doktor bulunamadı" desc="Yeni doktor eklemek için butona tıklayın" />
        ) : (
          <div className="divide-y divide-gray-50">
            {doctors.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 p-4">
                <img src={doc.photo || "https://via.placeholder.com/48"} alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{doc.name}</p>
                    <Badge color={doc.branch === "adana" ? "indigo" : "amber"}>
                      {doc.branch_label}
                    </Badge>
                    <Badge color={doc.is_active ? "green" : "gray"}>
                      {doc.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{doc.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(doc); setShowForm(true); }}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    Düzenle
                  </button>
                  <button onClick={() => toggleActive(doc.id, doc.is_active)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    {doc.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => deleteDoctor(doc.id)}
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

function DoctorForm({ doctor, onSave, onCancel }: {
  doctor: Doctor | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: doctor?.name || "",
    title: doctor?.title || "",
    specialty: doctor?.specialty || "",
    branch: doctor?.branch || "adana",
    branch_label: doctor?.branch_label || "",
    photo: doctor?.photo || "",
    bio: doctor?.bio || "",
    education: doctor?.education?.join("\n") || "",
    expertise: doctor?.expertise?.join(", ") || "",
    booking_url: doctor?.booking_url || "https://randevu.positivedental.com",
    is_active: doctor?.is_active ?? true,
    sort_order: doctor?.sort_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      education: form.education.split("\n").filter(Boolean),
      expertise: form.expertise.split(",").map(s => s.trim()).filter(Boolean),
    };
    if (doctor?.id) {
      await supabase.from("doctors").update(payload).eq("id", doctor.id);
    } else {
      await supabase.from("doctors").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{doctor ? "Doktor Düzenle" : "Yeni Doktor"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Ad Soyad" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <FormField label="Unvan" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
        <FormField label="Uzmanlık" value={form.specialty} onChange={v => setForm(f => ({ ...f, specialty: v }))} />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şube</label>
          <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value as any }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="adana">Adana Türkmenbaşı</option>
            <option value="istanbul">İstanbul Nişantaşı</option>
          </select>
        </div>
        <FormField label="Şube Etiketi" value={form.branch_label} onChange={v => setForm(f => ({ ...f, branch_label: v }))} />
        <FormField label="Fotoğraf URL" value={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} />
        <div className="md:col-span-2">
          <FormField label="Biyografi" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
        </div>
        <div>
          <FormField label="Eğitim (Her satıra bir)" value={form.education} onChange={v => setForm(f => ({ ...f, education: v }))} multiline />
        </div>
        <div>
          <FormField label="Uzmanlık Alanları (virgülle ayır)" value={form.expertise} onChange={v => setForm(f => ({ ...f, expertise: v }))} multiline />
        </div>
        <FormField label="Randevu URL" value={form.booking_url} onChange={v => setForm(f => ({ ...f, booking_url: v }))} />
        <FormField label="Sıra" value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) }))} type="number" />
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

// ── FORM FIELD ───────────────────────────────────────────────
function FormField({ label, value, onChange, multiline = false, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition";
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          rows={3} className={cls} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

// ── BLOG ─────────────────────────────────────────────────────
function BlogSection() {
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
    load();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
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

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (post?.id) {
      await supabase.from("blog_posts").update(payload).eq("id", post.id);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">{post ? "Yazıyı Düzenle" : "Yeni Yazı"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Başlık" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
        <FormField label="Slug (URL)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} />
        <FormField label="Kategori" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
        <FormField label="Yazar" value={form.author} onChange={v => setForm(f => ({ ...f, author: v }))} />
        <FormField label="Yazar Unvanı" value={form.author_title} onChange={v => setForm(f => ({ ...f, author_title: v }))} />
        <FormField label="Okuma Süresi" value={form.read_time} onChange={v => setForm(f => ({ ...f, read_time: v }))} />
        <FormField label="Kapak Görseli URL" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} />
        <FormField label="Anahtar Kelimeler (virgülle)" value={form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} />
        <div className="md:col-span-2">
          <FormField label="Özet" value={form.excerpt} onChange={v => setForm(f => ({ ...f, excerpt: v }))} multiline />
        </div>
        <div className="md:col-span-2">
          <FormField label="Meta Açıklama" value={form.meta_description} onChange={v => setForm(f => ({ ...f, meta_description: v }))} multiline />
        </div>
        <div className="md:col-span-2">
          <FormField label="İçerik (HTML destekler)" value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} multiline />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Öne Çıkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published}
              onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              className="rounded" />
            <span className="text-sm font-semibold text-gray-700">Yayınla</span>
          </label>
        </div>
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

// ── MESSAGES ─────────────────────────────────────────────────
function MessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    load();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mesajlar</h1>
        <p className="text-gray-500 text-sm mt-0.5">{messages.filter(m => !m.is_read).length} okunmamış mesaj</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 overflow-hidden">
          {loading ? <LoadingSpinner /> : messages.length === 0 ? (
            <EmptyState icon="💬" title="Mesaj yok" desc="Henüz mesaj gelmedi" />
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map(m => (
                <button key={m.id} onClick={() => { setSelected(m); markRead(m.id); }}
                  className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition ${selected?.id === m.id ? "bg-indigo-50" : ""}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                      {m.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-900 truncate">{m.name}</p>
                        {!m.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{m.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2 p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {selected.email && <a href={`mailto:${selected.email}`} className="text-indigo-500 hover:underline">{selected.email}</a>}
                    {selected.phone && <span>{selected.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleDateString("tr-TR")}</p>
                  <button onClick={() => deleteMsg(selected.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                    Sil
                  </button>
                </div>
              </div>
              {selected.subject && <p className="font-semibold text-gray-700 mb-2">Konu: {selected.subject}</p>}
              <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">{selected.message}</p>
              {selected.email && (
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Mesajınız"}`}
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-600 transition">
                  ✉️ Yanıtla
                </a>
              )}
            </div>
          ) : (
            <EmptyState icon="👆" title="Mesaj seçin" desc="Sol taraftan bir mesaj seçerek detayları görüntüleyin" />
          )}
        </Card>
      </div>
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────
function SettingsSection() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").order("group_name");
    setSettings(data || []);
    const v: Record<string, string> = {};
    data?.forEach(s => { v[s.key] = s.value || ""; });
    setValues(v);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveAll = async () => {
    setSaving(true);
    for (const key of Object.keys(values)) {
      await supabase.from("site_settings").update({ value: values[key] }).eq("key", key);
    }
    setSaving(false);
    alert("Ayarlar kaydedildi!");
  };

  const groups = [...new Set(settings.map(s => s.group_name))];

  const groupLabels: Record<string, string> = {
    genel: "Genel",
    iletişim: "İletişim",
    sosyal_medya: "Sosyal Medya",
    istatistikler: "İstatistikler",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Site Ayarları</h1>
          <p className="text-gray-500 text-sm mt-0.5">Genel site içeriğini yönetin</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      {loading ? <LoadingSpinner /> : groups.map(group => (
        <Card key={group} className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">{groupLabels[group] || group}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.filter(s => s.group_name === group).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{s.label}</label>
                <input
                  type="text"
                  value={values[s.key] || ""}
                  onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────
function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleApprove = async (id: string, val: boolean) => {
    await supabase.from("testimonials").update({ is_approved: !val }).eq("id", id);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Hasta Yorumları</h1>
        <p className="text-gray-500 text-sm mt-0.5">{items.length} yorum</p>
      </div>
      <Card>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="⭐" title="Yorum bulunamadı" desc="Henüz yorum yok" />
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(t => (
              <div key={t.id} className="p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                  {t.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <span className="text-amber-400 text-sm">{"★".repeat(t.rating)}</span>
                    <Badge color={t.is_approved ? "green" : "amber"}>
                      {t.is_approved ? "Onaylı" : "Beklemede"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.role} · {new Date(t.created_at).toLocaleDateString("tr-TR")}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => toggleApprove(t.id, t.is_approved)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${t.is_approved ? "text-gray-600 bg-gray-50 hover:bg-gray-100" : "text-green-600 bg-green-50 hover:bg-green-100"}`}>
                    {t.is_approved ? "Onayı Kaldır" : "Onayla"}
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
      </Card>
    </div>
  );
}

// ── SIMPLE LIST SECTIONS ──────────────────────────────────────
function SimpleSection({ title, table, icon }: { title: string; table: string; icon: string }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-gray-900">{title}</h1>
      <Card>
        <EmptyState icon={icon} title={`${title} yakında`} desc="Bu bölüm geliştirme aşamasında" />
      </Card>
    </div>
  );
}

// ── MAIN ADMIN ────────────────────────────────────────────────
export function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_e, s) => setSession(s));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session) return <LoginPage onLogin={() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }} />;

  const renderSection = () => {
    switch (active) {
      case "dashboard":    return <Dashboard onNavigate={setActive} />;
      case "doctors":      return <DoctorsSection />;
      case "blog":         return <BlogSection />;
      case "messages":     return <MessagesSection />;
      case "testimonials": return <TestimonialsSection />;
      case "settings":     return <SettingsSection />;
      case "hero":         return <SimpleSection title="Hero Slider" table="hero_slides" icon="🖼️" />;
      case "services":     return <SimpleSection title="Hizmetler" table="services" icon="🦷" />;
      case "branches":     return <SimpleSection title="Şubeler" table="branches" icon="📍" />;
      case "prices":       return <SimpleSection title="Fiyat Listesi" table="price_items" icon="💰" />;
      case "users":        return <SimpleSection title="Kullanıcılar" table="admin_users" icon="👥" />;
      default:             return <Dashboard onNavigate={setActive} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-[#0D1235] flex-shrink-0 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <span className="text-white font-black text-sm tracking-tight">+DENTAL STUDIO</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white/70 text-xs">◀</button>
            </div>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="text-white/70 hover:text-white text-lg w-full text-center">+</button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                active === item.id
                  ? "bg-indigo-600/30 text-white border-r-2 border-indigo-400"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <button onClick={logout}
            className={`w-full flex items-center gap-3 text-white/40 hover:text-red-400 transition text-sm`}>
            <span>🚪</span>
            {sidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
