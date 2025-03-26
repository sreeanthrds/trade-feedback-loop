
import { Edge, Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export const createDeleteEdgeHandler = (
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  nodes: Node[]
) => {
  return (edgeId: string) => {
    const newEdges = edges.filter(edge => edge.id !== edgeId);
    
    setEdges(newEdges);
    strategyStore.setEdges(newEdges);
    strategyStore.addHistoryItem(nodes, newEdges);
    
    toast({
      title: "Edge deleted",
      description: "Connection deleted"
    });
  };
};
