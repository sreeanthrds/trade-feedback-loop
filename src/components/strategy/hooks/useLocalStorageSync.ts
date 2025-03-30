
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
  const initTimeoutRef = useRef<number | null>(null);

  // Cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  // Load from localStorage on initial mount with better handling
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      
      try {
        const savedStrategy = loadStrategyFromLocalStorage();
        
        if (savedStrategy && savedStrategy.nodes && savedStrategy.nodes.length > 0) {
          // Validate the saved strategy before loading it
          const isValidStrategy = Array.isArray(savedStrategy.nodes) && 
                                  Array.isArray(savedStrategy.edges);
          
          if (isValidStrategy) {
            console.log('Loading saved strategy from localStorage');
            
            // Set local React Flow state first
            setNodes(savedStrategy.nodes);
            setEdges(savedStrategy.edges);
            
            // Then update the store, but mark that we're doing so to prevent cycles
            isUpdatingStoreRef.current = true;
            
            // Delay the store update slightly to ensure React Flow state is set first
            setTimeout(() => {
              try {
                strategyStore.setNodes(savedStrategy.nodes);
                strategyStore.setEdges(savedStrategy.edges);
                strategyStore.resetHistory();
                strategyStore.addHistoryItem(savedStrategy.nodes, savedStrategy.edges);
              } catch (error) {
                console.error('Error updating strategy store:', error);
              } finally {
                isUpdatingStoreRef.current = false;
              }
            }, 100);
          } else {
            console.warn('Invalid saved strategy found in localStorage, using default nodes');
            initializeWithDefaultNodes();
          }
        } else {
          console.log('No saved strategy found, using default nodes');
          initializeWithDefaultNodes();
        }
      } catch (error) {
        console.error('Error loading strategy from localStorage:', error);
        initializeWithDefaultNodes();
      }
      
      // Set the initial load flag to false after a longer delay
      // to ensure all synchronization operations have completed
      initTimeoutRef.current = window.setTimeout(() => {
        isInitialLoadRef.current = false;
        console.log('Initial load complete');
      }, 1000);
    }
  }, [setNodes, setEdges, strategyStore, initialNodes]);

  // Helper function to initialize with default nodes
  const initializeWithDefaultNodes = () => {
    // Set local state
    setNodes(initialNodes);
    
    // Update store
    isUpdatingStoreRef.current = true;
    setTimeout(() => {
      try {
        strategyStore.setNodes(initialNodes);
        strategyStore.setEdges([]);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
      } catch (error) {
        console.error('Error initializing with default nodes:', error);
      } finally {
        isUpdatingStoreRef.current = false;
      }
    }, 100);
  };

  return { isInitialLoadRef, isUpdatingStoreRef };
}
