import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, Search, Calendar, Phone, Tag, Info,
  Sparkles, ArrowRight, CheckCircle2, X,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { useTable } from "../hooks/useSupabase";
import type { PriceItem } from "@/lib/supabase";

const BOOKING_URL = "https://randevu.positivedental.com";

const CATEGORY_STYLE: Record<string, { emoji: string; color: string; lightBg: string; borderColor: string; tagColor: string }> = {
  "Muayene Fiyatları":        { emoji: "🔍", color: "from-indigo-500 to-violet-600", lightBg: "bg-indigo-50", borderColor: "border-indigo-200", tagColor: "bg-indigo-100 text-indigo-700" },
  "Koruyucu Diş Hekimliği":   { emoji: "🛡️", color: "from-teal-500 to-cyan-600",   lightBg: "bg-teal-50",   borderColor: "border-teal-200",   tagColor: "bg-teal-100 text-teal-700" },
  "Çocuk Diş Tedavileri":     { emoji: "🌈", color: "from-pink-500 to-rose-600",    lightBg: "bg-pink-50",   borderColor: "border-pink-200",   tagColor: "bg-pink-100 text-pink-700" },
  "Dolgu ve Kanal Tedavileri": { emoji: "🦷", color: "from-amber-500 to-orange-500", lightBg: "bg-amber-50",  borderColor: "border-amber-200",  tagColor: "bg-amber-100 text-amber-700" },
  "Diş Estetiği Tedavileri":  { emoji: "✨", color: "from-violet-500 to-purple-600", lightBg: "bg-violet-50", borderColor: "border-violet-200", tagColor: "bg-violet-100 text-violet-700" },
  "Diş Beyazlatma":           { emoji: "💎", color: "from-sky-500 to-blue-600",     lightBg: "bg-sky-50",    borderColor: "border-sky-200",    tagColor: "bg-sky-100 text-sky-700" },
  "Diş Çekimi Fiyatları":     { emoji: "🔧", color: "from-rose-500 to-red-600",     lightBg: "bg-rose-50",   borderColor: "border-rose-200",   tagColor: "bg-rose-100 text-rose-700" },
  "İmplant Tedavisi":         { emoji: "🔩", color: "from-slate-600 to-slate-800",  lightBg: "bg-slate-50",  borderColor: "border-slate-300",  tagColor: "bg-slate-200 text-slate-700" },
  "Ortodontik Tedaviler":     { emoji: "😁", color: "from-green-500 to-emerald-600", lightBg: "bg-green-50",  borderColor: "border-green-200",  tagColor: "bg-green-100 text-green-700" },
  "Protez Tedavileri":        { emoji: "🦾", color: "from-orange-500 to-amber-600", lightBg: "bg-orange-50", borderColor: "border-orange-200", tagColor: "bg-orange-100 text-orange-700" },
  "Ağız ve Çene Cerrahisi":   { emoji: "🏥", color: "from-red-600 to-rose-700",     lightBg: "bg-red-50",    borderColor: "border-red-200",    tagColor: "bg-red-100 text-red-700" },
  "Dijital Diş Hekimliği":    { emoji: "🖥️", color: "from-indigo-600 to-blue-700",  lightBg: "bg-indigo-50", borderColor: "border-indigo-200", tagColor: "bg-indigo-100 text-indigo-700" },
};

function formatPrice(min: number, max: number): string {
  if (min === 0 && max === 0) return "Ücretsiz";
  if (max > min) return `₺${min.toLocaleString("tr-TR")} – ₺${max.toLocaleString("tr-TR")}`;
  return `₺${min.toLocaleString("tr-TR")}`;
}

interface PriceCategoryDB { id: string; name: string; icon: string; color: string; sort_order: number; is_active: boolean; }

