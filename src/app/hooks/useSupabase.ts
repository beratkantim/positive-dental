import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useTable<T>(table: string, orderBy?: string, ascending = true) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from(table).select("*");
    if (orderBy) q = q.order(orderBy, { ascending });
    q.then(({ data }) => {
      setData((data as T[]) || []);
      setLoading(false);
    });
  }, [table, orderBy, ascending]);

  return { data, loading };
}
