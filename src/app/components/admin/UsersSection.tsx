import { useState, useEffect } from "react";
import { supabase, Card, Badge, LoadingSpinner, EmptyState, FormField } from "./shared";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "editor" | "viewer";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const ROLES = [
  { id: "super_admin", label: "Süper Admin", desc: "Tüm yetkilere sahip, kullanıcı yönetebilir", color: "red", icon: "👑" },
  { id: "editor", label: "Editör", desc: "İçerik ekleyebilir/düzenleyebilir, kullanıcı yönetemez", color: "indigo", icon: "✏️" },
  { id: "viewer", label: "İzleyici", desc: "Sadece okuyabilir, mesajları ve analitiği görebilir", color: "gray", icon: "👁️" },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: "red",
  editor: "indigo",
  viewer: "gray",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Süper Admin",
  editor: "Editör",
  viewer: "İzleyici",
};

export function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_users").select("*").order("created_at");
    setUsers(data || []);

    // Mevcut giriş yapan kullanıcıyı bul
    const { data: session } = await supabase.auth.getSession();
    setCurrentUser(session?.session?.user?.email || "");

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const currentRole = users.find(u => u.email === currentUser)?.role;
  const isSuperAdmin = currentRole === "super_admin";

  const toggleActive = async (id: string, val: boolean) => {
    if (!isSuperAdmin) return;
    await supabase.from("admin_users").update({ is_active: !val }).eq("id", id);
    load();
  };

  const deleteUser = async (user: AdminUser) => {
    if (!isSuperAdmin) return;
    if (user.email === currentUser) { alert("Kendinizi silemezsiniz"); return; }
    if (!confirm(`${user.email} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    await supabase.from("admin_users").delete().eq("id", user.id);
    load();
  };

  const changeRole = async (id: string, newRole: string) => {
    if (!isSuperAdmin) return;
    await supabase.from("admin_users").update({ role: newRole }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} kullanıcı · Giriş: {currentUser}</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition">
            + Kullanıcı Ekle
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
          Kullanıcı yönetimi sadece Süper Admin'ler tarafından yapılabilir.
        </div>
      )}

      {/* Rol açıklamaları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map(r => (
          <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{r.icon}</span>
              <span className="font-bold text-gray-900 text-sm">{r.label}</span>
            </div>
            <p className="text-xs text-gray-500">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Yeni kullanıcı davet */}
      {showInvite && isSuperAdmin && (
        <InviteForm
          onSave={() => { setShowInvite(false); load(); }}
          onCancel={() => setShowInvite(false)}
        />
      )}

      {/* Kullanıcı listesi */}
      <Card>
        {loading ? <LoadingSpinner /> : users.length === 0 ? (
          <EmptyState icon="👥" title="Kullanıcı bulunamadı" desc="Yeni kullanıcı ekleyin" />
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{user.full_name || user.email}</p>
                    {user.email === currentUser && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">Sen</span>
                    )}
                    <Badge color={ROLE_COLORS[user.role] || "gray"}>
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                    <Badge color={user.is_active ? "green" : "gray"}>
                      {user.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.last_login && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Son giriş: {new Date(user.last_login).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
                {isSuperAdmin && user.email !== currentUser && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user.id, e.target.value)}
                      className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:border-indigo-400 outline-none"
                    >
                      <option value="super_admin">👑 Süper Admin</option>
                      <option value="editor">✏️ Editör</option>
                      <option value="viewer">👁️ İzleyici</option>
                    </select>
                    <button onClick={() => toggleActive(user.id, user.is_active)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      {user.is_active ? "Pasif Yap" : "Aktif Yap"}
                    </button>
                    <button onClick={() => deleteUser(user)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                      Sil
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function InviteForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "editor" as string,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!form.email || !form.password) { setError("Email ve şifre zorunlu"); return; }
    if (form.password.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }

    setSaving(true);
    setError("");

    // 1. Supabase Auth'ta kullanıcı oluştur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(`Auth hatası: ${authError.message}`);
      setSaving(false);
      return;
    }

    // 2. admin_users tablosuna ekle
    const { error: dbError } = await supabase.from("admin_users").insert({
      email: form.email,
      full_name: form.full_name,
      role: form.role,
      is_active: true,
      user_id: authData.user?.id,
    });

    if (dbError) {
      setError(`Veritabanı hatası: ${dbError.message}`);
      setSaving(false);
      return;
    }

    setSaving(false);
    onSave();
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-5">Yeni Kullanıcı Ekle</h3>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        <FormField label="Ad Soyad" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
        <FormField label="Şifre (min 6 karakter)" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rol</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
            <option value="super_admin">👑 Süper Admin — Tam yetki</option>
            <option value="editor">✏️ Editör — İçerik yönetimi</option>
            <option value="viewer">👁️ İzleyici — Sadece okuma</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
          İptal
        </button>
      </div>
    </Card>
  );
}
