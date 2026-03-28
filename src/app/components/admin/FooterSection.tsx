import { useState, useEffect, useRef } from "react";
import { supabase, logAction, Card, LoadingSpinner, FormField, type SiteSetting } from "./shared";

interface FooterItem { label: string; url: string; }
interface FooterColumn { title: string; type: "links" | "text" | "contact" | "social"; items: FooterItem[]; }

// site_settings'ten gelen diğer alanlar
interface FooterMeta {
  slogan: string;
  about: string;
  copyright: string;
  phone: string;
  email: string;
  hours: string;
  hours_note: string;
  socials: Record<string, string>;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Hızlı Erişim",
    type: "links",
    items: [
      { label: "Ana Sayfa", url: "/" },
      { label: "Hizmetlerimiz", url: "/hizmetlerimiz" },
      { label: "Fiyat Listesi", url: "/fiyat-listesi" },
      { label: "Hakkımızda", url: "/hakkimizda" },
      { label: "Kliniklerimiz", url: "/kliniklerimiz" },
      { label: "Blog", url: "/blog" },
      { label: "İletişim", url: "/iletisim" },
    ],
  },
  {
    title: "Hizmetlerimiz",
    type: "links",
    items: [
      { label: "Genel Diş Hekimliği", url: "/hizmetlerimiz" },
      { label: "İmplant Tedavisi", url: "/hizmetlerimiz" },
      { label: "Estetik Diş Hekimliği", url: "/hizmetlerimiz" },
      { label: "Ortodonti", url: "/hizmetlerimiz" },
      { label: "Çocuk Diş Hekimliği", url: "/cocuk-dis-hekimligi" },
    ],
  },
];

const SOCIAL_KEYS = ["social_facebook", "social_x", "social_youtube", "social_instagram", "social_linkedin", "social_whatsapp"];
const SOCIAL_LABELS: Record<string, string> = {
  social_facebook: "Facebook", social_x: "X (Twitter)", social_youtube: "YouTube",
  social_instagram: "Instagram", social_linkedin: "LinkedIn", social_whatsapp: "WhatsApp",
};

