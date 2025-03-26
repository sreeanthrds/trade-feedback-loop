
import { NodeMouseHandler, Node, ReactFlowInstance, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { addNode, createEdgeBetweenNodes } from './flowUtils';

export const createNodeClickHandler = (
  setSelectedNode: (node: Node | null) => void,
  setIsPanelOpen: (isOpen: boolean) => void
): NodeMouseHandler => {
  return (_, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };
};

export const createAddNodeHandler = (
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any
) => {
  return (type: string, parentNodeId?: string) => {
    // Create a new node, passing the parent node ID if available
    const { node: newNode, parentNode } = addNode(type, reactFlowInstance, reactFlowWrapper, nodes, parentNodeId);
    
    // IMPORTANT: Create a completely new array with ALL existing nodes plus the new one
    const updatedNodes = [...nodes, newNode];
    
    // Create an edge if we have a parent node
    let updatedEdges = [...edges];
    if (parentNode) {
      const newEdge = createEdgeBetweenNodes(parentNode, newNode);
      updatedEdges = [...edges, newEdge];
    }
    
    // Update states with the combined nodes array
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    // Also update the global store - batch these updates to reduce renders
    queueMicrotask(() => {
      strategyStore.setNodes(updatedNodes);
      strategyStore.setEdges(updatedEdges);
      strategyStore.addHistoryItem(updatedNodes, updatedEdges);
    });
    
    toast.success(`Added ${type.replace('Node', '')} node`);
  };
};

export const createUpdateNodeDataHandler = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  strategyStore: any
) => {
  return (id: string, data: any) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    
    // Batch updates to store to reduce renders
    queueMicrotask(() => {
      strategyStore.setNodes(updatedNodes);
      strategyStore.addHistoryItem(updatedNodes, strategyStore.edges);
    });
  };
};

export const createDeleteNodeHandler = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any
) => {
  return (nodeId: string) => {
    // Remove the node
    const newNodes = nodes.filter(node => node.id !== nodeId);
    
    // Remove any connected edges
    const newEdges = edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Batch store updates
    queueMicrotask(() => {
      strategyStore.setNodes(newNodes);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(newNodes, newEdges);
    });
    
    toast.success("Node deleted");
  };
};

export const createDeleteEdgeHandler = (
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  strategyStore: any,
  nodes: Node[]
) => {
  return (edgeId: string) => {
    const newEdges = edges.filter(edge => edge.id !== edgeId);
    
    setEdges(newEdges);
    
    // Batch store updates
    queueMicrotask(() => {
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(nodes, newEdges);
    });
    
    toast.success("Connection deleted");
  };
};

export const createResetStrategyHandler = (
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: any[]) => void,
  strategyStore: any,
  initialNodes: Node[],
  closePanel: () => void
) => {
  return () => {
    if (window.confirm("Are you sure you want to reset the strategy? All changes will be lost.")) {
      setNodes(initialNodes);
      setEdges([]);
      
      // Batch store updates
      queueMicrotask(() => {
        strategyStore.setNodes(initialNodes);
        strategyStore.setEdges([]);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
      });
      
      closePanel();
      toast.success("Strategy reset to initial state");
    }
  };
};

export const createImportSuccessHandler = (
  reactFlowInstance: ReactFlowInstance
) => {
  return () => {
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      if (reactFlowInstance) {
        // First fit view normally
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          duration: 400 // Reduced from 600 for faster animation
        });
        
        // Then zoom out by an additional 15%
        setTimeout(() => {
          const { zoom } = reactFlowInstance.getViewport();
          const newZoom = zoom * 0.85;
          
          reactFlowInstance.setViewport(
            { 
              x: reactFlowInstance.getViewport().x, 
              y: reactFlowInstance.getViewport().y, 
              zoom: newZoom 
            }, 
            { duration: 150 } // Reduced from 200 for faster animation
          );
        }, 450); // Reduced from 650 for faster transition
      }
    });
  };
};
