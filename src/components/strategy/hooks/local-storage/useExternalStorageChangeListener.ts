
import { useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { loadStrategyFromLocalStorage } from '../../utils/storage/operations/loadStrategy';

interface UseExternalStorageChangeListenerProps {
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  strategyStore: any;
  currentStrategyIdRef: React.MutableRefObject<string>;
  isUpdatingFromLocalStorageRef: React.MutableRefObject<boolean>;
}

export function useExternalStorageChangeListener({
  setNodes,
  setEdges,
  strategyStore,
  currentStrategyIdRef,
  isUpdatingFromLocalStorageRef
}: UseExternalStorageChangeListenerProps) {
  // Safe setter functions
  const safeSetNodes = (nodes: Node[] | ((prev: Node[]) => Node[])) => {
    if (typeof setNodes === 'function') {
      try {
        setNodes(nodes);
      } catch (error) {
        console.error('Error in safeSetNodes:', error);
      }
    } else {
      console.warn('setNodes is not a function');
    }
  };
  
  const safeSetEdges = (edges: Edge[] | ((prev: Edge[]) => Edge[])) => {
    if (typeof setEdges === 'function') {
      try {
        setEdges(edges);
        console.log('Edges set successfully via safeSetEdges:', 
          typeof edges === 'function' ? 'function' : edges.length);
      } catch (error) {
        console.error('Error in safeSetEdges:', error);
      }
    } else {
      console.warn('setEdges is not a function');
    }
  };

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
              console.log(`Found ${loadedStrategy.nodes.length} nodes and ${loadedStrategy.edges.length} edges`);
              
              if (loadedStrategy.edges && loadedStrategy.edges.length > 0) {
                console.log('Edges from storage event:', JSON.stringify(loadedStrategy.edges));
              }
              
              // Clear existing state first
              safeSetNodes([]);
              setTimeout(() => {
                safeSetEdges([]);
                
                // Then apply the new state with sufficient delays
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
                      }, 300);
                    }, 300);
                  }, 300);
                }, 300);
              }, 300);
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
  }, [safeSetNodes, safeSetEdges, strategyStore, currentStrategyIdRef]);
}
