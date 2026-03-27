import { motion } from "motion/react";
import {
  Shield, CheckCircle2, Star, AlertCircle, ChevronDown, ChevronUp, Percent, Search,
} from "lucide-react";

interface InsuranceItem {
  id: number;
  name: string;
  logo: string;
  color: string;
  lightColor: string;
  textColor: string;
  type: string;
  coverage: string[];
  limits: string;
  note: string;
  popular: boolean;
}

export function InsuranceGrid({
  insurances,
  search,
  setSearch,
  showAll,
  setShowAll,
}: {
  insurances: InsuranceItem[];
  search: string;
  setSearch: (s: string) => void;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  const filtered = insurances.filter((ins) =>
    !search || ins.name.toLowerCase().includes(search.toLowerCase()) || ins.type.toLowerCase().includes(search.toLowerCase())
  );

  const popular = insurances.filter((i) => i.popular);
  const displayList = showAll ? filtered : filtered.slice(0, 8);

  return (
    <>
      {/* Popular insurances */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="font-display font-black text-slate-900 text-2xl">En \u00c7ok Tercih Edilen Sigortalar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-gradient-to-br from-slate-900 to-[#0D1235] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ins.color} rounded-t-2xl`} />
                <div className="text-3xl mb-3">{ins.logo}</div>
                <h3 className="font-black text-white text-sm mb-1">{ins.name}</h3>
                <p className="text-white/40 text-xs mb-3">{ins.type}</p>
                <span className="inline-flex items-center gap-1 bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full font-medium">
                  <Shield className="w-3 h-3" /> {ins.limits}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All insurances list */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Anla\u015fmal\u0131 Sigorta \u015eirketleri</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Poli\u00e7eniz burada m\u0131?
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">A\u015fa\u011f\u0131daki listede sigorta \u015firketinizi bulun. Listede yoksa bizi aray\u0131n \u2014 genellikle anla\u015fma d\u0131\u015f\u0131 poli\u00e7elerde de yard\u0131mc\u0131 olabiliriz.</p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm mx-auto mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sigorta \u015firketi ara..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayList.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${ins.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ins.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                      {ins.logo}
                    </div>
                    {ins.popular && (
                      <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400" /> Pop\u00fcler
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-slate-900 mb-0.5">{ins.name}</h3>
                  <p className="text-indigo-500 text-xs font-semibold mb-3">{ins.type}</p>

                  {/* Coverage list */}
                  <div className="space-y-1.5 mb-4">
                    {ins.coverage.slice(0, 4).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                    {ins.coverage.length > 4 && (
                      <p className="text-xs text-indigo-500 font-semibold ml-5">+{ins.coverage.length - 4} daha fazla</p>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${ins.lightColor} border mb-3`}>
                    <Percent className="w-3 h-3 flex-shrink-0" />
                    <span className={ins.textColor}>{ins.limits}</span>
                  </div>

                  {ins.note && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-400">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <p>{ins.note}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length > 8 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all"
              >
                {showAll ? (
                  <><ChevronUp className="w-4 h-4" /> Daha az g\u00f6ster</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> T\u00fcm\u00fcn\u00fc g\u00f6ster ({filtered.length})</>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
