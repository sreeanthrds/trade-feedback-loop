
import { Node, Edge, ReactFlowInstance, XYPosition } from '@xyflow/react';
import { createNode } from '../nodes/nodeOperations';
import { nanoid } from 'nanoid';
import { createNewEdge } from '../edges/edgeOperations';

export const createNodeClickHandler = (
  setSelectedNode: (node: Node | null) => void,
  setIsPanelOpen: (isOpen: boolean) => void
) => {
  return (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setIsPanelOpen(true);
  };
};

export const createAddNodeHandler = (
  reactFlowInstance: ReactFlowInstance | null,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  storeUpdater: any
) => {
  return (type: string, parentNodeId?: string, initialNodeData?: Record<string, any>) => {
    if (!reactFlowInstance) return;

    let newNodePosition: XYPosition;
    
    // If we have a parent node, position the new node relative to it
    if (parentNodeId) {
      const parentNode = nodes.find(node => node.id === parentNodeId);
      if (!parentNode) return;
      
      // Position below the parent node
      newNodePosition = { 
        x: parentNode.position.x, 
        y: parentNode.position.y + 150
      };
      
      // Check if there are already child nodes at this position
      // If so, offset the new node to the right
      const existingChildNodes = edges
        .filter(edge => edge.source === parentNodeId)
        .map(edge => nodes.find(node => node.id === edge.target))
        .filter(Boolean);
      
      if (existingChildNodes.length > 0) {
        // Offset by 200px to the right for each existing child
        newNodePosition.x += existingChildNodes.length * 200;
      }
    } else {
      // Create node at mouse position or center of screen if created from menu
      const position = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      
      newNodePosition = position;
    }
    
    // Generate a unique ID for the new node
    const id = nanoid(6);
    
    // Create new node with any initial data if provided
    const newNode = createNode(type, id, newNodePosition, initialNodeData);

    // Add the new node
    storeUpdater.addNode(newNode);
    
    // If we have a parent node, create an edge connecting them
    if (parentNodeId) {
      const newEdge = createNewEdge(parentNodeId, id);
      storeUpdater.addEdge(newEdge);
    }
  };
};

export const createUpdateNodeDataHandler = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  storeUpdater: any
) => {
  return (id: string, newData: Record<string, any>) => {
    storeUpdater.updateNodeData(id, newData);
  };
};

export const createDeleteNodeHandler = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  storeUpdater: any
) => {
  return (id: string) => {
    storeUpdater.deleteNode(id);
  };
};
