
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase Config Check:', {
  hasUrl: !!supabaseUrl,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 8) : 'N/A',
  hasKey: !!supabaseKey
});

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables');
}

// Fallback to placeholder to prevent build crash if env vars are missing
// The check logs above will still show false if they are missing
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseKey || "placeholder";

export const supabase = createClient(url, key);
