import { motion } from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";

const COVERAGE_TABLE = [
  { service: "\u0130lk Muayene & Kons\u00fcltasyon", covered: true, note: "T\u00fcm poli\u00e7elerde ge\u00e7erli" },
  { service: "Di\u015f Ta\u015f\u0131 Temizli\u011fi (Proflaksi)", covered: true, note: "Y\u0131lda 1\u20132 seans" },
  { service: "Dolgu (Kompozit / Amalgam)", covered: true, note: "Renk uyumlu beyaz dolgu dahil" },
  { service: "Di\u015f \u00c7ekimi", covered: true, note: "Yirmi ya\u015f dahil" },
  { service: "K\u00f6k Kanal Tedavisi", covered: true, note: "\u00c7o\u011fu poli\u00e7ede dahil" },
  { service: "R\u00f6ntgen (Periapikal / Panoramik)", covered: true, note: "Tan\u0131 ama\u00e7l\u0131 \u00e7ekimler" },
  { service: "Di\u015f Protezi (Hareketli)", covered: true, note: "Limit dahilinde" },
  { service: "Zirkonyum / Porselen Kron", covered: "partial" as const, note: "Premium poli\u00e7elerde mevcut" },
  { service: "Ortodonti (Tel / \u015eeffaf Plak)", covered: "partial" as const, note: "Se\u00e7ili poli\u00e7elerde mevcut" },
  { service: "Di\u015f \u0130mplant\u0131", covered: "partial" as const, note: "Sadece baz\u0131 premium poli\u00e7elerde" },
  { service: "Estetik Di\u015f Beyazlatma", covered: false, note: "Sigorta kapsam\u0131 d\u0131\u015f\u0131nda" },
  { service: "G\u00fcl\u00fc\u015f Tasar\u0131m\u0131 (DSD/Lamine)", covered: false, note: "Estetik ama\u00e7l\u0131, kapsam d\u0131\u015f\u0131" },
];

export function CoverageTable() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Hangi \u0130\u015flemler Kapsan\u0131yor?</span>
          <h2 className="font-display text-4xl font-black text-slate-900">Genel kapsam rehberi.</h2>
          <p className="text-slate-500 mt-3 text-sm">Her poli\u00e7e farkl\u0131d\u0131r; kesin bilgi i\u00e7in klini\u011fimizi aray\u0131n.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-600 to-violet-700 px-6 py-4">
            <p className="font-bold text-white text-sm col-span-1">Tedavi / Hizmet</p>
            <p className="font-bold text-white text-sm text-center">Kapsam</p>
            <p className="font-bold text-white text-sm text-right">Not</p>
          </div>
          {COVERAGE_TABLE.map((row, i) => (
            <div key={row.service}
              className={`grid grid-cols-3 items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
              <p className="text-slate-800 text-sm font-medium col-span-1">{row.service}</p>
              <div className="flex justify-center">
                {row.covered === true ? (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dahil
                  </span>
                ) : row.covered === "partial" ? (
                  <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> K\u0131smi
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    \u2715 Kapsam D\u0131\u015f\u0131
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs text-right">{row.note}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
