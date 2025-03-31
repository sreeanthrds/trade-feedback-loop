
/**
 * Creates default data for a specific node type and ID
 */
export const createDefaultNodeData = (type: string, nodeId: string): any => {
  let defaultData: any = { 
    label: getDefaultNodeLabel(type),
    _lastUpdated: Date.now() // Add timestamp to force update detection
  };
  
  if (type === 'actionNode' || type === 'entryNode' || type === 'exitNode' || type === 'alertNode') {
    const positionId = `pos-${Date.now().toString().slice(-6)}`;
    
    // For entry and exit nodes, we need positions
    if (type === 'entryNode' || type === 'exitNode') {
      const defaultPosition = {
        id: positionId,
        vpi: `${nodeId}-pos1`,
        vpt: '',
        priority: 1,
        positionType: type === 'entryNode' ? 'buy' : 'sell',
        orderType: 'market',
        lots: 1,
        productType: 'intraday'
      };
      
      defaultData = {
        ...defaultData,
        actionType: type === 'entryNode' ? 'entry' : 'exit',
        positions: [defaultPosition],
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
      const defaultPosition = {
        id: positionId,
        vpi: `${nodeId}-pos1`,
        vpt: '',
        priority: 1,
        positionType: 'buy',
        orderType: 'market',
        lots: 1,
        productType: 'intraday'
      };
      
      defaultData = {
        ...defaultData,
        actionType: 'entry', // Default to entry
        positions: [defaultPosition],
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
