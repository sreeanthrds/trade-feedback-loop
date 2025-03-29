
import { Node, XYPosition } from '@xyflow/react';
import { nanoid } from 'nanoid';

// Default node data used when creating new nodes
const defaultNodeData = {
  startNode: {
    label: 'Start',
    symbol: '',
    timeframe: '5min',
    indicators: []
  },
  signalNode: {
    label: 'Signal',
    conditions: []
  },
  actionNode: {
    label: 'Action',
    actionType: 'entry', // Default action type
    positions: []
  },
  endNode: {
    label: 'End'
  },
  forceEndNode: {
    label: 'Force End',
    closeAllPositions: true
  }
};

// Initial nodes for a new strategy
export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 350, y: 50 },
    data: { ...defaultNodeData.startNode }
  }
];

// Helper function to add a new node to existing nodes
export const addNode = (
  nodes: Node[],
  type: string,
  position: XYPosition,
  initialNodeData?: Record<string, any>
): Node => {
  const id = nanoid(6);
  const newNode = createNode(type, id, position, initialNodeData);
  return newNode;
};

/**
 * Creates a new node with the specified type, id, position and optional initial data
 */
export const createNode = (
  type: string, 
  id: string, 
  position: XYPosition,
  initialNodeData?: Record<string, any>
): Node => {
  // Create base node data using defaults for the node type
  const baseData = {
    ...defaultNodeData[type as keyof typeof defaultNodeData]
  };
  
  // Merge with any provided initial node data
  const data = initialNodeData 
    ? { ...baseData, ...initialNodeData } 
    : baseData;
    
  // Set specific action node labels based on action type
  if (type === 'actionNode' && initialNodeData?.actionType) {
    switch (initialNodeData.actionType) {
      case 'entry':
        data.label = 'Entry Order';
        break;
      case 'exit':
        data.label = 'Exit Order';
        break;
      case 'alert':
        data.label = 'Alert';
        break;
    }
  }

  return {
    id,
    type,
    position,
    data,
    // Default to be selectable and connectable
    selectable: true,
    connectable: true
  };
};
