import { useState, useEffect } from "react";

export function usePagination<T>(items: T[], perPage = 50) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safeP = Math.min(page, totalPages);
  const paged = items.slice((safeP - 1) * perPage, safeP * perPage);
  useEffect(() => { if (page > totalPages) setPage(1); }, [items.length]);
  return { page: safeP, setPage, totalPages, paged, total: items.length, perPage };
}

export function Pagination({ page, totalPages, setPage, total, perPage }: {
  page: number; totalPages: number; setPage: (p: number) => void; total: number; perPage: number;
}) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages: number[] = [];
  const lo = Math.max(1, page - 2);
  const hi = Math.min(totalPages, page + 2);
  for (let i = lo; i <= hi; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        {start}–{end} / <strong>{total}</strong> kayıt
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => setPage(1)} disabled={page === 1}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          «
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          ‹ Önceki
        </button>
        {lo > 1 && <span className="text-xs text-gray-400">…</span>}
        {pages.map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-8 h-8 text-xs font-bold rounded-lg transition ${p === page ? "bg-indigo-500 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
            {p}
          </button>
        ))}
        {hi < totalPages && <span className="text-xs text-gray-400">…</span>}
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          Sonraki ›
        </button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
          className="px-2 py-1 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition">
          »
        </button>
      </div>
    </div>
  );
}
