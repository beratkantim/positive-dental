import { useState, useEffect } from "react";
import { supabase, Card, LoadingSpinner, FormField, type SiteSetting } from "./shared";

interface FooterLink { to: string; label: string; }

export function FooterSection() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // Link yönetimi
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [newLinkTo, setNewLinkTo] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newService, setNewService] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*")
        .in("group_name", ["footer", "footer_social"])
        .order("group_name");
      const items = data || [];
      setSettings(items);
      const vals: Record<string, string> = {};
      items.forEach(s => { vals[s.key] = s.value; });
      setValues(vals);

      // Links & services parse
      try { setLinks(JSON.parse(vals["footer_links"] || "[]")); } catch { setLinks([]); }
      try { setServices(JSON.parse(vals["footer_services"] || "[]")); } catch { setServices([]); }

      setLoading(false);
    };
    load();
  }, []);

  const saveAll = async () => {
    setSaving(true);
    // Links ve services'i JSON olarak güncelle
    const finalValues = {
      ...values,
      footer_links: JSON.stringify(links),
      footer_services: JSON.stringify(services),
    };
    for (const key of Object.keys(finalValues)) {
      await supabase.from("site_settings").update({ value: finalValues[key] }).eq("key", key);
    }
    setSaving(false);
    alert("Footer ayarları kaydedildi!");
  };

  const addLink = () => {
    if (!newLinkTo || !newLinkLabel) return;
    setLinks([...links, { to: newLinkTo, label: newLinkLabel }]);
    setNewLinkTo("");
    setNewLinkLabel("");
  };

  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  const addService = () => {
    if (!newService.trim()) return;
    setServices([...services, newService.trim()]);
    setNewService("");
  };

  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));

  if (loading) return <LoadingSpinner />;

  // Grupla
  const footerSettings = settings.filter(s => s.group_name === "footer" && s.type !== "json");
  const socialSettings = settings.filter(s => s.group_name === "footer_social");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Footer Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Alt bilgi alanını düzenleyin</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      {/* Genel Footer Ayarları */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Genel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {footerSettings.map(s => (
            <div key={s.key} className={s.type === "textarea" ? "md:col-span-2" : ""}>
              <FormField
                label={s.label}
                value={values[s.key] || ""}
                onChange={v => setValues(prev => ({ ...prev, [s.key]: v }))}
                multiline={s.type === "textarea"}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Sosyal Medya Linkleri */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Sosyal Medya Linkleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialSettings.map(s => (
            <FormField
              key={s.key}
              label={s.label}
              value={values[s.key] || ""}
              onChange={v => setValues(prev => ({ ...prev, [s.key]: v }))}
            />
          ))}
        </div>
      </Card>

      {/* Hızlı Erişim Linkleri */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Hızlı Erişim Linkleri</h3>
        <div className="space-y-2 mb-4">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-mono text-gray-500 flex-shrink-0 w-40 truncate">{link.to}</span>
              <span className="text-sm font-semibold text-gray-900 flex-1">{link.label}</span>
              <div className="flex gap-1">
                {i > 0 && (
                  <button onClick={() => { const n = [...links]; [n[i-1], n[i]] = [n[i], n[i-1]]; setLinks(n); }}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded">↑</button>
                )}
                {i < links.length - 1 && (
                  <button onClick={() => { const n = [...links]; [n[i], n[i+1]] = [n[i+1], n[i]]; setLinks(n); }}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded">↓</button>
                )}
                <button onClick={() => removeLink(i)}
                  className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Sil</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newLinkTo} onChange={e => setNewLinkTo(e.target.value)} placeholder="URL (ör: /blog)"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none" />
          <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Etiket (ör: Blog)"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none"
            onKeyDown={e => { if (e.key === "Enter") addLink(); }} />
          <button onClick={addLink} className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition">Ekle</button>
        </div>
      </Card>

      {/* Hizmet Listesi */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Footer Hizmet Listesi</h3>
        <div className="space-y-2 mb-4">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-semibold text-gray-900">{s}</span>
              <div className="flex gap-1">
                {i > 0 && (
                  <button onClick={() => { const n = [...services]; [n[i-1], n[i]] = [n[i], n[i-1]]; setServices(n); }}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded">↑</button>
                )}
                {i < services.length - 1 && (
                  <button onClick={() => { const n = [...services]; [n[i], n[i+1]] = [n[i+1], n[i]]; setServices(n); }}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded">↓</button>
                )}
                <button onClick={() => removeService(i)}
                  className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Sil</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newService} onChange={e => setNewService(e.target.value)} placeholder="Hizmet adı..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none"
            onKeyDown={e => { if (e.key === "Enter") addService(); }} />
          <button onClick={addService} className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition">Ekle</button>
        </div>
      </Card>

      {/* Önizleme */}
      <Card className="p-5 bg-[#0D1235] text-white">
        <h3 className="font-bold text-white mb-4">Önizleme</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-white font-medium">{values["footer_slogan"]}</p>
            <p className="text-blue-300 mt-1 text-xs">{values["footer_about"]?.slice(0, 80)}...</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Hızlı Erişim</p>
            {links.slice(0, 5).map((l, i) => (
              <p key={i} className="text-blue-300 text-xs">{l.label}</p>
            ))}
            {links.length > 5 && <p className="text-blue-400 text-xs">+{links.length - 5} daha</p>}
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Hizmetler</p>
            {services.map((s, i) => (
              <p key={i} className="text-blue-300 text-xs">{s}</p>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold mb-2">İletişim</p>
            <p className="text-blue-300 text-xs">{values["footer_phone"]}</p>
            <p className="text-blue-300 text-xs">{values["footer_email"]}</p>
            <p className="text-blue-300 text-xs">{values["footer_hours"]}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
