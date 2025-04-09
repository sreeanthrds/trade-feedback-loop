
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StrategyFlow from '@/components/strategy/StrategyFlow';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saveStrategyToLocalStorage } from '@/components/strategy/utils/storage/localStorageUtils';
import { useStrategyStore } from '@/hooks/use-strategy-store';

const LoadingPlaceholder = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="flex flex-col items-center">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">Loading Strategy Builder...</p>
    </div>
  </div>
);

const StrategyBuilder = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchParams] = useSearchParams();
  const strategyId = searchParams.get('id') || `strategy-${Date.now()}`;
  const strategyName = searchParams.get('name') || 'Untitled Strategy';
  const isNewStrategy = !searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { nodes, edges, resetNodes } = useStrategyStore();
  
  // Clear store and localStorage if this is a new strategy
  useEffect(() => {
    if (isNewStrategy) {
      console.log('New strategy detected - preparing clean workspace');
      
      // Complete reset of store
      setTimeout(() => {
        try {
          // Reset the store's nodes
          resetNodes();
          
          // For new strategies, no need to clear any existing localStorage
          // as we'll be using a new, unique strategy ID
          
          console.log('Created new strategy workspace');
        } catch (error) {
          console.error('Error resetting strategy:', error);
        }
      }, 0);
    } else {
      console.log(`Loading existing strategy: ${strategyId}`);
    }
  }, [isNewStrategy, resetNodes, strategyId]);
  
  // Auto-save changes when nodes or edges change
  useEffect(() => {
    if (isLoaded && nodes.length > 0) {
      const autoSaveTimer = setTimeout(() => {
        saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
        console.log(`Auto-saved strategy changes for: ${strategyId}`);
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [nodes, edges, isLoaded, strategyId, strategyName]);
  
  // Set loaded state with delay to ensure components are ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // Increased delay for better component initialization
    
    console.log(`Strategy initialized with ID: ${strategyId}, name: ${strategyName}, isNew: ${isNewStrategy}`);
    
    return () => clearTimeout(timer);
  }, [strategyId, strategyName, isNewStrategy]);

  const handleSave = () => {
    saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
    
    toast({
      title: "Strategy saved",
      description: `"${strategyName}" has been saved`
    });
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'strategies'
    }));
  };

  return (
    <div className="h-[calc(100vh-4px)] w-full relative">
      <div className="absolute top-1 left-16 z-10">
        <Link to="/app">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Strategies
          </Button>
        </Link>
      </div>
      
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-sm font-medium">
          {strategyName}
        </div>
      </div>
      
      <div className="absolute top-1 right-4 z-10 flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
      
      <div className="w-full h-full flex-1 flex flex-col p-0">
        <div className="h-full w-full overflow-hidden rounded-none border-none">
          {isLoaded ? <StrategyFlow isNew={isNewStrategy} /> : <LoadingPlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
