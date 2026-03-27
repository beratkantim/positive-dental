import { useState } from "react";
import { SEO } from "../components/SEO";
import { InsuranceHero } from "../components/insurance/InsuranceHero";
import { InsuranceGrid } from "../components/insurance/InsuranceGrid";
import { CoverageTable } from "../components/insurance/CoverageTable";
import { InsuranceFAQ } from "../components/insurance/InsuranceFAQ";

/* -- SIGORTA FIRMALARI -- */
const INSURANCES = [
  {
    id: 1,
    name: "Allianz Sigorta",
    logo: "\ud83d\udd35",
    color: "from-blue-600 to-blue-800",
    lightColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    type: "\u00d6zel Sa\u011fl\u0131k Sigortas\u0131",
    coverage: ["Genel Muayene", "Di\u015f Ta\u015f\u0131 Temizli\u011fi", "Dolgu", "R\u00f6ntgen", "Di\u015f \u00c7ekimi"],
    limits: "Y\u0131ll\u0131k \u20ba15.000 limitli",
    note: "Poli\u00e7e detay\u0131na g\u00f6re katk\u0131 pay\u0131 uygulanabilir.",
    popular: true,
  },
  {
    id: 2,
    name: "AXA Sigorta",
    logo: "\ud83d\udd34",
    color: "from-red-600 to-red-800",
    lightColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
    type: "Sa\u011fl\u0131k & Dental Plan",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "R\u00f6ntgen", "Zirkonyum Kron"],
    limits: "Y\u0131ll\u0131k \u20ba20.000 limitli",
    note: "Estetik uygulamalar ve implant kapsam d\u0131\u015f\u0131nd\u0131r.",
    popular: true,
  },
  {
    id: 3,
    name: "Mapfre Sigorta",
    logo: "\ud83d\udfe0",
    color: "from-orange-500 to-red-600",
    lightColor: "bg-orange-50 border-orange-200",
    textColor: "text-orange-700",
    type: "Tamamlay\u0131c\u0131 Sa\u011fl\u0131k",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Di\u015f \u00c7ekimi", "Protez"],
    limits: "Y\u0131ll\u0131k \u20ba10.000 limitli",
    note: "Ortodontik tedaviler ek poli\u00e7e ile m\u00fcmk\u00fcnd\u00fcr.",
    popular: false,
  },
  {
    id: 4,
    name: "Anadolu Sigorta",
    logo: "\ud83d\udfe2",
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50 border-green-200",
    textColor: "text-green-700",
    type: "\u00d6zel Sa\u011fl\u0131k Sigortas\u0131",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "R\u00f6ntgen", "Di\u015f \u00c7ekimi", "Kanal Tedavisi"],
    limits: "Y\u0131ll\u0131k \u20ba12.000 limitli",
    note: "SGK tamamlay\u0131c\u0131 poli\u00e7eleri de kabul edilmektedir.",
    popular: false,
  },
  {
    id: 5,
    name: "T\u00fcrkiye Sigorta",
    logo: "\ud83d\udd34",
    color: "from-red-700 to-rose-800",
    lightColor: "bg-rose-50 border-rose-200",
    textColor: "text-rose-700",
    type: "Bireysel & Kurumsal",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "\u00c7ekim", "Protez", "Zirkonyum"],
    limits: "Y\u0131ll\u0131k \u20ba18.000 limitli",
    note: "Devlet destekli sigorta kapsam\u0131 ge\u00e7erlidir.",
    popular: false,
  },
  {
    id: 6,
    name: "G\u00fcne\u015f Sigorta",
    logo: "\ud83c\udf1f",
    color: "from-yellow-500 to-amber-700",
    lightColor: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
    type: "Dental Tamamlay\u0131c\u0131",
    coverage: ["Genel Muayene", "Dolgu", "Di\u015f \u00c7ekimi", "R\u00f6ntgen"],
    limits: "Y\u0131ll\u0131k \u20ba8.000 limitli",
    note: "Temel dental poli\u00e7e; \u00fcst plan ek teminatlar i\u00e7erir.",
    popular: false,
  },
  {
    id: 7,
    name: "Ray Sigorta",
    logo: "\u26a1",
    color: "from-violet-600 to-purple-800",
    lightColor: "bg-violet-50 border-violet-200",
    textColor: "text-violet-700",
    type: "Sa\u011fl\u0131k Sigortas\u0131",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Di\u015f \u00c7ekimi", "Proflaksi"],
    limits: "Y\u0131ll\u0131k \u20ba10.000 limitli",
    note: "Poli\u00e7e tipine g\u00f6re kapsam de\u011fi\u015fiklik g\u00f6sterir.",
    popular: false,
  },
  {
    id: 8,
    name: "HDI Sigorta",
    logo: "\ud83c\udfdb\ufe0f",
    color: "from-slate-600 to-slate-800",
    lightColor: "bg-slate-50 border-slate-200",
    textColor: "text-slate-700",
    type: "Kurumsal Sa\u011fl\u0131k",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "R\u00f6ntgen", "Protez", "Kanal Tedavisi"],
    limits: "Y\u0131ll\u0131k \u20ba16.000 limitli",
    note: "Uluslararas\u0131 poli\u00e7e sahipleri de yararlanabilir.",
    popular: false,
  },
  {
    id: 9,
    name: "Sompo Japan Sigorta",
    logo: "\ud83c\uddef\ud83c\uddf5",
    color: "from-red-500 to-rose-700",
    lightColor: "bg-rose-50 border-rose-200",
    textColor: "text-rose-700",
    type: "Sa\u011fl\u0131k & Dental",
    coverage: ["Genel Muayene", "Dolgu", "Kanal Tedavisi", "Di\u015f \u00c7ekimi"],
    limits: "Y\u0131ll\u0131k \u20ba12.000 limitli",
    note: "Yabanc\u0131 uyruklu poli\u00e7e sahipleri de ba\u015fvurabilir.",
    popular: false,
  },
  {
    id: 10,
    name: "Unico Sigorta",
    logo: "\ud83e\udd84",
    color: "from-indigo-500 to-violet-700",
    lightColor: "bg-indigo-50 border-indigo-200",
    textColor: "text-indigo-700",
    type: "Bireysel Dental",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "R\u00f6ntgen", "Di\u015f \u00c7ekimi"],
    limits: "Y\u0131ll\u0131k \u20ba9.000 limitli",
    note: "Dijital poli\u00e7e ile an\u0131nda onay s\u00fcreci.",
    popular: false,
  },
  {
    id: 11,
    name: "Generali Sigorta",
    logo: "\ud83e\udd81",
    color: "from-red-600 to-red-800",
    lightColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
    type: "Premium Sa\u011fl\u0131k",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "Protez", "Ortodonti"],
    limits: "Y\u0131ll\u0131k \u20ba25.000 limitli",
    note: "Premium poli\u00e7ede ortodonti teminat\u0131 mevcuttur.",
    popular: true,
  },
  {
    id: 12,
    name: "Cigna Sa\u011fl\u0131k",
    logo: "\ud83d\udc9a",
    color: "from-green-500 to-teal-700",
    lightColor: "bg-teal-50 border-teal-200",
    textColor: "text-teal-700",
    type: "Uluslararas\u0131 Sa\u011fl\u0131k",
    coverage: ["Genel Muayene", "Proflaksi", "Dolgu", "Kanal Tedavisi", "Zirkonyum", "\u0130mplant (limitli)"],
    limits: "Y\u0131ll\u0131k \u20ba30.000 limitli",
    note: "Global poli\u00e7e kapsam\u0131nda implant teminat\u0131 mevcuttur.",
    popular: true,
  },
];

export function Insurance() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <SEO
        title="Anla\u015fmal\u0131 Sigortalar \u2014 Di\u015f Tedavisi Sigorta Kapsam\u0131"
        description="Positive Dental Studio'da ge\u00e7erli sigorta poli\u00e7eleri: Allianz, AXA, Mapfre, Anadolu Sigorta ve daha fazlas\u0131. Poli\u00e7enizle \u00fccretsiz muayene al\u0131n."
        url="/anlasmali-sigortalar"
        keywords={["di\u015f sigortas\u0131", "anla\u015fmal\u0131 sigorta", "sa\u011fl\u0131k sigortas\u0131 di\u015f", "tamamlay\u0131c\u0131 sigorta di\u015f", "allianz di\u015f", "axa di\u015f"]}
        schemaType="dental"
      />

      <div className="bg-white overflow-hidden">
        <InsuranceHero insuranceCount={INSURANCES.length} />
        <InsuranceGrid
          insurances={INSURANCES}
          search={search}
          setSearch={setSearch}
          showAll={showAll}
          setShowAll={setShowAll}
        />
        <CoverageTable />
        <InsuranceFAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </div>
    </>
  );
}
