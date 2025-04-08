
import { createClient } from '@supabase/supabase-js';
import { createMockClient } from './mock-client';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.warn('Missing VITE_SUPABASE_URL environment variable. Using mock client.');
}

if (!supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_ANON_KEY environment variable. Using mock client.');
}

// Create a "safe" version of Supabase client that doesn't throw in development
let supabase;

// Only attempt to create the client if both URL and key are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Create a mock client for development so the app doesn't crash
    supabase = createMockClient();
  }
} else {
  // Create a mock client for development so the app doesn't crash
  supabase = createMockClient();
}

export { supabase };
