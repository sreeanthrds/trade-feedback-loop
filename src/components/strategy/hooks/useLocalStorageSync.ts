
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { loadStrategyFromLocalStorage } from '../utils/flowUtils';

/**
 * Hook to handle synchronizing state with localStorage
 */
export function useLocalStorageSync(
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  initialNodes: Node[]
) {
  const isInitialLoadRef = useRef(true);

  // Initial load from localStorage - only run once
  useEffect(() => {
    if (isInitialLoadRef.current) {
      const savedStrategy = loadStrategyFromLocalStorage();
      if (savedStrategy) {
        setNodes(savedStrategy.nodes);
        setEdges(savedStrategy.edges);
        strategyStore.setNodes(savedStrategy.nodes);
        strategyStore.setEdges(savedStrategy.edges);
        strategyStore.addHistoryItem(savedStrategy.nodes, savedStrategy.edges);
      } else {
        strategyStore.setNodes(initialNodes);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
      }
      isInitialLoadRef.current = false;
    }
  }, [setNodes, setEdges, strategyStore, initialNodes]);

  return { 
    isInitialLoadRef
  };
}
