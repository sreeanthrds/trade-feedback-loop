
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
    if (currentStrategyId !== currentStrategyIdRef.current) {
      console.log(`Strategy ID changed from ${currentStrategyIdRef.current} to ${currentStrategyId}`);
      isInitialLoadRef.current = true; // Reset to trigger loading the new strategy
      currentStrategyIdRef.current = currentStrategyId;
    }
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
          console.log(`Setting ${loadedStrategy.edges.length} edges:`, JSON.stringify(loadedStrategy.edges));
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
          }, 100); // Increased timeout
        }, 100); // Increased timeout
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

  // Listen for external changes to localStorage (from another tab or from import)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to changes for the current strategy
      const strategyKey = `strategy_${currentStrategyIdRef.current}`;
      
      if (e.key === strategyKey && e.newValue) {
        try {
          // Prevent update loops by using a ref flag
          if (!isUpdatingFromLocalStorageRef.current) {
            console.log(`Storage event detected for strategy: ${strategyKey}`);
            isUpdatingFromLocalStorageRef.current = true;
            
            // Load the updated strategy
            const loadedStrategy = loadStrategyFromLocalStorage(currentStrategyIdRef.current);
            
            if (loadedStrategy) {
              console.log('Reloading strategy from localStorage after external change');
              
              // Clear existing state first
              safeSetNodes([]);
              setTimeout(() => {
                safeSetEdges([]);
                
                // Then apply the new state
                setTimeout(() => {
                  console.log(`Setting ${loadedStrategy.nodes.length} nodes from storage event`);
                  safeSetNodes(loadedStrategy.nodes);
                  
                  setTimeout(() => {
                    console.log(`Setting ${loadedStrategy.edges.length} edges from storage event:`, 
                               JSON.stringify(loadedStrategy.edges));
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
                      
                      // Reset flag after applying changes
                      setTimeout(() => {
                        isUpdatingFromLocalStorageRef.current = false;
                      }, 100);
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);
            } else {
              isUpdatingFromLocalStorageRef.current = false;
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
