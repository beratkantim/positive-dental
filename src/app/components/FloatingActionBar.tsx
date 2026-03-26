import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Phone, Calendar, MapPin, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FloatingActionBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  const actions = [
    { label: "Randevu", icon: Calendar, href: "https://randevu.positivedental.com", isLink: false },
    { label: "WhatsApp", icon: MessageCircle, href: "https://wa.me/905001234567", isLink: false },
    { label: "Yol Tarifi", icon: MapPin, href: "https://maps.google.com/?q=Positive+Dental+Studio", isLink: false },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          {/* ── Mobile ─────────────────────────────────────── */}
          <div className="md:hidden pointer-events-auto">
            <div className="bg-white border-t border-slate-100 shadow-2xl">
              <div className="flex items-stretch">
                {/* Phone CTA */}
                <a href="tel:+908501234567"
                  className="flex flex-col items-center justify-center gap-1 px-5 py-3 bg-gradient-to-b from-indigo-500 to-violet-600 text-white flex-shrink-0">
                  <Phone className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Ara</span>
                </a>

                <div className="flex flex-1 divide-x divide-slate-100">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    const inner = (
                      <div className="flex flex-col items-center justify-center gap-1 py-3 px-2 hover:bg-indigo-50 transition-colors w-full">
                        <Icon className="w-5 h-5 text-slate-600" />
                        <span className="text-[10px] text-slate-500 font-medium">{action.label}</span>
                      </div>
                    );
                    return action.isLink
                      ? <Link key={action.label} to={action.href} className="flex-1">{inner}</Link>
                      : <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer" className="flex-1">{inner}</a>;
                  })}
                </div>

                <button onClick={() => setDismissed(true)}
                  className="px-3 text-slate-300 hover:text-slate-500 transition-colors border-l border-slate-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Desktop ─────────────────────────────────────── */}
          <div className="hidden md:flex justify-center pb-6 pointer-events-auto">
            <div className="flex items-stretch bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100 overflow-hidden">

              {/* Phone */}
              <a href="tel:+908501234567"
                className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white transition-all group">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-100 leading-none">Hemen Ara</p>
                  <p className="font-bold text-sm leading-tight mt-0.5">0850 123 45 67</p>
                </div>
              </a>

              <div className="w-px bg-slate-100" />

              {actions.map((action) => {
                const Icon = action.icon;
                const inner = (
                  <div className="flex flex-col items-center justify-center gap-1.5 px-7 py-3.5 hover:bg-indigo-50 transition-colors group">
                    <Icon className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                    <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium transition-colors">{action.label}</span>
                  </div>
                );
                return action.isLink
                  ? <Link key={action.label} to={action.href}>{inner}</Link>
                  : <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">{inner}</a>;
              })}

              <div className="w-px bg-slate-100" />
              <button onClick={() => setDismissed(true)}
                className="px-4 text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}