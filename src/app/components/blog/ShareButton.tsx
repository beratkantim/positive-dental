import { useState } from "react";
import { Facebook, Twitter, Link2 } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-sm font-medium">Paylaş:</span>
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
        className="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank")}
        className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
      >
        <Link2 className="w-3.5 h-3.5" />
        {copied ? "Kopyalandı!" : "Linki kopyala"}
      </button>
    </div>
  );
}
