import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  '';

const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_PUBLISHABLE_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Server-side admin client with @supabase/server
export function getAdminClient() {
  if (typeof window !== 'undefined') {
    return supabase;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createAdminClient } = require('@supabase/server/core');
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && secretKey) {
      return createAdminClient({
        url: supabaseUrl,
        secretKey,
      });
    }
  } catch (err) {
    console.warn('getAdminClient fallback to client instance:', err);
  }
  return supabase;
}
