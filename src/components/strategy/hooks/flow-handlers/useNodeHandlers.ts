
import { useCallback, useRef, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { 
  createNodeClickHandler, 
  createAddNodeHandler,
  createUpdateNodeDataHandler,
  createDeleteNodeHandler
} from '../../utils/handlers';

interface UseNodeHandlersProps {
  nodes: Node[];
  edges: any[];
  reactFlowInstance: any;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  setSelectedNode: (node: Node | null) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: any[]) => void;
  strategyStore: any;
}

export const useNodeHandlers = ({
  nodes,
  edges,
  reactFlowInstance,
  reactFlowWrapper,
  setSelectedNode,
  setIsPanelOpen,
  setNodes,
  setEdges,
  strategyStore
}: UseNodeHandlersProps) => {
  // Create stable refs to latest values
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const storeRef = useRef(strategyStore);
  const instanceRef = useRef(reactFlowInstance);
  
  // Update refs when dependencies change
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    storeRef.current = strategyStore;
    instanceRef.current = reactFlowInstance;
  }, [nodes, edges, strategyStore, reactFlowInstance]);

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

  return {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode
  };
};
