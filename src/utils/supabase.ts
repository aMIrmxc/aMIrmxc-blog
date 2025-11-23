import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

console.log('supabaseUrl exists:', !!supabaseUrl, 'supabaseKey exists:', !!supabaseKey);


export const supabase = createClient(supabaseUrl, supabaseKey);