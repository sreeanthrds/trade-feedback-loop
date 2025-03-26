
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

export const createImportSuccessHandler = (
  reactFlowInstance: any
) => {
  return () => {
    // Center view on the imported nodes
    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
    
    toast.success("Strategy imported successfully");
  };
};
