import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function logAction(action: string, tableName: string, recordId = "", details = "") {
  const { data: session } = await supabase.auth.getSession();
  const email = session?.session?.user?.email || "unknown";
  await supabase.from("audit_logs").insert({
    user_email: email,
    action,
    table_name: tableName,
    record_id: recordId,
    details: details.slice(0, 500),
  }).then(() => {}); // fire and forget
}
