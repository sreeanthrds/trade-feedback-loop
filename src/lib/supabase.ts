
import { createClient } from '@supabase/supabase-js';

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
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        getUser: () => Promise.resolve({ data: { user: null } })
      },
      from: () => ({
        select: () => ({
          order: () => ({
            data: [],
            error: null
          }),
          eq: () => ({
            single: () => ({
              data: null,
              error: null
            }),
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        upsert: () => ({
          select: () => ({
            single: () => ({
              data: null,
              error: null
            })
          })
        }),
        delete: () => ({
          eq: () => ({
            error: null
          })
        })
      })
    };
  }
} else {
  // Create a mock client for development so the app doesn't crash
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } })
    },
    from: () => ({
      select: () => ({
        order: () => ({
          data: [],
          error: null
        }),
        eq: () => ({
          single: () => ({
            data: null,
            error: null
          }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      upsert: () => ({
        select: () => ({
          single: () => ({
            data: null,
            error: null
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          error: null
        })
      })
    })
  };
}

export { supabase };

// Strategy-related database operations
export const strategyService = {
  // Fetch all strategies for the current user
  async getStrategies() {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, using local storage only');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching strategies:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getStrategies:', error);
      return [];
    }
  },
  
  // Get a specific strategy by ID
  async getStrategyById(id: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, using local storage only');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching strategy ${id}:`, error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Error in getStrategyById:`, error);
      return null;
    }
  },
  
  // Create or update a strategy
  async saveStrategy(strategy: any) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, using local storage only');
      return null;
    }
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // If no user is logged in, return null
      if (!userData.user) {
        console.warn('No user logged in, cannot save strategy to Supabase');
        return null;
      }
      
      const { data, error } = await supabase
        .from('strategies')
        .upsert({
          id: strategy.id,
          name: strategy.name,
          description: strategy.description || '',
          nodes: strategy.nodes,
          edges: strategy.edges,
          created_at: strategy.created || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userData.user.id // Add user_id to associate with the current user
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving strategy:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in saveStrategy:', error);
      return null;
    }
  },
  
  // Delete a strategy by ID
  async deleteStrategy(id: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, using local storage only');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting strategy ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteStrategy:`, error);
      return false;
    }
  }
};
