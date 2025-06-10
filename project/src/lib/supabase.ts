// Supabase configuration with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only initialize Supabase if environment variables are available
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};