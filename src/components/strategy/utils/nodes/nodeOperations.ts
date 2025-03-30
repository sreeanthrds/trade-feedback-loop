
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
  // Get center position of the viewport
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
              ? 'Entry'
              : type === 'exitNode'
                ? 'Exit'
                : type === 'alertNode'
                  ? 'Alert'
                  : 'Action'
  };
  
  // Setup specialized node data
  if (type === 'entryNode') {
    const positionId = `pos-${Date.now().toString().slice(-6)}`;
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
      actionType: 'entry',
      positions: [defaultPosition],
      _lastUpdated: Date.now() // Add timestamp to force update
    };
  } else if (type === 'exitNode') {
    defaultData = {
      ...defaultData,
      actionType: 'exit',
      _lastUpdated: Date.now() // Add timestamp to force update
    };
  } else if (type === 'alertNode') {
    defaultData = {
      ...defaultData,
      actionType: 'alert',
      _lastUpdated: Date.now() // Add timestamp to force update
    };
  }
  
  // Make sure we have the id in a stable format (as string)
  const newNode = {
    id: nodeId,
    type: type,
    position: {
      x: Math.round(position.x),
      y: Math.round(position.y)
    },
    data: defaultData,
    // Add a dragHandle property to ensure dragging works properly
    dragHandle: '.drag-handle'
  };
  
  console.log("Created new node:", newNode);
  
  return { node: newNode, parentNode };
};
