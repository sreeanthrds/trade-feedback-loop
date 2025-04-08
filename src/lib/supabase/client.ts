
import { createClient } from '@supabase/supabase-js';
import { createMockClient } from './mock-client';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

// Create a Supabase client or a mock client
let supabase;

try {
  if (isMissingConfig) {
    console.warn('Missing Supabase configuration. Using mock client.');
    supabase = createMockClient();
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = createMockClient();
}

export { supabase };
