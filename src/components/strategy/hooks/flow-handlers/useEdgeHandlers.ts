
import { useCallback, useRef, useEffect } from 'react';
import { Edge, Node } from '@xyflow/react';
import { createDeleteEdgeHandler } from '../../utils/handlers';

interface UseEdgeHandlersProps {
  edges: Edge[];
  nodes: Node[];
  setEdges: (edges: Edge[]) => void;
  strategyStore: any;
}

export const useEdgeHandlers = ({
  edges,
  nodes,
  setEdges,
  strategyStore
}: UseEdgeHandlersProps) => {
  // Create stable refs to latest values
  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);
  const storeRef = useRef(strategyStore);
  
  // Update refs when dependencies change
  useEffect(() => {
    edgesRef.current = edges;
    nodesRef.current = nodes;
    storeRef.current = strategyStore;
  }, [edges, nodes, strategyStore]);
  
  // Create stable handler for deleting edges
  const handleDeleteEdge = useCallback((id: string) => {
    const handler = createDeleteEdgeHandler(
      edgesRef.current,
      setEdges,
      storeRef.current,
      nodesRef.current
    );
    handler(id);
  }, [setEdges]);

  return {
    handleDeleteEdge
  };
};
