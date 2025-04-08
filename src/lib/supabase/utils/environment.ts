
/**
 * Utility functions for environment-related checks
 */

/**
 * Check if Supabase is properly configured with required environment variables
 */
export const isSupabaseConfigured = (): boolean => {
  const hasConfig = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  return hasConfig;
};

/**
 * Log a warning if Supabase is not configured
 */
export const warnIfSupabaseNotConfigured = (): void => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using local storage only');
  }
};
