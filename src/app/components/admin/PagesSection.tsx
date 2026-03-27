import { useState, useEffect } from "react";
import { supabase, Card, LoadingSpinner, EmptyState, type SiteSetting } from "./shared";

const PAGE_GROUPS: { group: string; label: string; icon: string }[] = [
  { group: "hakkimizda", label: "Hakkımızda Sayfası", icon: "📖" },
  { group: "cocuk", label: "Çocuk Diş Hekimliği", icon: "👶" },
  { group: "seo_anasayfa", label: "Ana Sayfa SEO Metni", icon: "🔍" },
  { group: "hakkimizda_eeat", label: "Hakkımızda EEAT (FAQ + Şirket)", icon: "🏢" },
];

const EXCLUDED_GROUPS = ["genel", "iletişim", "sosyal_medya", "istatistikler"];

const TEXTAREA_KEYS = [
  "about_story", "about_mission", "about_vision", "about_values",
  "kids_description", "kids_features",
  "seo_homepage_content",
  "eeat_faq", "eeat_company",
];

export function PagesSection() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string>>({});
  const [savingGroup, setSavingGroup] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").order("group_name");
    const all = data || [];
    setSettings(all);
    const v: Record<string, string> = {};
    all.forEach(s => { v[s.key] = s.value || ""; });
    setValues(v);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveGroup = async (groupName: string) => {
    setSavingGroup(groupName);
    const groupSettings = settings.filter(s => s.group_name === groupName);
    for (const s of groupSettings) {
      if (values[s.key] !== s.value) {
        await supabase.from("site_settings").update({ value: values[s.key] }).eq("key", s.key);
      }
    }
    await load();
    setSavingGroup(null);
    alert("Kaydedildi!");
  };

  const toggleCollapse = (group: string) => {
    setCollapsed(c => ({ ...c, [group]: !c[group] }));
  };

  // Filter to only page-related groups
  const pageSettings = settings.filter(s => !EXCLUDED_GROUPS.includes(s.group_name));
  const availableGroups = PAGE_GROUPS.filter(pg =>
    pageSettings.some(s => s.group_name === pg.group)
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Sayfa İçerikleri</h1>
        <p className="text-gray-500 text-sm mt-0.5">Sayfaların metin içeriklerini düzenleyin</p>
      </div>

      {loading ? <LoadingSpinner /> : availableGroups.length === 0 ? (
        <Card>
          <EmptyState icon="📄" title="Sayfa içeriği bulunamadı" desc="site_settings tablosuna hakkimizda veya cocuk grubunda kayıt ekleyin" />
        </Card>
      ) : (
        availableGroups.map(pg => {
          const groupSettings = pageSettings.filter(s => s.group_name === pg.group);
          const isCollapsed = collapsed[pg.group];

          return (
            <Card key={pg.group} className="overflow-hidden">
              {/* Collapsible Header */}
              <button
                onClick={() => toggleCollapse(pg.group)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pg.icon}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900">{pg.label}</h3>
                    <p className="text-xs text-gray-400">{groupSettings.length} alan</p>
                  </div>
                </div>
                <span className={`text-gray-400 transition-transform ${isCollapsed ? "" : "rotate-180"}`}>
                  ▼
                </span>
              </button>

              {/* Collapsible Body */}
              {!isCollapsed && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <div className="space-y-4">
                    {groupSettings.map(s => (
                      <div key={s.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          {s.label}
                        </label>
                        {TEXTAREA_KEYS.includes(s.key) ? (
                          <textarea
                            value={values[s.key] || ""}
                            onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                          />
                        ) : (
                          <input
                            type="text"
                            value={values[s.key] || ""}
                            onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                          />
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Anahtar: <span className="font-mono">{s.key}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => saveGroup(pg.group)}
                      disabled={savingGroup === pg.group}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60"
                    >
                      {savingGroup === pg.group ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
