
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
  const syncTimeoutRef = useRef<number | null>(null);

  // Cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
      }
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Load from localStorage on initial mount with better handling
  useEffect(() => {
    // Only run once
    if (hasInitializedRef.current) {
      return;
    }
    
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
          
          // Use a longer delay for store updates to ensure React Flow state is set first
          if (syncTimeoutRef.current !== null) {
            window.clearTimeout(syncTimeoutRef.current);
          }
          
          syncTimeoutRef.current = window.setTimeout(() => {
            try {
              strategyStore.setNodes(savedStrategy.nodes);
              strategyStore.setEdges(savedStrategy.edges);
              strategyStore.resetHistory();
              strategyStore.addHistoryItem(savedStrategy.nodes, savedStrategy.edges);
            } catch (error) {
              console.error('Error updating strategy store:', error);
            } finally {
              isUpdatingStoreRef.current = false;
              syncTimeoutRef.current = null;
            }
          }, 250); // Longer delay to ensure Flow state is set
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
    }, 1500); // Extended delay for full initialization
  }, []);

  // Helper function to initialize with default nodes
  const initializeWithDefaultNodes = () => {
    // Set local state
    setNodes(initialNodes);
    
    // Update store with a delay
    isUpdatingStoreRef.current = true;
    
    if (syncTimeoutRef.current !== null) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = window.setTimeout(() => {
      try {
        strategyStore.setNodes(initialNodes);
        strategyStore.setEdges([]);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
      } catch (error) {
        console.error('Error initializing with default nodes:', error);
      } finally {
        isUpdatingStoreRef.current = false;
        syncTimeoutRef.current = null;
      }
    }, 250);
  };

  return { isInitialLoadRef, isUpdatingStoreRef };
}
