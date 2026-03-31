export function StepHeader({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-black text-indigo-500 tracking-widest uppercase">Adım {step}/5</span>
      <h3 className="font-display text-xl font-black text-slate-900 mt-1">{title}</h3>
      <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
    </div>
  );
}
