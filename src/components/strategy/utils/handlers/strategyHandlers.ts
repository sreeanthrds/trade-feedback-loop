
import { Node, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export const createResetStrategyHandler = (
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  initialNodes: Node[],
  closePanel: () => void
) => {
  return () => {
    // Reset nodes and edges in both state and store
    setNodes(initialNodes);
    setEdges([]);
    strategyStore.setNodes(initialNodes);
    strategyStore.setEdges([]);
    
    // Reset history and clear any selected nodes
    strategyStore.resetHistory();
    
    // Add the initial state to history
    strategyStore.addHistoryItem(initialNodes, []);
    
    // Close any open panel
    closePanel();
    
    // Also clear the current strategy in localStorage
    localStorage.removeItem('tradyStrategy');
    
    toast({
      title: "Strategy reset",
      description: "Strategy reset to initial state"
    });
  };
};

// This handler only shows a success toast for imports
export const createImportSuccessHandler = (
  reactFlowInstance: any
) => {
  return () => {
    toast({
      title: "Import successful",
      description: "Strategy imported successfully"
    });
  };
};
