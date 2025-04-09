
import { createClient } from '@supabase/supabase-js';
import { createMockClient } from './mock-client';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

// Create a Supabase client or a mock client
let supabase;

try {
  if (isMissingConfig) {
    // Show a more helpful warning message
    console.warn(
      'Missing Supabase configuration. This app is running in development mode with mock authentication. ' +
      'To use real authentication, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
    
    // Create mock client but modify behavior to make it more usable in dev
    supabase = createMockClient(true); // Pass true to enable dev-friendly mock mode
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = createMockClient(true);
}

export { supabase };
