import { Node, XYPosition } from '@xyflow/react';

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
    actionType: 'entry',
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
