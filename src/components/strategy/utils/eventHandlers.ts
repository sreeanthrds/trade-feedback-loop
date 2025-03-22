
import { NodeMouseHandler, Node, ReactFlowInstance } from '@xyflow/react';
import { toast } from 'sonner';
import { addNode } from './flowUtils';

export const createNodeClickHandler = (
  setSelectedNode: (node: Node | null) => void,
  setIsPanelOpen: (isOpen: boolean) => void
): NodeMouseHandler => {
  return (_, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };
};

export const createAddNodeHandler = (
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  strategyStore: any
) => {
  return (type: string) => {
    const newNode = addNode(type, reactFlowInstance, reactFlowWrapper, nodes);
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    strategyStore.setNodes(newNodes);
    strategyStore.addHistoryItem(newNodes, strategyStore.edges);
  };
};

export const createUpdateNodeDataHandler = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  strategyStore: any
) => {
  return (id: string, data: any) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    strategyStore.setNodes(updatedNodes);
    strategyStore.addHistoryItem(updatedNodes, strategyStore.edges);
  };
};

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

export const createImportSuccessHandler = (
  reactFlowInstance: ReactFlowInstance
) => {
  return () => {
    // Force a layout update after import
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
  };
};
