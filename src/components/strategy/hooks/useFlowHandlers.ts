
import { useCallback } from 'react';
import { useReactFlow, Connection, Edge, Node } from '@xyflow/react';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { usePanelState } from './usePanelState';
import { toast } from '@/hooks/use-toast';
import {
  useNodeHandlers,
  useEdgeHandlers,
  usePanelHandlers,
  useStrategyHandlers,
} from './flow-handlers';

export const useFlowHandlers = () => {
  // Get state from hooks
  const reactFlowInstance = useReactFlow();
  const { nodes, setNodes, reactFlowWrapper } = useNodeStateManagement();
  const { edges, setEdges, onConnect: baseOnConnect } = useEdgeStateManagement([], useStrategyStore());
  const { isPanelOpen, setSelectedNode, setIsPanelOpen } = usePanelState();
  const strategyStore = useStrategyStore();

  // Create handlers using the handler factory hooks
  const {
    onNodeClick,
    handleAddNode: nodeHandlersAddNode,
    updateNodeData,
    handleDeleteNode,
  } = useNodeHandlers({
    nodes,
    edges,
    reactFlowInstance,
    reactFlowWrapper,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore,
  });

  const { handleDeleteEdge } = useEdgeHandlers({
    edges,
    nodes,
    setEdges,
    strategyStore,
  });

  const { closePanel } = usePanelHandlers({
    setSelectedNode,
    setIsPanelOpen,
  });

  const { resetStrategy, handleImportSuccess } = useStrategyHandlers({
    strategyStore,
    setNodes,
    setEdges,
    reactFlowInstance,
    closePanel,
  });

  // Wrap addNode handler to handle initialNodeData
  const handleAddNode = useCallback(
    (type: string, parentNodeId?: string, initialNodeData?: Record<string, any>) => {
      // Pass all parameters to the underlying handler
      nodeHandlersAddNode(type, parentNodeId, initialNodeData);
    },
    [nodeHandlersAddNode]
  );

  return {
    // Node handlers
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode,

    // Edge handlers
    handleDeleteEdge,

    // Panel handlers
    handlePanelClose: closePanel,

    // Strategy handlers
    resetStrategy,
    handleImportSuccess,
  };
};
