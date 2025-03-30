
import { useCallback, useRef, useEffect } from 'react';
import { Edge, Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

interface UseEdgeHandlersProps {
  edges: Edge[];
  nodes: Node[];
  setEdges: (edges: Edge[]) => void;
  strategyStore: any;
  updateHandlingRef: React.MutableRefObject<boolean>;
}

export const useEdgeHandlers = ({
  edges,
  nodes,
  setEdges,
  strategyStore,
  updateHandlingRef
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
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      // Filter out the edge with the given id
      const newEdges = edgesRef.current.filter(edge => edge.id !== id);
      setEdges(newEdges);
      
      // Update store
      storeRef.current.setEdges(newEdges);
      storeRef.current.addHistoryItem(nodesRef.current, newEdges);
      
      toast({
        title: "Edge deleted",
        description: "Connection has been removed."
      });
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [setEdges, updateHandlingRef]);

  return {
    handleDeleteEdge
  };
};