function buildPriceGroups(items: PriceItem[], dbCats: PriceCategoryDB[]) {
  const map = new Map<string, { name: string; price: string; note: string | null }[]>();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category)!.push({
      name: item.name,
      price: formatPrice(item.price_min, item.price_max),
      note: item.price_note || null,
    });
  }

  // Kategori sıralamasını price_categories tablosundan al
  const catOrder = dbCats.length > 0 ? dbCats : [];
  const orderedCats = catOrder.length > 0
    ? catOrder.map(c => c.name).filter(name => map.has(name))
    : Array.from(map.keys());

  return orderedCats.map(cat => {
    const dbCat = dbCats.find(c => c.name === cat);
    const fallbackStyle = CATEGORY_STYLE[cat] || { emoji: "💰", color: "from-gray-500 to-gray-600", lightBg: "bg-gray-50", borderColor: "border-gray-200", tagColor: "bg-gray-100 text-gray-700" };
    const color = dbCat?.color || fallbackStyle.color;
    const id = cat.toLowerCase().replace(/[^a-zğüşıöç0-9]+/g, "-");

    return {
      id,
      label: cat,
      emoji: fallbackStyle.emoji,
      iconUrl: dbCat?.icon || "",
      color,
      lightBg: fallbackStyle.lightBg,
      borderColor: fallbackStyle.borderColor,
      tagColor: fallbackStyle.tagColor,
      items: map.get(cat) || [],
    };
  });
}

