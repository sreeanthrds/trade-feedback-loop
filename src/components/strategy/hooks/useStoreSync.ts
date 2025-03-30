
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
  
  // Sync nodes from store to ReactFlow
  useEffect(() => {
    // Prevent syncing during initial load or dragging
    if (isInitialLoadRef.current || isDraggingRef.current) return;
    
    // Prevent recursive calls during synchronization
    if (isSyncingRef.current) return;
    
    // Clear any existing timeout
    if (nodesTimeoutRef.current) {
      clearTimeout(nodesTimeoutRef.current);
      nodesTimeoutRef.current = null;
    }
    
    // Set a small delay to debounce updates
    nodesTimeoutRef.current = setTimeout(() => {
      const storeNodes = strategyStore.nodes;
      if (storeNodes.length === 0) return;
      
      // Create simplified representation for comparison to avoid infinite update loops
      const nodesSignature = JSON.stringify(
        storeNodes.map(n => ({ id: n.id, type: n.type, dataId: n.data?._lastUpdated }))
      );
      const currentNodesSignature = JSON.stringify(
        nodes.map(n => ({ id: n.id, type: n.type, dataId: n.data?._lastUpdated }))
      );
      
      // Only update if there's an actual difference
      if (nodesSignature !== currentNodesSignature && nodesSignature !== prevNodesRef.current) {
        isSyncingRef.current = true;
        prevNodesRef.current = nodesSignature;
        
        try {
          setNodes(storeNodes);
        } finally {
          // Always release the sync lock after a short delay
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 50);
        }
      }
    }, 50);
    
    return () => {
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
      }
    };
  }, [strategyStore.nodes, setNodes, nodes, isDraggingRef, isInitialLoadRef]);

  // Sync edges from store to ReactFlow
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    if (isSyncingRef.current) return;
    
    // Clear any existing timeout
    if (edgesTimeoutRef.current) {
      clearTimeout(edgesTimeoutRef.current);
      edgesTimeoutRef.current = null;
    }
    
    // Set a small delay to debounce updates
    edgesTimeoutRef.current = setTimeout(() => {
      const storeEdges = strategyStore.edges;
      
      // Create simplified representation for comparison
      const edgesSignature = JSON.stringify(storeEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      const currentEdgesSignature = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
      
      // Only update if there's an actual difference
      if (edgesSignature !== currentEdgesSignature && edgesSignature !== prevEdgesRef.current) {
        isSyncingRef.current = true;
        prevEdgesRef.current = edgesSignature;
        
        try {
          setEdges(storeEdges);
        } finally {
          // Release the sync lock after a short delay
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 50);
        }
      }
    }, 50);
    
    return () => {
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
      }
    };
  }, [strategyStore.edges, setEdges, edges, isInitialLoadRef]);
}
