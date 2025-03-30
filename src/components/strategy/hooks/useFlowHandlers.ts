
import { useRef, useEffect } from 'react';
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

export const useFlowHandlers = (props: UseFlowHandlersProps) => {
  // Check if props is defined to prevent the error
  if (!props) {
    console.error('Props is undefined in useFlowHandlers');
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

  // Create panel handlers first since closePanel is needed for strategy handlers
  const { closePanel } = usePanelHandlers({
    setIsPanelOpen,
    setSelectedNode
  });

  // Initialize node handlers
  const {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode
  } = useNodeHandlers({
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
  const { handleDeleteEdge } = useEdgeHandlers({
    edges,
    nodes,
    setEdges,
    strategyStore
  });

  // Initialize strategy handlers
  const {
    resetStrategy,
    handleImportSuccess
  } = useStrategyHandlers({
    strategyStore,
    setNodes,
    setEdges,
    reactFlowInstance,
    closePanel
  });

  return {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode,
    handleDeleteEdge,
    closePanel,
    resetStrategy,
    handleImportSuccess
  };
};
