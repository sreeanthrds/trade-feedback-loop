
import { Node } from '@xyflow/react';
import { toast } from 'sonner';

export const createResetStrategyHandler = (
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: any[]) => void,
  strategyStore: any,
  initialNodes: Node[],
  closePanel: () => void
) => {
  return () => {
    if (window.confirm("Are you sure you want to reset the strategy? All changes will be lost.")) {
      setNodes(initialNodes);
      setEdges([]);
      strategyStore.setNodes(initialNodes);
      strategyStore.setEdges([]);
      strategyStore.resetHistory();
      strategyStore.addHistoryItem(initialNodes, []);
      closePanel();
      toast.success("Strategy reset to initial state");
    }
  };
};
