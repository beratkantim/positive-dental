import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Calendar, Phone, ArrowRight, ChevronDown, ChevronUp,
} from "lucide-react";

const BOOKING_URL = "https://randevu.positivedental.com";

const FAQS = [
  {
    q: "Sigorta poli\u00e7emle klini\u011finizde nas\u0131l yararlanabilirim?",
    a: "Randevu al\u0131rken sigorta \u015firketinizi ve poli\u00e7e numaran\u0131z\u0131 belirtin. Klini\u011fimize geldi\u011finizde kimli\u011finiz ve sigorta kart\u0131n\u0131zla i\u015flem kolayca ba\u015flat\u0131l\u0131r. Ek bir \u00f6n onay gerekmez.",
  },
  {
    q: "Poli\u00e7em kapsam\u0131n\u0131 bilmiyorum, siz kontrol edebilir misiniz?",
    a: "Evet. Sigorta \u015firketinizin ad\u0131n\u0131 ve poli\u00e7e numaran\u0131z\u0131 payla\u015fman\u0131z yeterli; hasta koordinat\u00f6r\u00fcm\u00fcz tedavi \u00f6ncesinde poli\u00e7enizin kapsam\u0131n\u0131 sigorta \u015firketiyle do\u011frular.",
  },
  {
    q: "Sigorta katk\u0131 pay\u0131 nas\u0131l hesaplan\u0131yor?",
    a: "Katk\u0131 pay\u0131 sigorta \u015firketi ve poli\u00e7e tipine g\u00f6re de\u011fi\u015fir. Genel olarak tedavi bedelinin %20\u2013%30'u hasta taraf\u0131ndan kar\u015f\u0131lan\u0131r; kalan k\u0131s\u0131m sigorta \u015firketiyle direkt olarak faturaland\u0131r\u0131l\u0131r.",
  },
  {
    q: "Sigorta kapsam\u0131 d\u0131\u015f\u0131nda kalan i\u015flemler i\u00e7in ne olur?",
    a: "Kapsam\u0131 a\u015fan tedaviler (\u00f6rn. estetik uygulamalar) i\u00e7in klini\u011fimizin standart fiyat listesi uygulan\u0131r. Diledi\u011finiz takdirde taksit se\u00e7ene\u011finden yararlanabilirsiniz.",
  },
  {
    q: "Tamamlay\u0131c\u0131 sa\u011fl\u0131k sigortam da ge\u00e7erli mi?",
    a: "Evet. SGK'n\u0131n \u00f6dedi\u011fi tutar d\u00fc\u015f\u00fcld\u00fckten sonra kalan k\u0131s\u0131m i\u00e7in tamamlay\u0131c\u0131 sa\u011fl\u0131k sigortan\u0131z devreye girer. Her iki kurumu da ayr\u0131 ayr\u0131 haber verin.",
  },
  {
    q: "\u015eirketim \u00fczerinden sigorta yapt\u0131rd\u0131m, nas\u0131l ba\u015fvuraca\u011f\u0131m?",
    a: "Kurumsal poli\u00e7elerde insan kaynaklar\u0131 departman\u0131n\u0131zdan sigorta kart\u0131 veya kapsam yaz\u0131s\u0131 alarak klini\u011fimize gelebilirsiniz.",
  },
];

const STEPS = [
  { n: "01", icon: "\ud83d\udccb", title: "Poli\u00e7enizi Kontrol Edin",   desc: "Sigorta \u015firketinizin listede olup olmad\u0131\u011f\u0131n\u0131 kontrol edin." },
  { n: "02", icon: "\ud83d\udcc5", title: "Randevu Al\u0131n",               desc: "Sigorta bilginizi belirterek online ya da telefonla randevu al\u0131n." },
  { n: "03", icon: "\ud83e\udea8", title: "Klini\u011fe Gelin",              desc: "Kimlik ve sigorta kart\u0131n\u0131z\u0131 getirin; gerisini biz hallederiz." },
  { n: "04", icon: "\u2705", title: "Tedavinizi Al\u0131n",             desc: "Kapsam dahilindeki tedaviniz sigorta \u00fczerinden tamamlan\u0131r." },
];

export function InsuranceFAQ({
  openFaq,
  setOpenFaq,
}: {
  openFaq: number | null;
  setOpenFaq: (v: number | null) => void;
}) {
  return (
    <>
      {/* Process steps */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50 border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Nas\u0131l \u0130\u015fler?</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
              Sigortayla tedavi,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">bu kadar kolay.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-indigo-200">
                  {step.icon}
                </div>
                <div className="absolute top-6 right-6 font-display font-black text-indigo-100 text-3xl leading-none">{step.n}</div>
                <h3 className="font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">SSS</span>
            <h2 className="font-display text-4xl font-black text-slate-900">
              S\u0131k sorulan{" "}
              <span className="italic bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">sorular.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-indigo-50/40 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-800 pr-4 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0B5FBF] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
        >
          <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-5" />
          <h2 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
            Sigortan\u0131zla hemen
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">randevu al\u0131n.</span>
          </h2>
          <p className="text-slate-400 mb-8">Poli\u00e7eniz varsa ekstra \u00f6deme yapmadan tedavinizi ba\u015flat\u0131n.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all">
              <Calendar className="w-5 h-5" /> Randevu Al <ArrowRight className="w-5 h-5" />
            </a>
            <a href="tel:+908501234567"
              className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/12 hover:bg-white/12 text-white font-bold px-8 py-4 rounded-2xl transition-all">
              <Phone className="w-5 h-5 text-slate-400" /> 0850 123 45 67
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-6">Poli\u00e7enizi bilmiyorum demeyin \u2014 klini\u011fimiz size yard\u0131mc\u0131 olur.</p>
        </motion.div>
      </section>
    </>
  );
}
