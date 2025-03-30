
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
  updateHandlingRef: React.MutableRefObject<boolean>;
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
  strategyStore,
  updateHandlingRef
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
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
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
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [reactFlowWrapper, setNodes, setEdges, updateHandlingRef]);

  // Create stable handler for updating node data
  const updateNodeData = useCallback((id: string, data: any) => {
    // Prevent recursive update loops
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    setTimeout(() => {
      try {
        const handler = createUpdateNodeDataHandler(
          nodesRef.current,
          setNodes,
          storeRef.current
        );
        handler(id, data);
      } finally {
        // Reset the flag after a delay
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 100);
      }
    }, 0);
  }, [setNodes, updateHandlingRef]);
  
  // Create stable handler for deleting nodes
  const handleDeleteNode = useCallback((id: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      const handler = createDeleteNodeHandler(
        nodesRef.current,
        edgesRef.current,
        setNodes,
        setEdges,
        storeRef.current
      );
      handler(id);
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [setNodes, setEdges, updateHandlingRef]);

  return {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode
  };
};