/* Hardcoded fiyat verisi kaldırıldı — artık Supabase'den çekiliyor */
const _LEGACY_PRICE_GROUPS = [
  {
    id: "muayene",
    label: "Muayene Fiyatları",
    emoji: "🔍",
    color: "from-indigo-500 to-violet-600",
    lightBg: "bg-indigo-50",
    borderColor: "border-indigo-200",
    tagColor: "bg-indigo-100 text-indigo-700",
    items: [
      { name: "Genel Ağız Muayenesi",              price: "Ücretsiz", note: "İlk değerlendirme" },
      { name: "Konsültasyon (Uzman Hekim)",          price: "₺500",    note: null },
      { name: "Panoramik Röntgen",                  price: "₺400",    note: null },
      { name: "Periapikal Röntgen (adet)",           price: "₺150",    note: null },
      { name: "3D / CBCT Çekim",                    price: "₺1.500",  note: "Dijital tarama" },
      { name: "Dijital Gülüş Tasarımı Analizi",     price: "₺800",    note: "DSD Planlama" },
    ],
  },
  {
    id: "koruyucu",
    label: "Koruyucu Diş Hekimliği",
    emoji: "🛡️",
    color: "from-teal-500 to-cyan-600",
    lightBg: "bg-teal-50",
    borderColor: "border-teal-200",
    tagColor: "bg-teal-100 text-teal-700",
    items: [
      { name: "Diş Taşı Temizliği (Proflaksi)",    price: "₺1.200",  note: "Üst + alt çene" },
      { name: "Diş Eti Cilası (Polishing)",         price: "₺600",    note: null },
      { name: "Flor Uygulaması",                    price: "₺500",    note: "Çürük önleyici" },
      { name: "Fissür Örtücü (diş başına)",         price: "₺400",    note: null },
      { name: "Ağız Bakım Eğitimi",                 price: "₺300",    note: null },
    ],
  },
  {
    id: "cocuk",
    label: "Çocuk Diş Tedavileri",
    emoji: "🌈",
    color: "from-pink-500 to-rose-600",
    lightBg: "bg-pink-50",
    borderColor: "border-pink-200",
    tagColor: "bg-pink-100 text-pink-700",
    items: [
      { name: "Çocuk Muayenesi (0–12 yaş)",        price: "Ücretsiz", note: "İlk ziyaret" },
      { name: "Süt Dişi Dolgusu",                   price: "₺600 – ₺900",    note: "Renk ve yüzeye göre" },
      { name: "Süt Dişi Çekimi",                    price: "₺500",    note: null },
      { name: "Çocuk Kanal Tedavisi",               price: "₺1.500", note: null },
      { name: "Paslanmaz Çelik Kron",               price: "₺1.200",  note: "Süt dişi" },
      { name: "Çocuk Flor Uygulaması",              price: "₺400",    note: null },
      { name: "Fissür Örtücü (diş başına)",         price: "₺350",    note: null },
      { name: "Orthodontik Değerlendirme",          price: "Ücretsiz", note: null },
      { name: "Guided Film Therapy (seans)",        price: "₺800",    note: "Ağız alışkanlıkları" },
    ],
  },
  {
    id: "dolgu-kanal",
    label: "Dolgu ve Kanal Tedavileri",
    emoji: "🦷",
    color: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
    items: [
      { name: "Kompozit Dolgu – 1 Yüzey",          price: "₺900",    note: null },
      { name: "Kompozit Dolgu – 2 Yüzey",          price: "₺1.200",  note: null },
      { name: "Kompozit Dolgu – 3 Yüzey",          price: "₺1.600",  note: null },
      { name: "Kanal Tedavisi – Ön Diş",            price: "₺2.500",  note: null },
      { name: "Kanal Tedavisi – Küçük Azı",         price: "₺3.500",  note: null },
      { name: "Kanal Tedavisi – Büyük Azı",         price: "₺5.000",  note: null },
      { name: "Kanal Tedavisi Revizyonu",            price: "₺4.000 – ₺7.000", note: "Zorluğa göre" },
      { name: "Post-Kor Uygulama",                  price: "₺1.500",  note: null },
    ],
  },
  {
    id: "estetik",
    label: "Diş Estetiği Tedavileri",
    emoji: "✨",
    color: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-200",
    tagColor: "bg-violet-100 text-violet-700",
    items: [
      { name: "Porselen Lamine (diş başına)",       price: "₺8.000 – ₺12.000", note: "Materyal kalitesine göre" },
      { name: "Zirkonyum Kron (diş başına)",        price: "₺7.000 – ₺10.000", note: null },
      { name: "E-max Kron (diş başına)",             price: "₺9.000 – ₺13.000", note: "Tam seramik" },
      { name: "Dijital Gülüş Tasarımı (DSD)",       price: "₺15.000+", note: "Full set fiyat teklifi verilir" },
      { name: "Pembe Estetik / Diş Eti Estetiği",   price: "₺3.000 – ₺6.000", note: "Lazer dahil" },
      { name: "Gingivektomi (diş eti şekillendirme)", price: "₺2.500",  note: null },
      { name: "Bonding / Diastema Kapatma",         price: "₺2.500 – ₺4.000", note: "Diş başına" },
    ],
  },
  {
    id: "beyazlatma",
    label: "Diş Beyazlatma",
    emoji: "💎",
    color: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    borderColor: "border-sky-200",
    tagColor: "bg-sky-100 text-sky-700",
    items: [
      { name: "Klinik Beyazlatma (Office Bleaching)", price: "₺3.500",  note: "Tek seans, ~1 saat" },
      { name: "Ev Tipi Beyazlatma (Home Bleaching)",  price: "₺2.500",  note: "Plak + jel seti dahil" },
      { name: "Kombine Beyazlatma",                   price: "₺5.500",  note: "Klinik + ev seti" },
      { name: "Karbamid Peroksit Jel (set)",          price: "₺800",    note: "Yenileme paketi" },
    ],
  },
  {
    id: "cekim",
    label: "Diş Çekimi Fiyatları",
    emoji: "🔧",
    color: "from-rose-500 to-red-600",
    lightBg: "bg-rose-50",
    borderColor: "border-rose-200",
    tagColor: "bg-rose-100 text-rose-700",
    items: [
      { name: "Basit Diş Çekimi",                   price: "₺1.000",  note: null },
      { name: "Cerrahi Diş Çekimi",                 price: "₺2.000 – ₺3.500", note: "Güçlüğe göre" },
      { name: "Gömük 20 Yaş Dişi Çekimi",           price: "₺3.500 – ₺6.000", note: "CT + duruma göre" },
      { name: "Yarı Gömük 20 Yaş Çekimi",           price: "₺2.500 – ₺4.000", note: null },
      { name: "Sedasyon ile Çekim (ek ücret)",       price: "₺3.000+",  note: "Anestezi dahil" },
    ],
  },
  {
    id: "implant",
    label: "İmplant Tedavisi",
    emoji: "🔩",
    color: "from-slate-600 to-slate-800",
    lightBg: "bg-slate-50",
    borderColor: "border-slate-300",
    tagColor: "bg-slate-200 text-slate-700",
    items: [
      { name: "Straumann İmplant (adet)",            price: "₺25.000", note: "İsviçre menşei, 15 yıl garanti" },
      { name: "Nobel Biocare İmplant (adet)",        price: "₺22.000", note: null },
      { name: "MIS İmplant (adet)",                  price: "₺15.000", note: null },
      { name: "Osstem İmplant (adet)",               price: "₺12.000", note: null },
      { name: "İmplant Üstü Zirkonyum Kron",         price: "₺8.000",  note: "İmplant fiyatına ayrıca" },
      { name: "Kemik Tozu / Membran (ek)",           price: "₺5.000 – ₺10.000", note: "Gerektiğinde" },
      { name: "Sinüs Lifting (tek taraf)",           price: "₺12.000", note: null },
      { name: "All-on-4 (tam çene)",                 price: "₺120.000+", note: "Teklif alınız" },
      { name: "All-on-6 (tam çene)",                 price: "₺150.000+", note: "Teklif alınız" },
    ],
  },
  {
    id: "ortodonti",
    label: "Ortodontik Tedaviler",
    emoji: "😁",
    color: "from-green-500 to-emerald-600",
    lightBg: "bg-green-50",
    borderColor: "border-green-200",
    tagColor: "bg-green-100 text-green-700",
    items: [
      { name: "Metal Braket Ortodonti",              price: "₺25.000 – ₺35.000", note: "Üst + alt çene" },
      { name: "Seramik Braket Ortodonti",            price: "₺35.000 – ₺50.000", note: null },
      { name: "Telsiz Ortodonti – Orthero",          price: "₺40.000 – ₺55.000", note: "Yerli şeffaf plak" },
      { name: "Telsiz Ortodonti – Invisalign",       price: "₺60.000 – ₺90.000", note: "Orijinal Invisalign" },
      { name: "Tek Çene Ortodonti",                  price: "₺15.000 – ₺25.000", note: null },
      { name: "Ortodontik Tutucu (Retainer)",        price: "₺2.500",  note: "Sabit veya hareketli" },
      { name: "Hareketli Plak (çocuk)",              price: "₺4.000 – ₺6.000", note: null },
    ],
  },
  {
    id: "protez",
    label: "Protez Tedavileri",
    emoji: "🦾",
    color: "from-orange-500 to-amber-600",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    tagColor: "bg-orange-100 text-orange-700",
    items: [
      { name: "Tam Hareketli Protez (tek çene)",     price: "₺8.000 – ₺12.000", note: "Materyale göre" },
      { name: "Kısmi Hareketli Protez",              price: "₺6.000 – ₺9.000", note: null },
      { name: "İskeletli Protez",                    price: "₺10.000 – ₺14.000", note: null },
      { name: "Geçici (Akrilik) Kron (adet)",        price: "₺1.500",  note: null },
      { name: "Metal Destekli Porselen Kron (adet)", price: "₺5.000",  note: null },
      { name: "Zirkonyum Kron (adet)",               price: "₺7.000 – ₺10.000", note: null },
      { name: "Köprü (3 üyeli)",                     price: "₺18.000 – ₺28.000", note: "Materyale göre" },
    ],
  },
  {
    id: "cerrahi",
    label: "Ağız ve Çene Cerrahisi",
    emoji: "🏥",
    color: "from-red-600 to-rose-700",
    lightBg: "bg-red-50",
    borderColor: "border-red-200",
    tagColor: "bg-red-100 text-red-700",
    items: [
      { name: "Kist Operasyonu",                     price: "₺6.000 – ₺12.000", note: "Büyüklüğe göre" },
      { name: "Apikal Rezeksiyon",                   price: "₺5.000 – ₺8.000", note: null },
      { name: "Frenulum Düzeltme (Frenektomi)",      price: "₺3.000",  note: "Lazer seçeneği mevcut" },
      { name: "Çene Eklemi Tedavisi (TME Splint)",   price: "₺8.000 – ₺15.000", note: null },
      { name: "Uyku Apnesi Aparatı",                 price: "₺10.000", note: null },
      { name: "Diş Eti Grefti",                      price: "₺7.000 – ₺12.000", note: "Bölgeye göre" },
    ],
  },
  {
    id: "dijital",
    label: "Dijital Diş Hekimliği",
    emoji: "🖥️",
    color: "from-indigo-600 to-blue-700",
    lightBg: "bg-indigo-50",
    borderColor: "border-indigo-200",
    tagColor: "bg-indigo-100 text-indigo-700",
    items: [
      { name: "İntraoral Dijital Tarama",            price: "₺1.000",  note: "CEREC / iTero" },
      { name: "Dijital Anestezi (Wand)",             price: "₺500",    note: "Ağrısız enjeksiyon" },
      { name: "Lazer Diş Eti Tedavisi (seans)",      price: "₺2.500 – ₺5.000", note: null },
      { name: "CEREC Tek Seans Kron",                price: "₺10.000", note: "Aynı gün teslim" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────
   NOTLAR
───────────────────────────────────────────────────────────────── */
const NOTES = [
  "Fiyatlar KDV dahildir ve bilgilendirme amaçlıdır; muayene sonrası net teklif verilir.",
  "Anlaşmalı kurum ve sigorta poliçesi sahiplerine ek indirim uygulanır.",
  "Taksit seçenekleri mevcuttur; kliniklerimizde bilgi alabilirsiniz.",
  "Fiyatlar, kullanılan materyal kalitesi ve tedavinin karmaşıklığına göre değişiklik gösterebilir.",
];

export function PriceList() {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["muayene"]));
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const { data: priceItems, loading: pricesLoading } = useTable<PriceItem>("price_items", "sort_order");
  const { data: priceCats } = useTable<PriceCategoryDB>("price_categories", "sort_order");

  const PRICE_GROUPS = priceItems.length > 0 ? buildPriceGroups(priceItems, priceCats) : _LEGACY_PRICE_GROUPS;

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenGroups(new Set());
      setExpandAll(false);
    } else {
      setOpenGroups(new Set(PRICE_GROUPS.map((g) => g.id)));
      setExpandAll(true);
    }
  };

  /* Arama filtresi */
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return PRICE_GROUPS;
    const q = search.toLowerCase();
    return PRICE_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.name.toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0 || group.label.toLowerCase().includes(q));
  }, [search]);

  /* Arama varsa tüm grupları aç */
  const displayGroups = filteredGroups;
  const searchActive = search.trim().length > 0;

  const totalServices = PRICE_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <>
      <SEO
        title="Fiyat Listesi — Tedavi Ücretleri"
        description="Positive Dental Studio diş tedavisi fiyat listesi: implant, ortodonti, estetik, dolgu, kanal ve daha fazlası. Şeffaf fiyatlandırma, taksit imkânı."
        url="/prices"
        keywords={["diş tedavisi fiyatları", "implant fiyatı", "ortodonti fiyatı", "lamine diş fiyatı", "zirkonyum fiyatı", "invisalign fiyatı"]}
        schemaType="dental"
      />

      <div className="bg-white overflow-hidden">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative bg-[#0D1235] overflow-hidden min-h-[52vh] flex items-center">
          <div className="absolute top-[-10%] right-[-6%] w-[420px] h-[420px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-8%] left-[-4%] w-[360px] h-[360px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-7">
                <Tag className="w-4 h-4 text-violet-300" />
                <span className="text-white/60 text-sm font-medium">Şeffaf Fiyatlandırma</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-5"
            >
              Tedavi
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Fiyat Listesi
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
              className="text-slate-400 text-lg max-w-xl mx-auto mb-10"
            >
              {PRICE_GROUPS.length} kategori · {totalServices} hizmet · Taksit imkânı mevcut
            </motion.p>

            {/* Arama kutusu */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="relative max-w-lg mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tedavi veya hizmet ara… (örn: implant, lamine)"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-white/30 focus:bg-white/15 backdrop-blur-sm transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8f8f6] to-transparent pointer-events-none" />
        </section>

        {/* ══ ANA İÇERİK ════════════════════════════════════════════ */}
        <section className="py-10 bg-[#f8f8f6] min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Üst bar — kontroller */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                {search ? (
                  <p className="text-slate-500 text-sm">
                    <span className="font-bold text-slate-800">"{search}"</span> için{" "}
                    {displayGroups.reduce((a, g) => a + g.items.length, 0)} sonuç bulundu
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm">{PRICE_GROUPS.length} kategori · {totalServices} tedavi</p>
                )}
              </div>
              <button
                onClick={handleExpandAll}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 transition-all"
              >
                {expandAll ? "Tümünü Kapat" : "Tümünü Aç"}
              </button>
            </div>

            {/* Accordion grupları */}
            <div className="space-y-2">
              {displayGroups.map((group) => {
                const isOpen = searchActive || openGroups.has(group.id);
                return (
                  <div key={group.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Başlık satırı */}
                    <button
                      onClick={() => !searchActive && toggleGroup(group.id)}
                      className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors ${
                        isOpen ? "bg-white" : "hover:bg-slate-50"
                      } ${searchActive ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {/* Sol: emoji + label */}
                      {group.iconUrl ? (
                        <img src={group.iconUrl} alt={group.label} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <span className="text-2xl flex-shrink-0">{group.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 text-[15px]">{group.label}</span>
                        <span className="ml-3 text-xs text-slate-400 font-medium">{group.items.length} hizmet</span>
                      </div>
                      {/* Renk etiketi */}
                      <span className={`hidden sm:inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${group.tagColor} flex-shrink-0`}>
                        {group.items[0]?.price.startsWith("₺") ? "₺" + group.items[0].price.slice(1).split(" ")[0] + " ↑" : group.items[0]?.price}
                      </span>
                      {/* Chevron */}
                      {!searchActive && (
                        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`} />
                      )}
                    </button>

                    {/* Renk çizgisi */}
                    {isOpen && (
                      <div className={`h-0.5 bg-gradient-to-r ${group.color} mx-6`} />
                    )}

                    {/* İçerik */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 pt-1">
                            {group.items.map((item, idx) => {
                              const highlight = search && item.name.toLowerCase().includes(search.toLowerCase());
                              return (
                                <div key={idx}
                                  className={`flex items-start justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0 ${highlight ? "bg-yellow-50 -mx-3 px-3 rounded-xl" : ""}`}
                                >
                                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-slate-800 text-sm font-medium">{item.name}</p>
                                      {item.note && (
                                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                                          <Info className="w-3 h-3 flex-shrink-0" /> {item.note}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`text-sm font-black flex-shrink-0 ${
                                    item.price === "Ücretsiz" ? "text-green-600" : "text-slate-900"
                                  }`}>
                                    {item.price}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Bulunamadı */}
            {displayGroups.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-black text-slate-900 text-xl mb-2">Sonuç bulunamadı</h3>
                <p className="text-slate-500 text-sm mb-4">"{search}" için fiyat listesinde eşleşme yok.</p>
                <button onClick={() => setSearch("")}
                  className="text-indigo-600 font-bold text-sm hover:underline">
                  Aramayı temizle
                </button>
              </div>
            )}

            {/* Notlar */}
            <div className="mt-8 bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <h3 className="font-bold text-amber-800 text-sm">Önemli Bilgiler</h3>
              </div>
              <ul className="px-6 py-5 space-y-2.5">
                {NOTES.map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="text-amber-400 font-black flex-shrink-0 mt-0.5">·</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#0D1235] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
          >
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-5" />
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
              Ücretsiz muayene ile
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">fiyat teklifi alın.</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">İlk muayene ücretsiz. Tedavinize özel net fiyatlandırma ve taksit seçenekleri için randevu alın.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" /> Ücretsiz Muayene Al <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+908501234567"
                className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}
