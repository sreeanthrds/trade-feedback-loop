
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
  const { edges, setEdges } = useEdgeStateManagement();
  const { setSelectedNode, setIsPanelOpen } = usePanelState();
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

  const { onEdgeClick, onConnect, onEdgeUpdate, onEdgeUpdateEnd } =
    useEdgeHandlers({
      edges,
      setEdges,
      setSelectedNode,
      setIsPanelOpen,
      strategyStore,
    });

  const { handlePanelClose } = usePanelHandlers({
    setSelectedNode,
    setIsPanelOpen,
  });

  const { handleSaveStrategy, handleLoadStrategy, handleClearStrategy } =
    useStrategyHandlers({
      reactFlowInstance,
      setNodes,
      setEdges,
      setSelectedNode,
      setIsPanelOpen,
      strategyStore,
    });

  // Wrap addNode handler to handle initialNodeData
  const handleAddNode = useCallback(
    (type: string, parentNodeId?: string, initialNodeData?: Record<string, any>) => {
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
    onEdgeClick,
    onConnect,
    onEdgeUpdate,
    onEdgeUpdateEnd,

    // Panel handlers
    handlePanelClose,

    // Strategy handlers
    handleSaveStrategy,
    handleLoadStrategy,
    handleClearStrategy,
  };
};
