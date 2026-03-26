import { useState, useEffect } from "react";
import { supabase, Card, EmptyState, NAV_ITEMS, type Section } from "../components/admin/shared";
import { LoginPage } from "../components/admin/LoginPage";
import { Dashboard } from "../components/admin/Dashboard";
import { DoctorsSection } from "../components/admin/DoctorsSection";
import { BlogSection } from "../components/admin/BlogSection";
import { MessagesSection } from "../components/admin/MessagesSection";
import { SettingsSection } from "../components/admin/SettingsSection";
import { TestimonialsSection } from "../components/admin/TestimonialsSection";
import { BranchesSection } from "../components/admin/BranchesSection";
import { HeroSection } from "../components/admin/HeroSection";

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
      case "hero":         return <HeroSection />;
      case "services":     return <SimpleSection title="Hizmetler" table="services" icon="🦷" />;
      case "branches":     return <BranchesSection />;
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
