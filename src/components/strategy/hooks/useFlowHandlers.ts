
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { 
  createNodeClickHandler, 
  createAddNodeHandler, 
  createUpdateNodeDataHandler, 
  createResetStrategyHandler,
  createImportSuccessHandler,
  createDeleteNodeHandler,
  createDeleteEdgeHandler
} from '../utils/eventHandlers';

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

export const useFlowHandlers = ({
  nodes,
  edges,
  reactFlowInstance,
  reactFlowWrapper,
  setSelectedNode,
  setIsPanelOpen,
  setNodes,
  setEdges,
  strategyStore
}: UseFlowHandlersProps) => {
  const onNodeClick = useCallback(
    createNodeClickHandler(setSelectedNode, setIsPanelOpen),
    [setSelectedNode, setIsPanelOpen]
  );

  const handleAddNode = useCallback(
    createAddNodeHandler(
      reactFlowInstance,
      reactFlowWrapper,
      nodes,
      setNodes,
      strategyStore
    ),
    [reactFlowInstance, reactFlowWrapper, nodes, setNodes, strategyStore]
  );

  const updateNodeData = useCallback(
    createUpdateNodeDataHandler(
      nodes,
      setNodes,
      strategyStore
    ),
    [nodes, setNodes, strategyStore]
  );
  
  const handleDeleteNode = useCallback(
    createDeleteNodeHandler(
      nodes,
      edges,
      setNodes,
      setEdges,
      strategyStore
    ),
    [nodes, edges, setNodes, setEdges, strategyStore]
  );
  
  const handleDeleteEdge = useCallback(
    createDeleteEdgeHandler(
      edges,
      setEdges,
      strategyStore,
      nodes
    ),
    [edges, setEdges, strategyStore, nodes]
  );

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  const resetStrategy = useCallback(
    createResetStrategyHandler(
      setNodes,
      setEdges,
      strategyStore,
      initialNodes,
      closePanel
    ),
    [setNodes, setEdges, strategyStore, closePanel]
  );

  const handleImportSuccess = useCallback(
    createImportSuccessHandler(reactFlowInstance),
    [reactFlowInstance]
  );

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

// Import this to avoid circular dependencies
import { initialNodes } from '../utils/flowUtils';
