
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Strategy-related database operations
export const strategyService = {
  // Fetch all strategies for the current user
  async getStrategies() {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching strategies:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get a specific strategy by ID
  async getStrategyById(id: string) {
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
  },
  
  // Create or update a strategy
  async saveStrategy(strategy: any) {
    const { data: userData } = await supabase.auth.getUser();
    
    // If no user is logged in, return null
    if (!userData.user) {
      console.error('No user logged in, cannot save strategy');
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
  },
  
  // Delete a strategy by ID
  async deleteStrategy(id: string) {
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting strategy ${id}:`, error);
      return false;
    }
    
    return true;
  }
};
