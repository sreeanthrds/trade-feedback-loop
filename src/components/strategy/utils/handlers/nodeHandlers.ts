
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
      const { node: newNode, parentNode } = addNode(type, reactFlowInstance, reactFlowWrapper, nodes, parentNodeId);
      
      if (!newNode) {
        console.error('Failed to create new node');
        return;
      }
      
      console.log('Before adding node:', nodes.length, 'existing nodes');
      
      const updatedNodes = [...nodes, newNode];
      
      let updatedEdges = [...edges];
      if (parentNode) {
        const newEdge = createEdgeBetweenNodes(parentNode, newNode);
        updatedEdges = [...edges, newEdge];
      }
      
      console.log('After adding node:', updatedNodes.length, 'total nodes');
      
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      
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
          // Handle specific merge cases for positions
          let mergedData;
          if (data.positions && node.data && node.data.positions) {
            // For positions, we want to do a special merge
            mergedData = { 
              ...node.data, 
              ...data,
              _lastUpdated: Date.now() 
            };
          } else {
            // For other data, do a regular merge
            mergedData = { 
              ...node.data, 
              ...data,
              _lastUpdated: Date.now() 
            };
          }
          
          // If this is a start node and indicatorParameters were updated,
          // ensure indicators array is updated to match
          if (node.type === 'startNode' && data.indicatorParameters) {
            // Set indicators array to match keys in indicatorParameters
            mergedData.indicators = Object.keys(data.indicatorParameters);
          }
          
          return { ...node, data: mergedData };
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
      const newNodes = nodes.filter(node => node.id !== nodeId);
      
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
