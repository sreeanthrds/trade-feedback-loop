
import { useCallback, useRef, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { 
  createNodeClickHandler, 
  createAddNodeHandler,
  createUpdateNodeDataHandler,
  createDeleteNodeHandler
} from '../../utils/handlers';
import { v4 as uuidv4 } from 'uuid';

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
    // Skip if update is already in progress, but don't cancel first-time additions
    if (updateHandlingRef.current && nodes.length > 1) {
      console.log('Skipping add node due to ongoing update');
      return;
    }
    
    // Set the flag but also ensure it gets reset even if errors occur
    updateHandlingRef.current = true;
    
    try {
      // Ensure reactFlowInstance is available
      if (!instanceRef.current || !reactFlowWrapper.current) {
        console.error('React Flow instance or wrapper not available');
        updateHandlingRef.current = false;
        return;
      }
      
      const addNodeHandler = createAddNodeHandler(
        instanceRef.current,
        reactFlowWrapper,
        nodesRef.current,
        edgesRef.current,
        setNodes,
        setEdges,
        storeRef.current
      );
      
      // Add the node 
      addNodeHandler(type, parentNodeId);
      
      // Force immediate update to store without delay - CRITICAL FOR FIRST NODE ADDITION
      console.log('Forcing immediate update after adding node');
    } catch (error) {
      console.error('Error in handleAddNode:', error);
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive"
      });
    } finally {
      // Reset the flag with short delay to prevent race conditions
      setTimeout(() => {
        updateHandlingRef.current = false;
        console.log('Reset update handling flag');
      }, 300);
    }
  }, [reactFlowWrapper, setNodes, setEdges, updateHandlingRef, nodes.length]);

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
        
        // Special handling for exit nodes with re-entry toggle
        if (
          data?.exitNodeData &&
          data.exitNodeData?.reEntryConfig
        ) {
          const node = nodesRef.current.find(n => n.id === id);
          const oldConfig = node?.data?.exitNodeData?.reEntryConfig;
          const newConfig = data.exitNodeData.reEntryConfig;
          
          // If re-entry was toggled on, create a retry node
          if (oldConfig?.enabled === false && newConfig.enabled === true) {
            console.log('Re-entry was enabled, creating retry node');
            
            // Get node position
            const exitNode = nodesRef.current.find(n => n.id === id);
            if (exitNode) {
              const exitNodePosition = exitNode.position;
              
              // Create a retry node floating to the left of the exit node
              const retryNodeId = `retry-${uuidv4().substring(0, 6)}`;
              const retryNode = {
                id: retryNodeId,
                type: 'retryNode',
                position: {
                  x: exitNodePosition.x - 150,  // Position to the left
                  y: exitNodePosition.y + 20    // Slightly below
                },
                data: {
                  label: 'Retry',
                  actionType: 'retry',
                  retryConfig: {
                    groupNumber: newConfig.groupNumber || 1,
                    maxReEntries: newConfig.maxReEntries || 1
                  }
                }
              };
              
              // Create visual connection
              const floatingEdge = {
                id: `e-${id}-${retryNodeId}`,
                source: id,
                target: retryNodeId,
                type: 'default',
                animated: true,
                style: { stroke: '#9b59b6', strokeWidth: 2 }
              };
              
              // Update node data first
              handler(id, data);
              
              // Then add the retry node and edge
              setNodes(prev => [...prev, retryNode]);
              setEdges(prev => [...prev, floatingEdge]);
              
              // Update store
              setTimeout(() => {
                const updatedNodes = [...nodesRef.current, retryNode];
                const updatedEdges = [...edgesRef.current, floatingEdge];
                storeRef.current.setNodes(updatedNodes);
                storeRef.current.setEdges(updatedEdges);
                storeRef.current.addHistoryItem(updatedNodes, updatedEdges);
              }, 100);
              
              return;
            }
          }
        }
        
        // Default update behavior
        handler(id, data);
      } finally {
        // Reset the flag after a short delay
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 100);
      }
    }, 0);
  }, [setNodes, setEdges, updateHandlingRef]);
  
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
