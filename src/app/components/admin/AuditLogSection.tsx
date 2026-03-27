import { useState, useEffect } from "react";
import { supabase, Card, LoadingSpinner } from "./shared";

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  table_name: string;
  record_id: string;
  details: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  create: { label: "Oluşturma", color: "bg-green-100 text-green-700" },
  update: { label: "Güncelleme", color: "bg-blue-100 text-blue-700" },
  delete: { label: "Silme", color: "bg-red-100 text-red-700" },
  toggle_active: { label: "Aktif/Pasif", color: "bg-amber-100 text-amber-700" },
  toggle_publish: { label: "Yayın", color: "bg-violet-100 text-violet-700" },
  toggle_approve: { label: "Onay", color: "bg-teal-100 text-teal-700" },
  mark_read: { label: "Okundu", color: "bg-gray-100 text-gray-600" },
  save: { label: "Kaydetme", color: "bg-indigo-100 text-indigo-700" },
  import: { label: "İçe Aktarma", color: "bg-emerald-100 text-emerald-700" },
  invite: { label: "Davet", color: "bg-pink-100 text-pink-700" },
  role_change: { label: "Rol Değişikliği", color: "bg-orange-100 text-orange-700" },
};

const TABLE_LABELS: Record<string, string> = {
  doctors: "Doktorlar",
  blog_posts: "Blog",
  branches: "Şubeler",
  hero_slides: "Hero Slider",
  services: "Hizmetler",
  treatments: "Tedaviler",
  treatment_categories: "Tedavi Kategorileri",
  testimonials: "Yorumlar",
  contact_messages: "Mesajlar",
  site_settings: "Ayarlar",
  price_items: "Fiyat Kalemleri",
  price_categories: "Fiyat Kategorileri",
  partners: "Kurumlar",
  insurances: "Sigortalar",
  admin_users: "Kullanıcılar",
};

export function AuditLogSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const load = async () => {
    setLoading(true);
    let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (filterUser) q = q.eq("user_email", filterUser);
    if (filterTable) q = q.eq("table_name", filterTable);
    const { data } = await q;
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, filterUser, filterTable]);

  const uniqueUsers = [...new Set(logs.map(l => l.user_email))];
  const uniqueTables = [...new Set(logs.map(l => l.table_name))];

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "az önce";
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">İşlem Kayıtları</h1>
        <p className="text-gray-500 text-sm mt-0.5">Tüm kullanıcı hareketleri</p>
      </div>

      {/* Filtreler */}
      <div className="flex gap-3 flex-wrap">
        <select value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
          <option value="">Tüm Kullanıcılar</option>
          {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filterTable} onChange={e => { setFilterTable(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none">
          <option value="">Tüm Bölümler</option>
          {uniqueTables.map(t => <option key={t} value={t}>{TABLE_LABELS[t] || t}</option>)}
        </select>
      </div>

      <Card>
        {loading ? <LoadingSpinner /> : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="font-semibold">Henüz işlem kaydı yok</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map(log => {
              const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0 mt-0.5">
                    {log.user_email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{log.user_email}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${actionInfo.color}`}>{actionInfo.label}</span>
                      <span className="text-xs text-gray-400">{TABLE_LABELS[log.table_name] || log.table_name}</span>
                    </div>
                    {log.details && <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(log.created_at)} · {new Date(log.created_at).toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sayfalama */}
        {logs.length >= PAGE_SIZE && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-30 hover:bg-gray-100 transition">
              ‹ Önceki
            </button>
            <span className="text-xs text-gray-500">Sayfa {page + 1}</span>
            <button onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-gray-100 transition">
              Sonraki ›
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
