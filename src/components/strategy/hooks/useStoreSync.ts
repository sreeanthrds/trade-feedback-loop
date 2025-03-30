
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
    if (storeNodes.length > 0 && 
        JSON.stringify(storeNodes.map(n => ({ id: n.id, type: n.type, data: n.data }))) !== 
        JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, data: n.data })))) {
      setNodes(storeNodes);
    }
  }, [strategyStore.nodes, setNodes, nodes, isDraggingRef, isInitialLoadRef]);

  // Sync edges from store to ReactFlow
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    
    const storeEdges = strategyStore.edges;
    if (JSON.stringify(storeEdges) !== JSON.stringify(edges)) {
      setEdges(storeEdges);
    }
  }, [strategyStore.edges, setEdges, edges, isInitialLoadRef]);
}
