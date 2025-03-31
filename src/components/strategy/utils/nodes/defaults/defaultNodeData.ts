
/**
 * Creates default data for a specific node type and ID
 */
export const createDefaultNodeData = (type: string, nodeId: string): any => {
  let defaultData: any = { 
    label: getDefaultNodeLabel(type),
    _lastUpdated: Date.now() // Add timestamp to force update detection
  };
  
  if (type === 'actionNode' || type === 'entryNode' || type === 'exitNode' || type === 'alertNode') {
    // For entry and exit nodes, initialize with empty positions array
    if (type === 'entryNode' || type === 'exitNode') {
      defaultData = {
        ...defaultData,
        actionType: type === 'entryNode' ? 'entry' : 'exit',
        positions: [], // Start with empty positions array
        requiresSymbol: true
      };
    } 
    // For alert nodes, we don't need positions but still need actionType
    else if (type === 'alertNode') {
      defaultData = {
        ...defaultData,
        actionType: 'alert',
        positions: [],
        requiresSymbol: true
      };
    }
    // For general action nodes
    else {
      defaultData = {
        ...defaultData,
        actionType: 'entry', // Default to entry
        positions: [], // Start with empty positions array
        requiresSymbol: true
      };
    }
  }
  
  // For signal nodes, initialize with default conditions structure
  if (type === 'signalNode') {
    defaultData = {
      ...defaultData,
      conditions: [
        {
          id: 'root',
          groupLogic: 'AND',
          conditions: []
        }
      ]
    };
  }
  
  return defaultData;
};

// Import the necessary function
import { getDefaultNodeLabel } from '../types/nodeTypes';
