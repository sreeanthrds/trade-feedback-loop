
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

// Helper function to find an empty position for a new node
const findEmptyPosition = (nodes: Node[], startX: number, startY: number): { x: number, y: number } => {
  // Default grid size
  const gridSize = { width: 180, height: 100 };
  const padding = 20;
  const fullWidth = gridSize.width + padding;
  const fullHeight = gridSize.height + padding;
  
  // Start with the suggested position
  let position = { x: startX, y: startY };
  
  // Create a simple grid system for placing nodes
  const isPositionOccupied = (pos: { x: number, y: number }): boolean => {
    return nodes.some(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      
      // Check if the proposed position overlaps with this node
      return (
        pos.x < nodeX + fullWidth &&
        pos.x + fullWidth > nodeX &&
        pos.y < nodeY + fullHeight &&
        pos.y + fullHeight > nodeY
      );
    });
  };
  
  // If position is already occupied, find a new one
  if (isPositionOccupied(position)) {
    // Try positioning in different areas using a spiral pattern
    const spiralPoints = [];
    const maxRadius = 5; // Maximum number of "rings" to check
    const angleStep = Math.PI / 4; // 45 degrees
    
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
        const x = startX + Math.cos(angle) * radius * fullWidth;
        const y = startY + Math.sin(angle) * radius * fullHeight;
        spiralPoints.push({ x, y });
      }
    }
    
    // Find the first non-occupied position
    const emptyPosition = spiralPoints.find(pos => !isPositionOccupied(pos));
    if (emptyPosition) {
      position = emptyPosition;
    } else {
      // If all positions are occupied, use a position far away
      position = { x: startX + fullWidth * maxRadius, y: startY };
    }
  }
  
  return position;
};

// Find the highest z-index in the existing nodes
const getHighestZIndex = (nodes: Node[]): number => {
  let highestZIndex = 0;
  
  nodes.forEach(node => {
    const nodeZIndex = node.style?.zIndex ? parseInt(node.style.zIndex.toString()) : 0;
    if (nodeZIndex > highestZIndex) {
      highestZIndex = nodeZIndex;
    }
  });
  
  return highestZIndex;
};

export const addNode = (
  type: string, 
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  parentNodeId?: string
): { node: Node, parentNode?: Node } => {
  // Get the suggested center position from the viewport
  const viewportCenter = reactFlowInstance.screenToFlowPosition({
    x: (reactFlowWrapper.current?.clientWidth || 800) / 2,
    y: (reactFlowWrapper.current?.clientHeight || 600) / 2,
  });
  
  let suggestedPosition = { ...viewportCenter };
  const parentNode = parentNodeId ? nodes.find(node => node.id === parentNodeId) : undefined;
  
  // If there's a parent node, suggest a position relative to it
  if (parentNode) {
    suggestedPosition.x = parentNode.position.x + 200;
    suggestedPosition.y = parentNode.position.y + 50;
  }
  
  // Find an empty position based on the suggested one
  const position = findEmptyPosition(nodes, suggestedPosition.x, suggestedPosition.y);
  
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
  
  // Get the highest z-index and increase it by 1
  const highestZIndex = getHighestZIndex(nodes);
  const newZIndex = highestZIndex + 1;
  
  const newNode = {
    id: nodeId,
    type: type as any,
    position,
    data: defaultData,
    style: { zIndex: newZIndex }
  };
  
  console.log('Created new node:', newNode);
  
  return { node: newNode, parentNode };
};
