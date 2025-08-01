import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./config.ts";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
