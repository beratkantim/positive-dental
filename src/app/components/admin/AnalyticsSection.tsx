import { useState, useEffect } from "react";
import { supabase, Card, LoadingSpinner } from "./shared";

interface DailyStat {
  date: string;
  views: number;
  visitors: number;
}

interface PageStat {
  path: string;
  views: number;
}

interface DeviceStat {
  device: string;
  count: number;
}

interface BrowserStat {
  browser: string;
  count: number;
}

type Range = "7d" | "30d" | "90d";

export function AnalyticsSection() {
  const [range, setRange] = useState<Range>("7d");
  const [loading, setLoading] = useState(true);
  const [todayViews, setTodayViews] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [browsers, setBrowsers] = useState<BrowserStat[]>([]);
  const [liveCount, setLiveCount] = useState(0);

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  useEffect(() => {
    load();
  }, [range]);

  const load = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();

    const [allViews, todayData, liveData] = await Promise.all([
      supabase.from("page_views").select("*").gte("created_at", since).order("created_at", { ascending: true }),
      supabase.from("page_views").select("*").gte("created_at", `${today}T00:00:00`),
      supabase.from("page_views").select("session_id").gte("created_at", fiveMinAgo),
    ]);

    const rows = allViews.data || [];
    const todayRows = todayData.data || [];

    // Toplam
    setTotalViews(rows.length);
    setTodayViews(todayRows.length);
    setTodayVisitors(new Set(todayRows.map(r => r.session_id)).size);
    setLiveCount(new Set((liveData.data || []).map(r => r.session_id)).size);

    // Günlük istatistikler
    const dayMap = new Map<string, { views: number; sessions: Set<string> }>();
    for (const r of rows) {
      const d = r.created_at.split("T")[0];
      if (!dayMap.has(d)) dayMap.set(d, { views: 0, sessions: new Set() });
      const entry = dayMap.get(d)!;
      entry.views++;
      entry.sessions.add(r.session_id);
    }
    const daily: DailyStat[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      const entry = dayMap.get(d);
      daily.push({
        date: d,
        views: entry?.views || 0,
        visitors: entry?.sessions.size || 0,
      });
    }
    setDailyStats(daily);

    // En çok ziyaret edilen sayfalar
    const pathMap = new Map<string, number>();
    for (const r of rows) {
      pathMap.set(r.path, (pathMap.get(r.path) || 0) + 1);
    }
    setTopPages(
      Array.from(pathMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }))
    );

    // Cihaz dağılımı
    const devMap = new Map<string, number>();
    for (const r of rows) {
      devMap.set(r.device, (devMap.get(r.device) || 0) + 1);
    }
    setDevices(Array.from(devMap.entries()).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count));

    // Tarayıcı dağılımı
    const brMap = new Map<string, number>();
    for (const r of rows) {
      brMap.set(r.browser, (brMap.get(r.browser) || 0) + 1);
    }
    setBrowsers(Array.from(brMap.entries()).map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count));

    setLoading(false);
  };

  const maxViews = Math.max(...dailyStats.map(d => d.views), 1);

  const DEVICE_ICONS: Record<string, string> = { mobile: "📱", tablet: "📟", desktop: "💻" };
  const DEVICE_LABELS: Record<string, string> = { mobile: "Mobil", tablet: "Tablet", desktop: "Masaüstü" };

  const PAGE_LABELS: Record<string, string> = {
    "/": "Ana Sayfa",
    "/hizmetlerimiz": "Hizmetler",
    "/hakkimizda": "Hakkımızda",
    "/doktorlarimiz": "Doktorlar",
    "/blog": "Blog",
    "/iletisim": "İletişim",
    "/fiyat-listesi": "Fiyat Listesi",
    "/cocuk-dis-hekimligi": "Çocuk",
    "/kliniklerimiz": "Klinikler",
    "/randevu": "Randevu",
    "/anlasmali-kurumlar": "Kurumlar",
    "/anlasmali-sigortalar": "Sigortalar",
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Site Analitiği</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ziyaretçi trafiği ve sayfa görüntülemeleri</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["7d", "30d", "90d"] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                range === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {r === "7d" ? "7 Gün" : r === "30d" ? "30 Gün" : "90 Gün"}
            </button>
          ))}
        </div>
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Bugün", value: todayViews, sub: `${todayVisitors} ziyaretçi`, icon: "📊", color: "from-indigo-500 to-violet-600" },
          { label: "Toplam Görüntülenme", value: totalViews, sub: `Son ${days} gün`, icon: "👁️", color: "from-sky-500 to-blue-600" },
          { label: "Şu An Sitede", value: liveCount, sub: "Son 5 dakika", icon: "🟢", color: "from-emerald-500 to-teal-600" },
          { label: "Ort. Günlük", value: Math.round(totalViews / days), sub: "Görüntülenme", icon: "📈", color: "from-amber-500 to-orange-600" },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value.toLocaleString("tr-TR")}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Günlük grafik */}
      <Card className="p-5">
        <h2 className="font-bold text-gray-900 mb-4">Günlük Trafik</h2>
        <div className="flex items-end gap-[2px] h-40">
          {dailyStats.map((d, i) => {
            const h = Math.max((d.views / maxViews) * 100, 2);
            const isToday = d.date === new Date().toISOString().split("T")[0];
            return (
              <div key={d.date} className="flex-1 group relative flex flex-col items-center justify-end">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {new Date(d.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} · {d.views} görüntülenme · {d.visitors} ziyaretçi
                </div>
                <div
                  className={`w-full rounded-t-sm transition-all ${isToday ? "bg-indigo-500" : "bg-indigo-200 group-hover:bg-indigo-400"}`}
                  style={{ height: `${h}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{dailyStats[0] ? new Date(dailyStats[0].date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : ""}</span>
          <span>Bugün</span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* En çok ziyaret edilen sayfalar */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-4">Popüler Sayfalar</h2>
          {topPages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Henüz veri yok</p>
          ) : (
            <div className="space-y-2">
              {topPages.map((p, i) => (
                <div key={p.path} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-700 truncate">{PAGE_LABELS[p.path] || p.path}</p>
                      <span className="text-xs text-gray-500 font-bold flex-shrink-0 ml-2">{p.views}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${(p.views / topPages[0].views) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Cihaz + Tarayıcı */}
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4">Cihaz Dağılımı</h2>
            {devices.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Henüz veri yok</p>
            ) : (
              <div className="space-y-3">
                {devices.map(d => {
                  const pct = Math.round((d.count / totalViews) * 100);
                  return (
                    <div key={d.device} className="flex items-center gap-3">
                      <span className="text-xl">{DEVICE_ICONS[d.device] || "❓"}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-gray-700">{DEVICE_LABELS[d.device] || d.device}</span>
                          <span className="text-gray-500">{pct}% ({d.count})</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            d.device === "mobile" ? "bg-pink-500" : d.device === "tablet" ? "bg-amber-500" : "bg-indigo-500"
                          }`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4">Tarayıcı Dağılımı</h2>
            {browsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Henüz veri yok</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {browsers.map(b => {
                  const pct = Math.round((b.count / totalViews) * 100);
                  return (
                    <div key={b.browser} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <span className="text-sm font-bold text-gray-700">{b.browser}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
