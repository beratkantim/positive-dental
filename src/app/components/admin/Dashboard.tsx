import { useState, useEffect } from "react";
import { supabase, Card, Badge, EmptyState, type Section, type ContactMessage } from "./shared";

export function Dashboard({ onNavigate }: { onNavigate: (s: Section) => void }) {
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
