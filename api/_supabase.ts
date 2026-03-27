import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_KEY!
);

export const SITE_URL = "https://positivedental.com";

export function xmlHeader() {
  return '<?xml version="1.0" encoding="UTF-8"?>';
}
