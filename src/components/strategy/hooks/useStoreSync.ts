
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
  
  // Sync nodes from store to ReactFlow
  useEffect(() => {
    // Prevent recursive calls during synchronization
    if (isSyncingRef.current || isDraggingRef.current || isInitialLoadRef.current) return;
    
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
      setNodes(storeNodes);
      
      // Release the sync lock after a short delay to ensure updates are processed
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [strategyStore.nodes, setNodes, nodes, isDraggingRef, isInitialLoadRef]);

  // Sync edges from store to ReactFlow
  useEffect(() => {
    if (isSyncingRef.current || isInitialLoadRef.current) return;
    
    const storeEdges = strategyStore.edges;
    
    // Create simplified representation for comparison
    const edgesSignature = JSON.stringify(storeEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    const currentEdgesSignature = JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    
    // Only update if there's an actual difference
    if (edgesSignature !== currentEdgesSignature && edgesSignature !== prevEdgesRef.current) {
      isSyncingRef.current = true;
      prevEdgesRef.current = edgesSignature;
      setEdges(storeEdges);
      
      // Release the sync lock after a short delay
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [strategyStore.edges, setEdges, edges, isInitialLoadRef]);
}
