import { useState, useEffect } from "react";
import { supabase, Card, LoadingSpinner, type SiteSetting } from "./shared";

export function SettingsSection() {
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
