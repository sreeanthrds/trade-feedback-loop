
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { loadStrategyFromLocalStorage } from '../../utils/storage/operations/loadStrategy';

interface UseInitialLocalStorageLoadProps {
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  strategyStore: any;
  initialNodes: Node[];
  currentStrategyId: string;
  isInitialLoadRef: React.MutableRefObject<boolean>;
  isUpdatingFromLocalStorageRef: React.MutableRefObject<boolean>;
}

export function useInitialLocalStorageLoad({
  setNodes,
  setEdges,
  strategyStore,
  initialNodes,
  currentStrategyId,
  isInitialLoadRef,
  isUpdatingFromLocalStorageRef
}: UseInitialLocalStorageLoadProps) {
  // Safe setter functions that check if the setters exist
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
        console.log('Loading strategy from localStorage:', 
          `${loadedStrategy.nodes.length} nodes, ${loadedStrategy.edges.length} edges`);
        
        if (loadedStrategy.edges && loadedStrategy.edges.length > 0) {
          console.log('Loaded edges from localStorage:', JSON.stringify(loadedStrategy.edges));
        }
        
        // Clear existing state first to avoid conflicts
        safeSetNodes([]);
        setTimeout(() => {
          safeSetEdges([]);
          
          // Apply nodes first with safety check
          setTimeout(() => {
            console.log(`Setting ${loadedStrategy.nodes.length} nodes from localStorage`);
            safeSetNodes(loadedStrategy.nodes);
            
            // Apply edges in the next cycle to prevent conflicts
            setTimeout(() => {
              console.log(`Setting ${loadedStrategy.edges.length} edges from localStorage:`, 
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
                
                console.log('Strategy loaded from localStorage successfully');
                isInitialLoadRef.current = false;
              }, 200); // Increased timeout
            }, 200); // Increased timeout
          }, 200);
        }, 200);
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
}
