
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';

/**
 * Hook to synchronize ReactFlow state with the global strategy store
 */
export function useStoreSync(
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  isDraggingRef: React.MutableRefObject<boolean>,
  isInitialLoadRef: React.MutableRefObject<boolean>
) {
  const prevNodesRef = useRef<string>('');
  const prevEdgesRef = useRef<string>('');
  const isSyncingRef = useRef<boolean>(false);
  const nodesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const edgesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);
  const updateCountRef = useRef(0);
  const didInitialSyncRef = useRef(false);
  
  // Set mounted flag on mount and handle cleanup on unmount
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      // Clear flag on unmount
      isComponentMountedRef.current = false;
      
      // Clear any pending timeouts
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
        nodesTimeoutRef.current = null;
      }
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
        edgesTimeoutRef.current = null;
      }
    };
  }, []);

  // Reset update counter periodically
  useEffect(() => {
    const timer = setInterval(() => {
      updateCountRef.current = 0;
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  // Do one-time initial sync from store to local state if store has nodes
  useEffect(() => {
    if (didInitialSyncRef.current || isSyncingRef.current || !isComponentMountedRef.current) {
      return;
    }

    const storeNodes = strategyStore.nodes;
    if (storeNodes && storeNodes.length > 0) {
      // Mark as synced to prevent infinite loop
      didInitialSyncRef.current = true;
      
      // Slight delay to break render cycle
      setTimeout(() => {
        if (isComponentMountedRef.current) {
          setNodes(storeNodes);
          setEdges(strategyStore.edges || []);
        }
      }, 100);
    }
  }, [strategyStore.nodes, strategyStore.edges, setNodes, setEdges]);
  
  // Sync nodes from store to ReactFlow with improved guards
  useEffect(() => {
    // Guard conditions to prevent infinite loops
    if (!isComponentMountedRef.current || 
        isInitialLoadRef.current || 
        isDraggingRef.current || 
        isSyncingRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (nodesTimeoutRef.current) {
      clearTimeout(nodesTimeoutRef.current);
      nodesTimeoutRef.current = null;
    }
    
    // Prevent excessive updates
    if (updateCountRef.current > 5) {
      console.warn('Too many updates in useStoreSync, stopping to prevent infinite loop');
      return;
    }
    
    // Set a small delay to debounce updates
    nodesTimeoutRef.current = setTimeout(() => {
      if (!isComponentMountedRef.current) return;
      
      const storeNodes = strategyStore.nodes;
      if (!storeNodes || storeNodes.length === 0) return;
      
      // Only update if node count has changed
      if (storeNodes.length !== nodes.length) {
        isSyncingRef.current = true;
        updateCountRef.current += 1;
        
        try {
          setNodes(storeNodes);
        } finally {
          // Always release the sync lock after a short delay
          setTimeout(() => {
            if (isComponentMountedRef.current) {
              isSyncingRef.current = false;
            }
          }, 200);
        }
        return;
      }
      
      // Create simplified representation for comparison to avoid infinite update loops
      const nodesSignature = JSON.stringify(
        storeNodes.map((n: Node) => ({ id: n.id, position: { x: Math.round(n.position.x), y: Math.round(n.position.y) } }))
      );
      const currentNodesSignature = JSON.stringify(
        nodes.map(n => ({ id: n.id, position: { x: Math.round(n.position.x), y: Math.round(n.position.y) } }))
      );
      
      // Only update if positions have changed
      if (nodesSignature !== currentNodesSignature && 
          nodesSignature !== prevNodesRef.current && 
          isComponentMountedRef.current) {
        
        isSyncingRef.current = true;
        prevNodesRef.current = nodesSignature;
        updateCountRef.current += 1;
        
        try {
          setNodes(storeNodes);
        } finally {
          // Always release the sync lock after a short delay
          setTimeout(() => {
            if (isComponentMountedRef.current) {
              isSyncingRef.current = false;
            }
          }, 200);
        }
      }
    }, 350); // Increased debounce time
    
    return () => {
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
      }
    };
  }, [strategyStore.nodes, setNodes, isDraggingRef, isInitialLoadRef, nodes.length, nodes]);

  // Sync edges from store to ReactFlow with similar improvements
  useEffect(() => {
    if (!isComponentMountedRef.current || 
        isInitialLoadRef.current || 
        isSyncingRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (edgesTimeoutRef.current) {
      clearTimeout(edgesTimeoutRef.current);
      edgesTimeoutRef.current = null;
    }
    
    // Prevent excessive updates
    if (updateCountRef.current > 5) {
      console.warn('Too many updates in useStoreSync, stopping to prevent infinite loop');
      return;
    }
    
    // Set a small delay to debounce updates
    edgesTimeoutRef.current = setTimeout(() => {
      if (!isComponentMountedRef.current) return;
      
      const storeEdges = strategyStore.edges;
      if (!storeEdges) return;
      
      // Quick check if edge count has changed
      if (storeEdges.length !== edges.length) {
        isSyncingRef.current = true;
        updateCountRef.current += 1;
        
        try {
          setEdges(storeEdges);
        } finally {
          // Release the sync lock after a short delay
          setTimeout(() => {
            if (isComponentMountedRef.current) {
              isSyncingRef.current = false;
            }
          }, 200);
        }
        return;
      }
      
      // Create simplified representation for comparison
      const edgesSignature = JSON.stringify(storeEdges.map((e: Edge) => ({ id: e.id, source: e.source, target: e.target })));
      const currentEdgesSignature = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      
      // Only update if there's an actual difference and component is still mounted
      if (edgesSignature !== currentEdgesSignature && 
          edgesSignature !== prevEdgesRef.current && 
          isComponentMountedRef.current) {
        
        isSyncingRef.current = true;
        prevEdgesRef.current = edgesSignature;
        updateCountRef.current += 1;
        
        try {
          setEdges(storeEdges);
        } finally {
          // Release the sync lock after a short delay
          setTimeout(() => {
            if (isComponentMountedRef.current) {
              isSyncingRef.current = false;
            }
          }, 200);
        }
      }
    }, 350); // Increased debounce time
    
    return () => {
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
      }
    };
  }, [strategyStore.edges, setEdges, isInitialLoadRef, edges.length, edges]);
}
