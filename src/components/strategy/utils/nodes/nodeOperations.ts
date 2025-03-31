
import { Node, ReactFlowInstance } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 50 },
    data: { label: 'Start' }
  }
];

export const addNode = (
  type: string, 
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  parentNodeId?: string
): { node: Node, parentNode?: Node } => {
  const position = reactFlowInstance.screenToFlowPosition({
    x: (reactFlowWrapper.current?.clientWidth || 800) / 2,
    y: (reactFlowWrapper.current?.clientHeight || 600) / 2,
  });
  
  const parentNode = parentNodeId ? nodes.find(node => node.id === parentNodeId) : undefined;
  
  if (parentNode) {
    position.x = parentNode.position.x + 200;
    position.y = parentNode.position.y + 50;
  }
  
  const getNodeTypePrefix = () => {
    switch (type) {
      case 'startNode': return 'start';
      case 'signalNode': return 'signal';
      case 'actionNode': return 'action';
      case 'entryNode': return 'entry';
      case 'exitNode': return 'exit';
      case 'alertNode': return 'alert';
      case 'endNode': return 'end';
      case 'forceEndNode': return 'force-end';
      default: return type.replace('Node', '').toLowerCase();
    }
  };
  
  const typePrefix = getNodeTypePrefix();
  const existingNodesOfType = nodes.filter(node => node.id.startsWith(typePrefix));
  const nodeCount = existingNodesOfType.length + 1;
  
  const nodeId = `${typePrefix}-${nodeCount}`;
  
  let defaultData: any = { 
    label: type === 'startNode' 
      ? 'Start' 
      : type === 'endNode' 
        ? 'End' 
        : type === 'forceEndNode'
          ? 'Force End'
          : type === 'signalNode' 
            ? 'Signal' 
            : type === 'entryNode'
              ? 'Entry Order'
              : type === 'exitNode'
                ? 'Exit Order'
                : type === 'alertNode'
                  ? 'Alert'
                  : 'Action',
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
  
  const newNode = {
    id: nodeId,
    type: type as any,
    position,
    data: defaultData
  };
  
  console.log('Created new node:', newNode);
  
  return { node: newNode, parentNode };
};
