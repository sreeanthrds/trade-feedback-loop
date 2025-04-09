
import { useEffect, useRef, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { loadStrategyFromLocalStorage } from '../utils/storage/operations/loadStrategy';

interface UseLocalStorageSyncProps {
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  strategyStore: any;
  initialNodes: Node[];
  currentStrategyId: string;
}

export function useLocalStorageSync({
  setNodes,
  setEdges,
  strategyStore,
  initialNodes,
  currentStrategyId
}: UseLocalStorageSyncProps) {
  const isInitialLoadRef = useRef(true);
  const isUpdatingFromLocalStorageRef = useRef(false);
  const currentStrategyIdRef = useRef(currentStrategyId);
  
  // Update the ref when the strategy ID changes
  useEffect(() => {
    currentStrategyIdRef.current = currentStrategyId;
  }, [currentStrategyId]);
  
  // Safe setter functions that check if the setters exist
  const safeSetNodes = useCallback((nodes: Node[] | ((prev: Node[]) => Node[])) => {
    if (typeof setNodes === 'function') {
      try {
        setNodes(nodes);
      } catch (error) {
        console.error('Error in safeSetNodes:', error);
      }
    } else {
      console.warn('setNodes is not a function');
    }
  }, [setNodes]);
  
  const safeSetEdges = useCallback((edges: Edge[] | ((prev: Edge[]) => Edge[])) => {
    if (typeof setEdges === 'function') {
      try {
        setEdges(edges);
      } catch (error) {
        console.error('Error in safeSetEdges:', error);
      }
    } else {
      console.warn('setEdges is not a function');
    }
  }, [setEdges]);
  
  // Initial load from localStorage
  useEffect(() => {
    if (!isInitialLoadRef.current || isUpdatingFromLocalStorageRef.current || !currentStrategyId) {
      return; // Prevent duplicate loading
    }
    
    try {
      isUpdatingFromLocalStorageRef.current = true;
      
      // Try to load the specific strategy by ID
      console.log(`Initial load for strategy: ${currentStrategyId}`);
      const loadedStrategy = loadStrategyFromLocalStorage(currentStrategyId);
      
      if (loadedStrategy) {
        console.log('Loading strategy from localStorage:', loadedStrategy);
        
        // Apply nodes first with safety check
        safeSetNodes(loadedStrategy.nodes);
        
        // Apply edges in the next cycle to prevent conflicts
        setTimeout(() => {
          safeSetEdges(loadedStrategy.edges);
          
          // Update store in a separate cycle
          setTimeout(() => {
            if (strategyStore && typeof strategyStore.setNodes === 'function') {
              strategyStore.setNodes(loadedStrategy.nodes);
              strategyStore.setEdges(loadedStrategy.edges);
              
              if (typeof strategyStore.resetHistory === 'function') {
                strategyStore.resetHistory();
              }
              
              if (typeof strategyStore.addHistoryItem === 'function') {
                strategyStore.addHistoryItem(loadedStrategy.nodes, loadedStrategy.edges);
              }
            }
            
            console.log('Strategy loaded from localStorage successfully');
            isInitialLoadRef.current = false;
          }, 0);
        }, 0);
      } else {
        console.log('No saved strategy found, using default nodes');
        safeSetNodes(initialNodes);
        isInitialLoadRef.current = false;
      }
    } catch (error) {
      console.error('Error loading strategy from localStorage:', error);
      safeSetNodes(initialNodes);
      isInitialLoadRef.current = false;
      
      toast({
        title: "Error loading strategy",
        description: "Could not load your saved strategy. Starting with a new one.",
        variant: "destructive"
      });
    } finally {
      // Reset flag after a small delay
      setTimeout(() => {
        isUpdatingFromLocalStorageRef.current = false;
      }, 500);
    }
  }, [safeSetNodes, safeSetEdges, strategyStore, initialNodes, currentStrategyId]);

  // Listen for external changes to localStorage (from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to changes for the current strategy
      const strategyKey = `strategy_${currentStrategyIdRef.current}`;
      
      if (e.key === strategyKey && e.newValue) {
        try {
          // Prevent update loops by using a ref flag
          if (!isUpdatingFromLocalStorageRef.current) {
            isUpdatingFromLocalStorageRef.current = true;
            
            console.log(`Storage event detected for current strategy: ${strategyKey}`);
            const parsed = JSON.parse(e.newValue);
            
            if (parsed.nodes && parsed.edges) {
              safeSetNodes(parsed.nodes);
              safeSetEdges(parsed.edges);
              
              // Update store in a separate cycle
              setTimeout(() => {
                if (strategyStore && typeof strategyStore.setNodes === 'function') {
                  strategyStore.setNodes(parsed.nodes);
                  strategyStore.setEdges(parsed.edges);
                  
                  if (typeof strategyStore.resetHistory === 'function') {
                    strategyStore.resetHistory();
                  }
                  
                  if (typeof strategyStore.addHistoryItem === 'function') {
                    strategyStore.addHistoryItem(parsed.nodes, parsed.edges);
                  }
                }
                
                // Reset flag after applying changes
                setTimeout(() => {
                  isUpdatingFromLocalStorageRef.current = false;
                }, 100);
              }, 100);
            }
          }
        } catch (error) {
          console.error('Error handling storage event:', error);
          isUpdatingFromLocalStorageRef.current = false;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [safeSetNodes, safeSetEdges, strategyStore]);

  return { isInitialLoadRef };
}
