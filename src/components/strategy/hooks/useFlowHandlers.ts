
import { useRef, useEffect, useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  useNodeHandlers,
  useEdgeHandlers,
  usePanelHandlers,
  useStrategyHandlers
} from './flow-handlers';

interface UseFlowHandlersProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isPanelOpen: boolean;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  reactFlowInstance: any;
  setSelectedNode: (node: Node | null) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  strategyStore: any;
}

export const useFlowHandlers = (props: UseFlowHandlersProps | null) => {
  // Default empty handlers for when props is null
  if (!props) {
    return {
      onNodeClick: () => {},
      handleAddNode: () => {},
      updateNodeData: () => {},
      handleDeleteNode: () => {},
      handleDeleteEdge: () => {},
      closePanel: () => {},
      resetStrategy: () => {},
      handleImportSuccess: () => {}
    };
  }

  const {
    nodes,
    edges,
    reactFlowInstance,
    reactFlowWrapper,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  } = props;

  // Create panel handlers
  const { closePanel } = usePanelHandlers({
    setIsPanelOpen,
    setSelectedNode
  });

  // Initialize node handlers
  const nodeHandlers = useNodeHandlers({
    nodes,
    edges,
    reactFlowInstance,
    reactFlowWrapper,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  });

  // Initialize edge handlers
  const edgeHandlers = useEdgeHandlers({
    edges,
    nodes,
    setEdges,
    strategyStore
  });

  // Initialize strategy handlers
  const strategyHandlers = useStrategyHandlers({
    strategyStore,
    setNodes,
    setEdges,
    reactFlowInstance,
    closePanel
  });

  // Combine all handlers into a single object
  return useMemo(() => ({
    onNodeClick: nodeHandlers.onNodeClick,
    handleAddNode: nodeHandlers.handleAddNode,
    updateNodeData: nodeHandlers.updateNodeData,
    handleDeleteNode: nodeHandlers.handleDeleteNode,
    handleDeleteEdge: edgeHandlers.handleDeleteEdge,
    closePanel,
    resetStrategy: strategyHandlers.resetStrategy,
    handleImportSuccess: strategyHandlers.handleImportSuccess
  }), [
    nodeHandlers,
    edgeHandlers,
    closePanel,
    strategyHandlers
  ]);
};
