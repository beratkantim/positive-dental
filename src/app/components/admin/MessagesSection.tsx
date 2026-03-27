import { useState, useEffect } from "react";
import { supabase, logAction, Card, Badge, LoadingSpinner, EmptyState, type ContactMessage } from "./shared";

export function MessagesSection() {
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
    await logAction("update", "contact_messages", id, "Mesaj okundu olarak işaretlendi");
    load();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    await logAction("delete", "contact_messages", id, "Mesaj silindi");
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
