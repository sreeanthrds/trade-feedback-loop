
import { useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
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
  // Initial load from localStorage
  useEffect(() => {
    if (isInitialLoadRef.current && currentStrategyId) {
      console.log(`Initial load for strategy: ${currentStrategyId}`);
      
      try {
        isUpdatingFromLocalStorageRef.current = true;
        
        // Load strategy from localStorage
        const loadedStrategy = loadStrategyFromLocalStorage(currentStrategyId);
        
        if (loadedStrategy && loadedStrategy.nodes && loadedStrategy.nodes.length > 0) {
          // Set the loaded nodes and edges
          setNodes(loadedStrategy.nodes);
          setEdges(loadedStrategy.edges || []);
          
          // Update store
          strategyStore.setNodes(loadedStrategy.nodes);
          strategyStore.setEdges(loadedStrategy.edges || []);
          
          // Reset history and add initial state
          strategyStore.resetHistory();
          strategyStore.addHistoryItem(loadedStrategy.nodes, loadedStrategy.edges || []);
          
          console.log(`Loaded strategy from localStorage: ${loadedStrategy.nodes.length} nodes, ${loadedStrategy.edges?.length || 0} edges`);
        } else {
          // If no nodes were loaded, use initial nodes
          setNodes(initialNodes);
          setEdges([]);
          
          // Update store
          strategyStore.setNodes(initialNodes);
          strategyStore.setEdges([]);
          
          // Reset history and add initial state
          strategyStore.resetHistory();
          strategyStore.addHistoryItem(initialNodes, []);
          
          console.log('No nodes found in localStorage, using initial nodes');
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        
        // Fallback to initial nodes
        setNodes(initialNodes);
        setEdges([]);
      } finally {
        // Reset flags
        isInitialLoadRef.current = false;
        
        // Reset updating flag after a delay
        setTimeout(() => {
          isUpdatingFromLocalStorageRef.current = false;
        }, 200);
      }
    }
  }, [
    setNodes, 
    setEdges, 
    strategyStore, 
    initialNodes, 
    currentStrategyId, 
    isInitialLoadRef, 
    isUpdatingFromLocalStorageRef
  ]);
}
