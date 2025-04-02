
import { v4 as uuidv4 } from 'uuid';
import { createDefaultNodeData } from './defaults/defaultNodeData';
import { Node, ReactFlowInstance } from '@xyflow/react';
import { findEmptyPosition } from './positioning/findEmptyPosition';
import { getNodeTypePrefix } from './types/nodeTypes';
import { getHighestZIndex } from './styling/nodeZIndex';

/**
 * Node factory for creating new nodes with consistent structure
 */
export class NodeFactory {
  /**
   * Create a new node with positioning and correct data structure
   */
  static createNode(
    type: string,
    reactFlowInstance: ReactFlowInstance,
    existingNodes: Node[],
    parentNodeId?: string
  ): { node: Node, parentNode?: Node } {
    // Find parent node if specified
    const parentNode = parentNodeId 
      ? existingNodes.find(node => node.id === parentNodeId) 
      : undefined;
    
    // Determine suggested position
    let suggestedPosition = this.getSuggestedPosition(reactFlowInstance, parentNode);
    
    // Find non-overlapping position
    const position = findEmptyPosition(existingNodes, suggestedPosition.x, suggestedPosition.y);
    
    // Generate node ID
    const typePrefix = getNodeTypePrefix(type);
    const existingNodesOfType = existingNodes.filter(node => node.id.startsWith(typePrefix));
    const nodeCount = existingNodesOfType.length + 1;
    const nodeId = `${typePrefix}-${nodeCount}`;
    
    // Get default data for the node type
    const defaultData = createDefaultNodeData(type, nodeId);
    
    // Set z-index
    const highestZIndex = getHighestZIndex(existingNodes);
    const newZIndex = highestZIndex + 1;
    
    // Create the node
    const newNode: Node = {
      id: nodeId,
      type: type as any,
      position,
      data: defaultData,
      style: { zIndex: newZIndex }
    };
    
    return { node: newNode, parentNode };
  }
  
  /**
   * Get suggested position for a new node
   */
  private static getSuggestedPosition(
    reactFlowInstance: ReactFlowInstance,
    parentNode?: Node
  ) {
    // Default to center of viewport
    const viewportCenter = reactFlowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    
    if (!parentNode) {
      return viewportCenter;
    }
    
    // Position child node to the right and below parent
    return {
      x: parentNode.position.x + 220,
      y: parentNode.position.y + 70
    };
  }
}
