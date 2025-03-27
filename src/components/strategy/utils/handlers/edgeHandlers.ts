
import { Edge, Node } from '@xyflow/react';
import { toast } from "@/components/ui/toast";

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
