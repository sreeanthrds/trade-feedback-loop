
import React, { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { loadStrategyFromLocalStorage } from '../utils/flowUtils';

/**
 * Hook to synchronize with localStorage on initial load
 */
export function useLocalStorageSync(
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  initialNodes: Node[]
) {
  const isInitialLoadRef = useRef(true);
  const hasInitializedRef = useRef(false);
  const isUpdatingStoreRef = useRef(false);

  // Load from localStorage on initial mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      
      const savedStrategy = loadStrategyFromLocalStorage();
      if (savedStrategy) {
        // Load saved strategy
        setNodes(savedStrategy.nodes);
        setEdges(savedStrategy.edges);
        
        // Update the store directly to avoid potential cycles
        isUpdatingStoreRef.current = true;
        strategyStore.setNodes(savedStrategy.nodes);
        strategyStore.setEdges(savedStrategy.edges);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(savedStrategy.nodes, savedStrategy.edges);
        isUpdatingStoreRef.current = false;
      } else {
        // Initialize with default nodes if no saved strategy exists
        setNodes(initialNodes);
        
        isUpdatingStoreRef.current = true;
        strategyStore.setNodes(initialNodes);
        strategyStore.setEdges([]);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
        isUpdatingStoreRef.current = false;
      }
      
      // Set the initial load flag to false after a short delay
      // to allow the store to synchronize
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 800); // Increased delay to ensure all operations complete
    }
  }, [setNodes, setEdges, strategyStore, initialNodes]);

  return { isInitialLoadRef, isUpdatingStoreRef };
}
