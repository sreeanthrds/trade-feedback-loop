
import { useEffect } from 'react';
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
  // Sync nodes from store to ReactFlow
  useEffect(() => {
    if (isDraggingRef.current || isInitialLoadRef.current) return;
    
    const storeNodes = strategyStore.nodes;
    // Only update if the data has actually changed by doing a deep comparison
    // of the node ids, types, and data properties
    const nodesChanged = storeNodes.length !== nodes.length || 
      JSON.stringify(storeNodes.map(n => ({ id: n.id, type: n.type, data: n.data }))) !== 
      JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, data: n.data })));
    
    if (storeNodes.length > 0 && nodesChanged) {
      // Use setTimeout to break the potential update cycle
      const timeoutId = setTimeout(() => {
        setNodes(storeNodes);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [strategyStore.nodes, setNodes, nodes, isDraggingRef, isInitialLoadRef]);

  // Sync edges from store to ReactFlow
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    
    const storeEdges = strategyStore.edges;
    // Simple comparison to determine if edges have changed
    const edgesChanged = storeEdges.length !== edges.length || 
      JSON.stringify(storeEdges) !== JSON.stringify(edges);
    
    if (edgesChanged) {
      // Use setTimeout to break the potential update cycle
      const timeoutId = setTimeout(() => {
        setEdges(storeEdges);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [strategyStore.edges, setEdges, edges, isInitialLoadRef]);
}
