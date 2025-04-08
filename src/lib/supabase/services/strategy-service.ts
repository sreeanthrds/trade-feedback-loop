
import { supabase } from '../client';
import { isSupabaseConfigured, warnIfSupabaseNotConfigured } from '../utils/environment';
import { logDatabaseError } from '../utils/error-handling';

/**
 * Fetch all strategies for the current user
 */
const getStrategies = async () => {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured();
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      logDatabaseError('getStrategies', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    logDatabaseError('getStrategies', error);
    return [];
  }
};

/**
 * Get a specific strategy by ID
 */
const getStrategyById = async (id: string) => {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured();
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      logDatabaseError(`getStrategyById (${id})`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    logDatabaseError('getStrategyById', error);
    return null;
  }
};

/**
 * Get the current user's ID
 */
const getCurrentUserId = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    return userData.user?.id || null;
  } catch (error) {
    logDatabaseError('getCurrentUserId', error);
    return null;
  }
};

/**
 * Create or update a strategy
 */
const saveStrategy = async (strategy: any) => {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured();
    return null;
  }
  
  try {
    const userId = await getCurrentUserId();
    
    // If no user is logged in, return null
    if (!userId) {
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
        user_id: userId // Add user_id to associate with the current user
      })
      .select()
      .single();
    
    if (error) {
      logDatabaseError('saveStrategy', error);
      return null;
    }
    
    return data;
  } catch (error) {
    logDatabaseError('saveStrategy', error);
    return null;
  }
};

/**
 * Delete a strategy by ID
 */
const deleteStrategy = async (id: string) => {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured();
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);
    
    if (error) {
      logDatabaseError(`deleteStrategy (${id})`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    logDatabaseError('deleteStrategy', error);
    return false;
  }
};

// Export the strategy service methods
export const strategyService = {
  getStrategies,
  getStrategyById,
  saveStrategy,
  deleteStrategy
};
