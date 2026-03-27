import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// SSR data'yı window'dan oku (varsa)
function getSSRData<T>(table: string): T[] | null {
  try {
    const ssr = (window as any).__SSR_DATA__;
    if (ssr?.data?.[table] && Array.isArray(ssr.data[table])) {
      return ssr.data[table] as T[];
    }
  } catch {
    // SSR context yok
  }
  return null;
}

export function useTable<T>(table: string, orderBy?: string, ascending = true) {
  const [data, setData] = useState<T[]>(() => {
    // İlk render'da SSR verisini kullan (varsa)
    return getSSRData<T>(table) || [];
  });
  const [loading, setLoading] = useState(() => {
    return !getSSRData<T>(table);
  });

  useEffect(() => {
    // SSR verisi zaten varsa tekrar fetch etme
    const ssrData = getSSRData<T>(table);
    if (ssrData) {
      // SSR verisini kullandıktan sonra temizle (SPA navigasyonlarında tekrar fetch edilsin)
      try {
        const ssr = (window as any).__SSR_DATA__;
        if (ssr?.data?.[table]) delete ssr.data[table];
      } catch {}
      return;
    }

    let q = supabase.from(table).select("*");
    if (orderBy) q = q.order(orderBy, { ascending });
    q.then(({ data }) => {
      setData((data as T[]) || []);
      setLoading(false);
    });
  }, [table, orderBy, ascending]);

  return { data, loading };
}
