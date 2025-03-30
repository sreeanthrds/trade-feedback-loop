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
  const syncTimeoutRef = useRef<any>(null);
  
  // Load initial state from localStorage on mount
  useEffect(() => {
    if (!isInitialLoadRef.current) return;
    
    try {
      // Attempt to load from localStorage
      const result = loadStrategyFromLocalStorage();
      
      if (result) {
        const { nodes, edges } = result;
        
        if (nodes && nodes.length > 0) {
          // If we have nodes in localStorage, use them
          setNodes(nodes);
          setEdges(edges || []);
          
          // Also update the store
          strategyStore.setNodes(nodes);
          strategyStore.setEdges(edges || []);
        } else {
          // Otherwise use initial nodes
          setNodes(initialNodes);
        }
      } else {
        // No localStorage data, use initial nodes
        setNodes(initialNodes);
      }
    } catch (error) {
      console.error('Error loading strategy from localStorage:', error);
      // Fallback to initial nodes
      setNodes(initialNodes);
    }
    
    // Setup a short delay before marking initial load as complete
    syncTimeoutRef.current = setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 500);
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - run once on mount
  
  return { isInitialLoadRef };
}
