
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
import { initialNodes } from '../utils/flowUtils';

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
  // Create a memoized onNodeClick handler that won't change on every render
  const onNodeClick = useCallback(
    createNodeClickHandler(setSelectedNode, setIsPanelOpen),
    [setSelectedNode, setIsPanelOpen]
  );

  // Create a memoized handleAddNode function that properly preserves existing nodes
  const handleAddNode = useCallback((type: string) => {
    if (!reactFlowInstance || !reactFlowWrapper.current) {
      toast.error("Flow canvas not initialized");
      return;
    }
    
    const createAddNodeFn = createAddNodeHandler(
      reactFlowInstance,
      reactFlowWrapper,
      nodes,
      setNodes,
      strategyStore
    );
    
    createAddNodeFn(type);
  }, [nodes, reactFlowInstance, reactFlowWrapper, setNodes, strategyStore]);

  const updateNodeData = useCallback((id: string, data: any) => {
    const updateNodeDataFn = createUpdateNodeDataHandler(
      nodes,
      setNodes,
      strategyStore
    );
    
    updateNodeDataFn(id, data);
  }, [nodes, setNodes, strategyStore]);
  
  const handleDeleteNode = useCallback((id: string) => {
    const deleteNodeFn = createDeleteNodeHandler(
      nodes,
      edges,
      setNodes,
      setEdges,
      strategyStore
    );
    
    deleteNodeFn(id);
  }, [nodes, edges, setNodes, setEdges, strategyStore]);
  
  const handleDeleteEdge = useCallback((id: string) => {
    const deleteEdgeFn = createDeleteEdgeHandler(
      edges,
      setEdges,
      strategyStore,
      nodes
    );
    
    deleteEdgeFn(id);
  }, [edges, setEdges, strategyStore, nodes]);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  const resetStrategy = useCallback(() => {
    const resetStrategyFn = createResetStrategyHandler(
      setNodes,
      setEdges,
      strategyStore,
      initialNodes,
      closePanel
    );
    
    resetStrategyFn();
  }, [setNodes, setEdges, strategyStore, closePanel]);

  const handleImportSuccess = useCallback(() => {
    const importSuccessFn = createImportSuccessHandler(reactFlowInstance);
    importSuccessFn();
  }, [reactFlowInstance]);

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
