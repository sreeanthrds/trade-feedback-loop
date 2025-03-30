
import React, { useEffect, useRef } from 'react';
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
  // Add refs to track update cycles and prevent infinite loops
  const isUpdatingFromStoreRef = useRef(false);
  const pendingNodeUpdateRef = useRef<Node[] | null>(null);
  const pendingEdgeUpdateRef = useRef<Edge[] | null>(null);
  const lastNodeUpdateTimeRef = useRef(0);
  const lastEdgeUpdateTimeRef = useRef(0);
  
  // Sync nodes from store to ReactFlow with better cycle detection
  useEffect(() => {
    // Skip sync during initial load or dragging operations
    if (isDraggingRef.current || isInitialLoadRef.current || isUpdatingFromStoreRef.current) {
      return;
    }
    
    const storeNodes = strategyStore.nodes;
    
    // Skip if there are no nodes to sync
    if (!storeNodes || storeNodes.length === 0) {
      return;
    }
    
    // Only update if data has actually changed using a more efficient comparison
    // Just compare node count and IDs first as a quick check
    let nodesChanged = storeNodes.length !== nodes.length;
    
    if (!nodesChanged) {
      // If lengths match, do a deeper comparison of important properties
      const storeNodeIds = storeNodes.map(n => `${n.id}-${n.type}`).sort().join('|');
      const currentNodeIds = nodes.map(n => `${n.id}-${n.type}`).sort().join('|');
      nodesChanged = storeNodeIds !== currentNodeIds;
      
      // If IDs match, check if any node data has changed (do this last as it's more expensive)
      if (!nodesChanged) {
        for (let i = 0; i < storeNodes.length; i++) {
          const storeNode = storeNodes[i];
          const currentNode = nodes.find(n => n.id === storeNode.id);
          
          if (!currentNode || 
              JSON.stringify(storeNode.data) !== JSON.stringify(currentNode.data) ||
              storeNode.position.x !== currentNode.position.x ||
              storeNode.position.y !== currentNode.position.y) {
            nodesChanged = true;
            break;
          }
        }
      }
    }
    
    // Only proceed with update if nodes have actually changed
    if (nodesChanged) {
      // Implement throttling to prevent rapid updates
      const now = Date.now();
      if (now - lastNodeUpdateTimeRef.current < 200) {
        // Store the update for later and return
        pendingNodeUpdateRef.current = storeNodes;
        return;
      }
      
      lastNodeUpdateTimeRef.current = now;
      pendingNodeUpdateRef.current = null;
      
      // Use flag and setTimeout to break the potential update cycle
      isUpdatingFromStoreRef.current = true;
      const timeoutId = setTimeout(() => {
        setNodes(storeNodes);
        // Reset the flag after a short delay to allow the update to complete
        setTimeout(() => {
          isUpdatingFromStoreRef.current = false;
        }, 50);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Process any pending updates that were throttled
    if (pendingNodeUpdateRef.current && now - lastNodeUpdateTimeRef.current >= 200) {
      const pendingNodes = pendingNodeUpdateRef.current;
      pendingNodeUpdateRef.current = null;
      lastNodeUpdateTimeRef.current = now;
      
      isUpdatingFromStoreRef.current = true;
      const timeoutId = setTimeout(() => {
        setNodes(pendingNodes);
        setTimeout(() => {
          isUpdatingFromStoreRef.current = false;
        }, 50);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [strategyStore.nodes, setNodes, nodes, isDraggingRef, isInitialLoadRef]);

  // Sync edges from store to ReactFlow with similar improvements
  useEffect(() => {
    // Skip during initial load or update cycles
    if (isInitialLoadRef.current || isUpdatingFromStoreRef.current) {
      return;
    }
    
    const storeEdges = strategyStore.edges;
    
    // Skip if there are no edges to sync
    if (!storeEdges || storeEdges.length === 0) {
      // Only update if we have edges to remove
      if (edges.length > 0) {
        const now = Date.now();
        if (now - lastEdgeUpdateTimeRef.current < 200) return;
        
        lastEdgeUpdateTimeRef.current = now;
        isUpdatingFromStoreRef.current = true;
        
        const timeoutId = setTimeout(() => {
          setEdges([]);
          setTimeout(() => {
            isUpdatingFromStoreRef.current = false;
          }, 50);
        }, 50);
        
        return () => clearTimeout(timeoutId);
      }
      return;
    }
    
    // More efficient comparison for edges
    let edgesChanged = storeEdges.length !== edges.length;
    
    if (!edgesChanged) {
      // Compare edge source/target/id combinations
      const storeEdgeKeys = storeEdges.map(e => `${e.id}-${e.source}-${e.target}`).sort().join('|');
      const currentEdgeKeys = edges.map(e => `${e.id}-${e.source}-${e.target}`).sort().join('|');
      edgesChanged = storeEdgeKeys !== currentEdgeKeys;
    }
    
    if (edgesChanged) {
      // Implement throttling for edge updates too
      const now = Date.now();
      if (now - lastEdgeUpdateTimeRef.current < 200) {
        // Store for later
        pendingEdgeUpdateRef.current = storeEdges;
        return;
      }
      
      lastEdgeUpdateTimeRef.current = now;
      pendingEdgeUpdateRef.current = null;
      
      // Use flag and setTimeout pattern
      isUpdatingFromStoreRef.current = true;
      const timeoutId = setTimeout(() => {
        setEdges(storeEdges);
        setTimeout(() => {
          isUpdatingFromStoreRef.current = false;
        }, 50);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Process any pending edge updates
    if (pendingEdgeUpdateRef.current && now - lastEdgeUpdateTimeRef.current >= 200) {
      const pendingEdges = pendingEdgeUpdateRef.current;
      pendingEdgeUpdateRef.current = null;
      lastEdgeUpdateTimeRef.current = now;
      
      isUpdatingFromStoreRef.current = true;
      const timeoutId = setTimeout(() => {
        setEdges(pendingEdges);
        setTimeout(() => {
          isUpdatingFromStoreRef.current = false;
        }, 50);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [strategyStore.edges, setEdges, edges, isInitialLoadRef]);
}
