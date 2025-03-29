
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
  
  // If we have a parent node ID, offset the new node from the parent
  const parentNode = parentNodeId ? nodes.find(node => node.id === parentNodeId) : undefined;
  
  if (parentNode) {
    // Position the new node to the right of the parent node
    position.x = parentNode.position.x + 200;
    position.y = parentNode.position.y + 50;
  }
  
  // Generate a new node ID
  const nodeId = `${type}-${Date.now()}`;
  
  // Set default data based on node type
  let defaultData: any = { 
    label: type === 'startNode' 
      ? 'Start' 
      : type === 'endNode' 
        ? 'End' 
        : type === 'forceEndNode'
          ? 'Force End'
          : type === 'signalNode' 
            ? 'Signal' 
            : 'Action'
  };
  
  // Add specific default values for action nodes
  if (type === 'actionNode') {
    // Create a default position with a system-generated VPI
    const positionId = `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const defaultPosition = {
      id: positionId,
      vpi: `${nodeId}-1`, // Use readable nodeId in the VPI
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
      positions: [defaultPosition]
    };
  }
  
  const newNode = {
    id: nodeId,
    type: type as any,
    position,
    data: defaultData
  };
  
  return { node: newNode, parentNode };
};