export function FooterSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_COLUMNS);
  const [meta, setMeta] = useState<FooterMeta>({
    slogan: "Where positivity begins", about: "", copyright: "© 2026 Positive Dental Studio. Tüm hakları saklıdır.",
    phone: "0850 123 45 67", email: "info@positivedental.com", hours: "Pzt – Cmt: 09:00 – 20:00", hours_note: "Cumartesi: 09:00 – 18:00",
    socials: {},
  });

  // Düzenleme
  const [editCol, setEditCol] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<{ col: number; idx: number } | null>(null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [newColTitle, setNewColTitle] = useState("");

  // Sürükle-bırak
  const dragCol = useRef<number | null>(null);
  const dragItem = useRef<{ col: number; idx: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*").in("group_name", ["footer", "footer_social"]);
      const items = data || [];
      const vals: Record<string, string> = {};
      items.forEach(s => { vals[s.key] = s.value; });

      // Columns
      try {
        const parsed = JSON.parse(vals["footer_columns"] || "");
        if (Array.isArray(parsed) && parsed.length > 0) setColumns(parsed);
      } catch { /* fallback */ }

      // Meta
      setMeta({
        slogan: vals["footer_slogan"] || meta.slogan,
        about: vals["footer_about"] || "",
        copyright: vals["footer_copyright"] || meta.copyright,
        phone: vals["footer_phone"] || meta.phone,
        email: vals["footer_email"] || meta.email,
        hours: vals["footer_hours"] || meta.hours,
        hours_note: vals["footer_hours_note"] || meta.hours_note,
        socials: Object.fromEntries(SOCIAL_KEYS.map(k => [k, vals[k] || "#"])),
      });

      setLoading(false);
    };
    load();
  }, []);

  const saveAll = async () => {
    setSaving(true);
    const updates: Record<string, string> = {
      footer_columns: JSON.stringify(columns),
      footer_slogan: meta.slogan,
      footer_about: meta.about,
      footer_copyright: meta.copyright,
      footer_phone: meta.phone,
      footer_email: meta.email,
      footer_hours: meta.hours,
      footer_hours_note: meta.hours_note,
      ...meta.socials,
    };

    // footer_columns yoksa ekle
    const { data: existing } = await supabase.from("site_settings").select("key").eq("key", "footer_columns");
    if (!existing || existing.length === 0) {
      await supabase.from("site_settings").insert({ key: "footer_columns", value: JSON.stringify(columns), label: "Footer Sütunları", type: "json", group_name: "footer" });
    }

    for (const [key, value] of Object.entries(updates)) {
      await supabase.from("site_settings").update({ value }).eq("key", key);
    }
    await logAction("update", "site_settings", "", "Footer ayarları güncellendi");
    setSaving(false);
    alert("Footer kaydedildi!");
  };

  // ── Sütun işlemleri
  const addColumn = () => {
    if (!newColTitle.trim()) return;
    setColumns([...columns, { title: newColTitle.trim(), type: "links", items: [] }]);
    setNewColTitle("");
  };
  const removeColumn = (i: number) => {
    if (!confirm(`"${columns[i].title}" sütunu silinecek. Emin misiniz?`)) return;
    setColumns(columns.filter((_, idx) => idx !== i));
  };
  const moveColumn = (from: number, to: number) => {
    if (to < 0 || to >= columns.length) return;
    const n = [...columns];
    [n[from], n[to]] = [n[to], n[from]];
    setColumns(n);
  };

  // ── Öğe işlemleri
  const addItem = (colIdx: number) => {
    if (!newItemLabel.trim()) return;
    const n = [...columns];
    n[colIdx].items.push({ label: newItemLabel.trim(), url: newItemUrl.trim() || "#" });
    setColumns(n);
    setNewItemLabel("");
    setNewItemUrl("");
  };
  const removeItem = (colIdx: number, itemIdx: number) => {
    const n = [...columns];
    n[colIdx].items.splice(itemIdx, 1);
    setColumns(n);
  };
  const moveItem = (colIdx: number, from: number, to: number) => {
    if (to < 0 || to >= columns[colIdx].items.length) return;
    const n = [...columns];
    [n[colIdx].items[from], n[colIdx].items[to]] = [n[colIdx].items[to], n[colIdx].items[from]];
    setColumns(n);
  };

  // Sürükle-bırak sütun
  const onDragStartCol = (i: number) => { dragCol.current = i; };
  const onDropCol = (i: number) => {
    if (dragCol.current === null || dragCol.current === i) return;
    moveColumn(dragCol.current, i);
    dragCol.current = null;
  };

  // Sürükle-bırak öğe
  const onDragStartItem = (col: number, idx: number) => { dragItem.current = { col, idx }; };
  const onDropItem = (col: number, idx: number) => {
    if (!dragItem.current || (dragItem.current.col === col && dragItem.current.idx === idx)) return;
    if (dragItem.current.col === col) {
      moveItem(col, dragItem.current.idx, idx);
    } else {
      // Sütunlar arası taşıma
      const n = [...columns];
      const [moved] = n[dragItem.current.col].items.splice(dragItem.current.idx, 1);
      n[col].items.splice(idx, 0, moved);
      setColumns(n);
    }
    dragItem.current = null;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Footer Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Sütunları sürükleyerek sıralayın, öğe ekleyin/çıkarın</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:from-indigo-400 hover:to-violet-500 transition disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      {/* ── GENEL BİLGİLER ── */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Genel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Slogan" value={meta.slogan} onChange={v => setMeta(m => ({ ...m, slogan: v }))} />
          <FormField label="Copyright" value={meta.copyright} onChange={v => setMeta(m => ({ ...m, copyright: v }))} />
          <div className="md:col-span-2">
            <FormField label="Açıklama" value={meta.about} onChange={v => setMeta(m => ({ ...m, about: v }))} multiline />
          </div>
          <FormField label="Telefon" value={meta.phone} onChange={v => setMeta(m => ({ ...m, phone: v }))} />
          <FormField label="Email" value={meta.email} onChange={v => setMeta(m => ({ ...m, email: v }))} />
          <FormField label="Çalışma Saatleri" value={meta.hours} onChange={v => setMeta(m => ({ ...m, hours: v }))} />
          <FormField label="Çalışma Saatleri Notu" value={meta.hours_note} onChange={v => setMeta(m => ({ ...m, hours_note: v }))} />
        </div>
      </Card>

      {/* ── SOSYAL MEDYA ── */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Sosyal Medya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_KEYS.map(k => (
            <FormField key={k} label={SOCIAL_LABELS[k]} value={meta.socials[k] || ""}
              onChange={v => setMeta(m => ({ ...m, socials: { ...m.socials, [k]: v } }))} />
          ))}
        </div>
      </Card>

      {/* ── SÜTUNLAR (Sürükle-Bırak) ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Footer Sütunları</h3>
          <span className="text-xs text-gray-400">Sürükleyerek sıralayın</span>
        </div>

        <div className="space-y-4">
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              draggable
              onDragStart={() => onDragStartCol(colIdx)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDropCol(colIdx)}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-indigo-200 transition-colors"
            >
              {/* Sütun başlığı */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 cursor-grab active:cursor-grabbing">
                <span className="text-gray-400 text-lg cursor-grab">⠿</span>
                <div className="flex-1">
                  {editCol === colIdx ? (
                    <input
                      autoFocus
                      value={col.title}
                      onChange={e => { const n = [...columns]; n[colIdx].title = e.target.value; setColumns(n); }}
                      onBlur={() => setEditCol(null)}
                      onKeyDown={e => { if (e.key === "Enter") setEditCol(null); }}
                      className="px-2 py-1 rounded-lg border border-indigo-300 text-sm font-bold focus:outline-none"
                    />
                  ) : (
                    <span className="font-bold text-gray-900 text-sm">{col.title}</span>
                  )}
                  <span className="ml-2 text-xs text-gray-400">{col.items.length} öğe</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditCol(colIdx)}
                    className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded">Adı Düzenle</button>
                  <button onClick={() => moveColumn(colIdx, colIdx - 1)} disabled={colIdx === 0}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30">←</button>
                  <button onClick={() => moveColumn(colIdx, colIdx + 1)} disabled={colIdx === columns.length - 1}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30">→</button>
                  <button onClick={() => removeColumn(colIdx)}
                    className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Sil</button>
                </div>
              </div>

              {/* Öğeler */}
              <div className="p-3 space-y-1">
                {col.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    draggable
                    onDragStart={e => { e.stopPropagation(); onDragStartItem(colIdx, itemIdx); }}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => { e.stopPropagation(); onDropItem(colIdx, itemIdx); }}
                    className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-grab active:cursor-grabbing group"
                  >
                    <span className="text-gray-300 text-sm cursor-grab group-hover:text-indigo-400">⠿</span>
                    <span className="text-sm font-medium text-gray-900 flex-1">{item.label}</span>
                    <span className="text-xs text-gray-400 font-mono truncate max-w-32">{item.url}</span>
                    <button onClick={() => {
                      setEditItem({ col: colIdx, idx: itemIdx });
                      setNewItemLabel(item.label);
                      setNewItemUrl(item.url);
                    }} className="px-1.5 py-0.5 text-xs text-indigo-500 hover:bg-indigo-100 rounded opacity-0 group-hover:opacity-100">✎</button>
                    <button onClick={() => removeItem(colIdx, itemIdx)}
                      className="px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}

                {/* Yeni öğe ekle */}
                <div className="flex gap-2 pt-2">
                  <input value={editItem?.col === colIdx ? newItemLabel : (editItem ? "" : newItemLabel)}
                    onChange={e => setNewItemLabel(e.target.value)} placeholder="Etiket"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-indigo-400 outline-none" />
                  <input value={editItem?.col === colIdx ? newItemUrl : (editItem ? "" : newItemUrl)}
                    onChange={e => setNewItemUrl(e.target.value)} placeholder="URL"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono focus:border-indigo-400 outline-none"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (editItem && editItem.col === colIdx) {
                          const n = [...columns];
                          n[editItem.col].items[editItem.idx] = { label: newItemLabel, url: newItemUrl };
                          setColumns(n);
                          setEditItem(null);
                          setNewItemLabel("");
                          setNewItemUrl("");
                        } else {
                          addItem(colIdx);
                        }
                      }
                    }} />
                  <button onClick={() => {
                    if (editItem && editItem.col === colIdx) {
                      const n = [...columns];
                      n[editItem.col].items[editItem.idx] = { label: newItemLabel, url: newItemUrl };
                      setColumns(n);
                      setEditItem(null);
                      setNewItemLabel("");
                      setNewItemUrl("");
                    } else {
                      addItem(colIdx);
                    }
                  }} className="px-3 py-1.5 bg-indigo-500 text-white font-bold rounded-lg text-xs hover:bg-indigo-400 transition">
                    {editItem?.col === colIdx ? "Güncelle" : "Ekle"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Yeni sütun ekle */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <input value={newColTitle} onChange={e => setNewColTitle(e.target.value)} placeholder="Yeni sütun başlığı..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-400 outline-none"
            onKeyDown={e => { if (e.key === "Enter") addColumn(); }} />
          <button onClick={addColumn}
            className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition">
            + Sütun Ekle
          </button>
        </div>
      </Card>

      {/* ── ÖNİZLEME ── */}
      <Card className="p-5 bg-[#0B5FBF]">
        <h3 className="font-bold text-white mb-4">Önizleme</h3>
        <div className={`grid gap-6 text-sm`} style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 1fr)` }}>
          {/* About sütunu */}
          <div>
            <p className="text-white font-medium text-xs">{meta.slogan}</p>
            <p className="text-blue-300 mt-1 text-xs leading-relaxed">{meta.about?.slice(0, 100)}{meta.about?.length > 100 ? "..." : ""}</p>
            <div className="flex gap-1 mt-2">
              {SOCIAL_KEYS.filter(k => meta.socials[k] && meta.socials[k] !== "#").map(k => (
                <span key={k} className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] text-white">
                  {SOCIAL_LABELS[k][0]}
                </span>
              ))}
            </div>
          </div>
          {/* Dinamik sütunlar */}
          {columns.map((col, i) => (
            <div key={i}>
              <p className="text-white font-semibold text-xs mb-2">{col.title}</p>
              {col.items.slice(0, 6).map((item, j) => (
                <p key={j} className="text-blue-300 text-xs">{item.label}</p>
              ))}
              {col.items.length > 6 && <p className="text-blue-400 text-xs">+{col.items.length - 6} daha</p>}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-4 pt-3 flex justify-between text-xs">
          <span className="text-slate-500">{meta.copyright}</span>
          <span className="text-blue-300">{meta.phone} · {meta.email}</span>
        </div>
      </Card>
    </div>
  );
}
