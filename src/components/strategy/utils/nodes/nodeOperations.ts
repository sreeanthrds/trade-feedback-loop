
import { Node, ReactFlowInstance } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { getIndicatorDisplayName } from '../indicatorUtils';

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
    defaultData = {
      ...defaultData,
      actionType: 'entry',
      positionType: 'buy',
      orderType: 'market',
      lots: 1,
      productType: 'intraday'
    };
  }
  
  const newNode = {
    id: `${type}-${Date.now()}`,
    type: type as any,
    position,
    data: defaultData
  };
  
  return { node: newNode, parentNode };
};

// Add a utility function to get formatted display names for all indicators
export const getIndicatorMap = (startNode: Node | undefined): Record<string, string> => {
  if (!startNode || !startNode.data || !startNode.data.indicators || !startNode.data.indicatorParameters) {
    return {};
  }
  
  return startNode.data.indicators.reduce((acc, indicator) => {
    acc[indicator] = getIndicatorDisplayName(indicator, startNode.data.indicatorParameters);
    return acc;
  }, {} as Record<string, string>);
};
