import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || ""
);

export const SITE_URL = "https://positive-dental.vercel.app";
