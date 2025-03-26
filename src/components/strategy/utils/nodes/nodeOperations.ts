
import { Node, ReactFlowInstance } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { getIndicatorDisplayName, isIndicatorParameters } from '../indicatorUtils';

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

export const getIndicatorMap = (startNode: Node | undefined): Record<string, string> => {
  if (!startNode || !startNode.data || !startNode.data.indicators) {
    return {};
  }
  
  // Safely handle the case where indicators might not be an array
  const indicators = Array.isArray(startNode.data.indicators) ? startNode.data.indicators : [];
  
  if (!isIndicatorParameters(startNode.data.indicatorParameters)) {
    return indicators.reduce((acc: Record<string, string>, indicator: string) => {
      acc[indicator] = indicator;
      return acc;
    }, {});
  }
  
  const indicatorParameters = startNode.data.indicatorParameters;
  
  return indicators.reduce((acc, indicator) => {
    acc[indicator] = getIndicatorDisplayName(indicator, indicatorParameters);
    return acc;
  }, {} as Record<string, string>);
};
