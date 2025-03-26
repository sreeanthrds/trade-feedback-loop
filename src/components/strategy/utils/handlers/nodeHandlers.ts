
import { NodeMouseHandler, Node, ReactFlowInstance, Edge } from '@xyflow/react';
import { toast } from 'sonner';
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
    // Create a new node, passing the parent node ID if available
    const { node: newNode, parentNode } = addNode(type, reactFlowInstance, reactFlowWrapper, nodes, parentNodeId);
    
    console.log('Before adding node:', nodes.length, 'existing nodes');
    console.log('Current nodes:', JSON.stringify(nodes.map(n => n.id)));
    
    // IMPORTANT: Create a completely new array with ALL existing nodes plus the new one
    const updatedNodes = [...nodes, newNode];
    
    // Create an edge if we have a parent node
    let updatedEdges = [...edges];
    if (parentNode) {
      const newEdge = createEdgeBetweenNodes(parentNode, newNode);
      updatedEdges = [...edges, newEdge];
    }
    
    console.log('After adding node:', updatedNodes.length, 'total nodes');
    console.log('Updated nodes:', JSON.stringify(updatedNodes.map(n => n.id)));
    
    // Update states with the combined nodes array
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    // Also update the global store
    strategyStore.setNodes(updatedNodes);
    strategyStore.setEdges(updatedEdges);
    strategyStore.addHistoryItem(updatedNodes, updatedEdges);
    
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
    strategyStore.setNodes(updatedNodes);
    strategyStore.addHistoryItem(updatedNodes, strategyStore.edges);
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
    strategyStore.setNodes(newNodes);
    strategyStore.setEdges(newEdges);
    strategyStore.addHistoryItem(newNodes, newEdges);
    
    toast.success("Node deleted");
  };
};
