
import { NodeMouseHandler, Node, ReactFlowInstance, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { addNode, createEdgeBetweenNodes } from '../flowUtils';

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
    if (!reactFlowInstance || !reactFlowWrapper.current) {
      console.error('React Flow instance or wrapper not available');
      return;
    }
    
    try {
      // Create a new node, passing the parent node ID if available
      const { node: newNode, parentNode } = addNode(type, reactFlowInstance, reactFlowWrapper, nodes, parentNodeId);
      
      // Defensive checks
      if (!newNode) {
        console.error('Failed to create new node');
        return;
      }
      
      console.log('Before adding node:', nodes.length, 'existing nodes');
      
      // IMPORTANT: Create a completely new array with ALL existing nodes plus the new one
      const updatedNodes = [...nodes, newNode];
      
      // Create an edge if we have a parent node
      let updatedEdges = [...edges];
      if (parentNode) {
        const newEdge = createEdgeBetweenNodes(parentNode, newNode);
        updatedEdges = [...edges, newEdge];
      }
      
      console.log('After adding node:', updatedNodes.length, 'total nodes');
      
      // Update states with the combined nodes array
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      
      // Also update the global store
      strategyStore.setNodes(updatedNodes);
      strategyStore.setEdges(updatedEdges);
      strategyStore.addHistoryItem(updatedNodes, updatedEdges);
      
      toast({
        title: "Node added",
        description: `Added ${type.replace('Node', '')} node`
      });
    } catch (error) {
      console.error('Error adding node:', error);
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive"
      });
    }
  };
};

export const createUpdateNodeDataHandler = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  strategyStore: any
) => {
  return (id: string, data: any) => {
    if (!nodes || !id || !data) {
      console.error('Invalid parameters for updateNodeData');
      return;
    }
    
    try {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          // Add timestamp to force rendering updates
          const updatedData = { 
            ...node.data, 
            ...data,
            _lastUpdated: Date.now() 
          };
          return { ...node, data: updatedData };
        }
        return node;
      });
      
      setNodes(updatedNodes);
      strategyStore.setNodes(updatedNodes);
      strategyStore.addHistoryItem(updatedNodes, strategyStore.edges);
    } catch (error) {
      console.error('Error updating node data:', error);
    }
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
    if (!nodes || !edges || !nodeId) {
      console.error('Invalid parameters for deleteNode');
      return;
    }
    
    try {
      // Remove the node
      const newNodes = nodes.filter(node => node.id !== nodeId);
      
      // Remove any connected edges
      const newEdges = edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      );
      
      setNodes(newNodes);
      setEdges(newEdges);
      strategyStore.setNodes(newNodes);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(newNodes, newEdges);
      
      toast({
        title: "Node deleted",
        description: "Node deleted"
      });
    } catch (error) {
      console.error('Error deleting node:', error);
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      });
    }
  };
};
