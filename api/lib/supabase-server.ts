import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const key = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY || "";

export const supabaseServer = createClient(url, key);
