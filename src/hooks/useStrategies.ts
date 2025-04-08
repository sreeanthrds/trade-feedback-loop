
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getStrategiesList, deleteStrategy } from '@/components/strategy/utils/storage/localStorageUtils';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  created: string;
  returns?: number;
}

export const useStrategies = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load strategies from localStorage
  const loadStrategies = () => {
    setIsLoading(true);
    try {
      const savedStrategies = getStrategiesList();
      console.log("Loaded strategies:", savedStrategies);
      
      // Format dates for display
      const formattedStrategies = savedStrategies.map((strategy: any) => ({
        ...strategy,
        lastModified: strategy.lastModified 
          ? format(new Date(strategy.lastModified), 'MMM d, yyyy')
          : format(new Date(), 'MMM d, yyyy'),
        created: strategy.created
          ? format(new Date(strategy.created), 'MMM d, yyyy')
          : format(new Date(), 'MMM d, yyyy')
      }));
      
      setStrategies(formattedStrategies);
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast({
        title: "Error loading strategies",
        description: "There was a problem loading your strategies.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStrategies();
    
    // Set up an event listener to reload strategies when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'strategies' || e.key?.startsWith('strategy_')) {
        loadStrategies();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteStrategy = (id: string) => {
    const success = deleteStrategy(id);
    if (success) {
      setStrategies(prevStrategies => prevStrategies.filter(strategy => strategy.id !== id));
    }
    return success;
  };

  const refreshStrategies = () => {
    loadStrategies();
    toast({
      title: "Strategies refreshed",
      description: "Your strategies list has been refreshed"
    });
  };

  return {
    strategies,
    isLoading,
    refreshStrategies,
    deleteStrategy: handleDeleteStrategy
  };
};
