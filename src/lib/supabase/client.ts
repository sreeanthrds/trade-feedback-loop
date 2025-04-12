
import { createClient } from '@supabase/supabase-js';
import { createMockClient } from './mock-client';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncltyhihoodbfljduuvp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isMissingConfig = !supabaseAnonKey;

// Create a Supabase client or a mock client
let supabase;

try {
  if (isMissingConfig) {
    // Show a more helpful warning message
    console.warn(
      'Missing Supabase configuration. Using mock authentication. ' +
      'To use real Google authentication, please create a .env file in the project root with VITE_SUPABASE_ANON_KEY.'
    );
    
    // Create mock client but modify behavior to make it more usable in dev
    supabase = createMockClient(true); // Pass true to enable dev-friendly mock mode
    
    // Add visual toast notification about missing config
    setTimeout(() => {
      toast({
        title: "Missing Supabase Configuration",
        description: "Create a .env file with VITE_SUPABASE_ANON_KEY to use real Google authentication.",
        variant: "destructive",
        duration: 6000,
      });
    }, 1000);
  } else {
    // Using real Supabase client with provided credentials
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    console.log('Supabase client initialized successfully with URL:', supabaseUrl);
    
    // Add success toast notification
    setTimeout(() => {
      toast({
        title: "Supabase Connected",
        description: "Using real authentication with Google OAuth.",
        duration: 4000,
      });
    }, 1000);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = createMockClient(true);
  
  // Add error toast notification
  setTimeout(() => {
    toast({
      title: "Supabase Error",
      description: "Failed to initialize Supabase. Using mock authentication.",
      variant: "destructive",
      duration: 5000,
    });
  }, 1000);
}

export { supabase };
