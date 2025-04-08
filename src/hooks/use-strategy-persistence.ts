
import { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { saveStrategy, loadStrategy, deleteStrategy, isAuthenticated } from './strategy-store/supabase-persistence';
import { useToast } from './use-toast';

interface Strategy {
  id: string;
  name: string;
  lastModified: string;
  created: string;
  description?: string;
}

export function useStrategyPersistence() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStrategy, setCurrentStrategy] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();

  // Load strategies list
  const loadStrategiesList = async () => {
    setIsLoading(true);
    try {
      // First check if user is authenticated
      const authenticated = await isAuthenticated();
      
      let strategiesList: Strategy[] = [];
      
      if (authenticated) {
        // If authenticated, load from Supabase
        const cloudStrategies = await strategyService.getStrategies();
        strategiesList = cloudStrategies.map((s: any) => ({
          id: s.id,
          name: s.name,
          lastModified: s.updated_at,
          created: s.created_at,
          description: s.description
        }));
      }
      
      // Also load from local storage
      const localStrategiesJson = localStorage.getItem('strategies');
      if (localStrategiesJson) {
        const localStrategies = JSON.parse(localStrategiesJson);
        
        // Merge strategies, prioritizing cloud versions
        const cloudIds = strategiesList.map(s => s.id);
        const uniqueLocalStrategies = localStrategies.filter(
          (s: Strategy) => !cloudIds.includes(s.id)
        );
        
        strategiesList = [...strategiesList, ...uniqueLocalStrategies];
      }
      
      setStrategies(strategiesList.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      ));
    } catch (error) {
      console.error('Error loading strategies list:', error);
      toast({
        title: "Error loading strategies",
        description: "Could not load your strategies list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save current nodes and edges
  const saveCurrentStrategy = async (
    nodes: Node[],
    edges: Edge[],
    strategyId?: string,
    strategyName?: string
  ) => {
    const id = strategyId || currentStrategy?.id || `strategy-${Date.now()}`;
    const name = strategyName || currentStrategy?.name || "Untitled Strategy";
    
    const success = await saveStrategy(nodes, edges, id, name);
    
    if (success) {
      setCurrentStrategy({ id, name });
      loadStrategiesList(); // Refresh the strategies list
    }
    
    return success;
  };

  // Load a specific strategy
  const loadStrategyById = async (strategyId: string) => {
    setIsLoading(true);
    try {
      const result = await loadStrategy(strategyId);
      
      if (result) {
        // Find strategy name in list
        const strategy = strategies.find(s => s.id === strategyId);
        setCurrentStrategy({
          id: strategyId,
          name: strategy?.name || result.name || "Untitled Strategy"
        });
        return result;
      } else {
        toast({
          title: "Strategy not found",
          description: "Could not load the requested strategy.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error loading strategy:', error);
      toast({
        title: "Error loading strategy",
        description: "Could not load the requested strategy.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a strategy
  const removeStrategy = async (strategyId: string) => {
    try {
      const success = await deleteStrategy(strategyId);
      
      if (success) {
        // Update local state
        setStrategies(prev => prev.filter(s => s.id !== strategyId));
        
        // If current strategy was deleted, clear it
        if (currentStrategy?.id === strategyId) {
          setCurrentStrategy(null);
        }
        
        toast({
          title: "Strategy deleted",
          description: "Your strategy has been removed."
        });
        
        return true;
      } else {
        toast({
          title: "Error deleting strategy",
          description: "Could not delete the strategy.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast({
        title: "Error deleting strategy",
        description: "Could not delete the strategy.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Load strategies on mount
  useEffect(() => {
    loadStrategiesList();
  }, []);

  return {
    strategies,
    isLoading,
    currentStrategy,
    loadStrategiesList,
    saveCurrentStrategy,
    loadStrategyById,
    removeStrategy,
    setCurrentStrategy
  };
}
