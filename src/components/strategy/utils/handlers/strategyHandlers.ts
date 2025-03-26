
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export const createResetStrategyHandler = (
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  initialNodes: Node[],
  closePanel: () => void
) => {
  return () => {
    setNodes(initialNodes);
    setEdges([]);
    strategyStore.setNodes(initialNodes);
    strategyStore.setEdges([]);
    strategyStore.resetHistory();
    closePanel();
    
    toast.success("Strategy reset to initial state");
  };
};

// This handler only shows a success toast for imports
export const createImportSuccessHandler = (
  reactFlowInstance: any
) => {
  return () => {
    toast.success("Strategy imported successfully");
  };
};
