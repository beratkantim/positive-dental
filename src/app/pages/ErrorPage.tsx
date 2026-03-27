import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200">
          <AlertTriangle className="w-9 h-9 text-white" />
        </div>

        <h1 className="font-display text-3xl font-black text-slate-900 mb-3">
          {isNotFound ? "Sayfa Bulunamadı" : "Bir Hata Oluştu"}
        </h1>

        <p className="text-slate-500 mb-8 leading-relaxed">
          {isNotFound
            ? "Aradığınız sayfa mevcut değil. URL'yi kontrol edip tekrar deneyin."
            : "Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün."
          }
        </p>

        {isRouteErrorResponse(error) && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-mono text-slate-400">
              {error.status} — {error.statusText}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <button onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-300 transition-all">
            <RefreshCw className="w-4 h-4" />
            Sayfayı Yenile
          </button>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Sorun devam ederse:{" "}
          <a href="tel:+908501234567" className="text-indigo-500 font-bold hover:underline">0850 123 45 67</a>
        </p>
      </div>
    </div>
  );
}
