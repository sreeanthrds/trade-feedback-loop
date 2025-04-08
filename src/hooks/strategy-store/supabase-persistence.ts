
import { strategyService } from '@/lib/supabase';
import { Node, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { saveStrategyToLocalStorage } from '@/components/strategy/utils/storage/localStorageUtils';

// Check if user is authenticated with Supabase
export const isAuthenticated = async () => {
  try {
    const { data } = await strategyService.supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Save strategy to appropriate storage
export const saveStrategy = async (
  nodes: Node[],
  edges: Edge[],
  strategyId: string,
  strategyName: string
) => {
  try {
    // First check if user is authenticated
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
      // If authenticated, save to Supabase
      const result = await strategyService.saveStrategy({
        id: strategyId,
        name: strategyName,
        nodes,
        edges,
        updated_at: new Date().toISOString()
      });
      
      if (result) {
        toast({
          title: "Strategy saved to cloud",
          description: `"${strategyName}" has been saved to your account.`
        });
        return true;
      } else {
        // Fallback to local storage if Supabase save fails
        saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
        toast({
          title: "Strategy saved locally",
          description: `"${strategyName}" has been saved to your device (cloud save failed).`
        });
        return true;
      }
    } else {
      // Not authenticated, save to local storage
      saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
      return true;
    }
  } catch (error) {
    console.error('Error saving strategy:', error);
    
    // Attempt local storage as fallback
    try {
      saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
      toast({
        title: "Strategy saved locally",
        description: `"${strategyName}" has been saved to your device.`,
        variant: "default"
      });
      return true;
    } catch (fallbackError) {
      console.error('Fallback save failed:', fallbackError);
      toast({
        title: "Failed to save strategy",
        description: "Could not save your strategy. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }
};

// Load strategy from appropriate storage
export const loadStrategy = async (strategyId: string) => {
  try {
    // First check if user is authenticated
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
      // If authenticated, try to load from Supabase first
      const strategy = await strategyService.getStrategyById(strategyId);
      
      if (strategy) {
        return {
          nodes: strategy.nodes,
          edges: strategy.edges,
          name: strategy.name
        };
      }
    }
    
    // Fallback to local storage (or if not authenticated)
    // This uses the existing local storage utility
    const localData = localStorage.getItem(`strategy_${strategyId}`);
    if (localData) {
      const parsedData = JSON.parse(localData);
      return {
        nodes: parsedData.nodes,
        edges: parsedData.edges,
        name: parsedData.name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading strategy:', error);
    return null;
  }
};

// Delete strategy from appropriate storage
export const deleteStrategy = async (strategyId: string) => {
  try {
    // First check if user is authenticated
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
      // If authenticated, delete from Supabase
      await strategyService.deleteStrategy(strategyId);
    }
    
    // Also delete from local storage (regardless of authentication)
    localStorage.removeItem(`strategy_${strategyId}`);
    
    // Remove from strategies list if present
    const strategiesList = localStorage.getItem('strategies');
    if (strategiesList) {
      const strategies = JSON.parse(strategiesList);
      const updatedStrategies = strategies.filter((s: any) => s.id !== strategyId);
      localStorage.setItem('strategies', JSON.stringify(updatedStrategies));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting strategy:', error);
    return false;
  }
};
