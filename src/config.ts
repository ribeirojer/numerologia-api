import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
const env = await load();

// Configuração do cliente Supabase
const supabaseUrl = env.SUPABASE_URL || Deno.env.get("SUPABASE_URL")!;
const supabaseKey = env.SUPABASE_KEY || Deno.env.get("SUPABASE_KEY")!;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not set");
}

export { supabaseKey, supabaseUrl };
