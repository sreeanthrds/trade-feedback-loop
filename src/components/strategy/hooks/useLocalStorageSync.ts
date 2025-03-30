
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { loadStrategyFromLocalStorage } from '../utils/flowUtils';

export function useLocalStorageSync(
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  initialNodes: Node[]
) {
  const isInitialLoadRef = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const isComponentMountedRef = useRef(true);
  
  // Load initial state from localStorage on mount
  useEffect(() => {
    // Set the mounted flag
    isComponentMountedRef.current = true;
    
    const loadInitialState = () => {
      // Only proceed if this is the initial load, we're not already loading, and component is mounted
      if (!isInitialLoadRef.current || isLoadingRef.current || !isComponentMountedRef.current) return;
      
      isLoadingRef.current = true;
      
      try {
        // Attempt to load from localStorage
        const result = loadStrategyFromLocalStorage();
        
        // Only proceed if component is still mounted
        if (!isComponentMountedRef.current) return;
        
        if (result) {
          const { nodes, edges } = result;
          
          if (nodes && nodes.length > 0) {
            // If we have nodes in localStorage, use them
            setNodes(nodes);
            setEdges(edges || []);
            
            // Also update the store - but with a small delay
            setTimeout(() => {
              if (isComponentMountedRef.current) {
                strategyStore.setNodes(nodes);
                strategyStore.setEdges(edges || []);
              }
            }, 100);
          } else {
            // Otherwise use initial nodes
            setNodes(initialNodes);
          }
        } else {
          // No localStorage data, use initial nodes
          if (isComponentMountedRef.current) {
            setNodes(initialNodes);
          }
        }
      } catch (error) {
        console.error('Error loading strategy from localStorage:', error);
        // Fallback to initial nodes
        if (isComponentMountedRef.current) {
          setNodes(initialNodes);
        }
      } finally {
        // Only update if component is still mounted
        if (isComponentMountedRef.current) {
          isLoadingRef.current = false;
          
          // Setup a short delay before marking initial load as complete
          syncTimeoutRef.current = setTimeout(() => {
            if (isComponentMountedRef.current) {
              isInitialLoadRef.current = false;
            }
          }, 500);
        }
      }
    };
    
    // Use setTimeout to break the React update cycle
    setTimeout(loadInitialState, 0);
    
    // Clean up function
    return () => {
      // Mark component as unmounted to prevent updates after unmount
      isComponentMountedRef.current = false;
      
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, []); // Empty dependency array - run once on mount
  
  return { isInitialLoadRef };
}
