
import { useCallback, useRef, useEffect } from 'react';
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
  // Create stable refs to latest values
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const storeRef = useRef(strategyStore);
  const instanceRef = useRef(reactFlowInstance);
  
  // Update refs when dependencies change - more efficient than recreating handlers
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    storeRef.current = strategyStore;
    instanceRef.current = reactFlowInstance;
  }, [nodes, edges, strategyStore, reactFlowInstance]);

  // Memoized handlers that use refs for better performance
  
  // Create stable handler for node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, [setSelectedNode, setIsPanelOpen]);

  // Create stable handler for adding nodes
  const handleAddNode = useCallback((type: string, parentNodeId?: string) => {
    const addNodeHandler = createAddNodeHandler(
      instanceRef.current,
      reactFlowWrapper,
      nodesRef.current,
      edgesRef.current,
      setNodes,
      setEdges,
      storeRef.current
    );
    addNodeHandler(type, parentNodeId);
  }, [reactFlowWrapper, setNodes, setEdges]);

  // Create stable handler for updating node data
  const updateNodeData = useCallback((id: string, data: any) => {
    const handler = createUpdateNodeDataHandler(
      nodesRef.current,
      setNodes,
      storeRef.current
    );
    handler(id, data);
  }, [setNodes]);
  
  // Create stable handler for deleting nodes
  const handleDeleteNode = useCallback((id: string) => {
    const handler = createDeleteNodeHandler(
      nodesRef.current,
      edgesRef.current,
      setNodes,
      setEdges,
      storeRef.current
    );
    handler(id);
  }, [setNodes, setEdges]);
  
  // Create stable handler for deleting edges
  const handleDeleteEdge = useCallback((id: string) => {
    const handler = createDeleteEdgeHandler(
      edgesRef.current,
      setEdges,
      storeRef.current,
      nodesRef.current
    );
    handler(id);
  }, [setEdges]);

  // Create stable handler for closing the panel
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  // Create stable handler for resetting the strategy
  const resetStrategy = useCallback(() => {
    const handler = createResetStrategyHandler(
      setNodes,
      setEdges,
      storeRef.current,
      initialNodes,
      closePanel
    );
    handler();
  }, [setNodes, setEdges, closePanel]);

  // Create stable handler for handling import success
  const handleImportSuccess = useCallback(() => {
    const handler = createImportSuccessHandler(instanceRef.current);
    handler();
  }, []);

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
