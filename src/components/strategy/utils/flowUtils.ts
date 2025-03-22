import { Node, Edge, Connection, ReactFlowInstance, Position, XYPosition } from '@xyflow/react';
import { toast } from 'sonner';

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
  nodes: Node[]
): Node => {
  const position = findOptimalPosition(
    nodes,
    reactFlowInstance,
    reactFlowWrapper
  );
  
  return {
    id: `${type}-${Date.now()}`,
    type: type as any,
    position,
    data: { 
      label: type === 'startNode' 
        ? 'Start' 
        : type === 'endNode' 
          ? 'End' 
          : type === 'forceEndNode'
            ? 'Force End'
            : type === 'signalNode' 
              ? 'Signal' 
              : 'Action'
    }
  };
};

export const addNodeFromConnection = (
  sourceNodeId: string,
  nodeType: string,
  reactFlowInstance: ReactFlowInstance,
  nodes: Node[],
  edges: Edge[]
): { newNode: Node, newEdge: Edge } => {
  const sourceNode = nodes.find(n => n.id === sourceNodeId);
  if (!sourceNode) {
    throw new Error('Source node not found');
  }
  
  const sourcePos = sourceNode.position;
  const nodesBelowSource = nodes.filter(n => 
    n.position.y > sourcePos.y && 
    Math.abs(n.position.x - sourcePos.x) < 200
  );
  
  const verticalSpacing = 100;
  const horizontalOffset = 0;
  
  let lowestY = sourcePos.y;
  nodesBelowSource.forEach(n => {
    if (n.position.y > lowestY) {
      lowestY = n.position.y;
    }
  });
  
  const newPos: XYPosition = {
    x: sourcePos.x + horizontalOffset,
    y: lowestY + verticalSpacing
  };
  
  const newNode: Node = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType as any,
    position: newPos,
    data: { 
      label: nodeType === 'startNode' 
        ? 'Start' 
        : nodeType === 'endNode' 
          ? 'End' 
          : nodeType === 'forceEndNode'
            ? 'Force End'
            : nodeType === 'signalNode' 
              ? 'Signal' 
              : 'Action'
    }
  };
  
  const newEdge: Edge = {
    id: `e-${sourceNodeId}-${newNode.id}`,
    source: sourceNodeId,
    target: newNode.id,
    type: 'default',
    animated: nodeType === 'signalNode'
  };
  
  return { newNode, newEdge };
};

export const findOptimalPosition = (
  nodes: Node[],
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>
): XYPosition => {
  if (nodes.length === 0) {
    return reactFlowInstance.screenToFlowPosition({
      x: (reactFlowWrapper.current?.clientWidth || 800) / 2,
      y: (reactFlowWrapper.current?.clientHeight || 600) / 2,
    });
  }
  
  const nodePositions = nodes.map(n => n.position);
  
  const avgX = nodePositions.reduce((sum, pos) => sum + pos.x, 0) / nodePositions.length;
  const avgY = nodePositions.reduce((sum, pos) => sum + pos.y, 0) / nodePositions.length;
  
  const gridSize = 150;
  
  const gridOffsets = [
    { x: 0, y: -gridSize },
    { x: gridSize, y: 0 },
    { x: 0, y: gridSize },
    { x: -gridSize, y: 0 },
    { x: gridSize, y: -gridSize },
    { x: gridSize, y: gridSize },
    { x: -gridSize, y: gridSize },
    { x: -gridSize, y: -gridSize }
  ];
  
  for (const offset of gridOffsets) {
    const testPos = { x: avgX + offset.x, y: avgY + offset.y };
    
    const isOccupied = nodes.some(node => {
      const nodeWidth = node.width || 150;
      const nodeHeight = node.height || 50;
      
      return (
        Math.abs(testPos.x - node.position.x) < nodeWidth &&
        Math.abs(testPos.y - node.position.y) < nodeHeight
      );
    });
    
    if (!isOccupied) {
      return testPos;
    }
  }
  
  return { x: avgX + gridSize * 2, y: avgY + gridSize * 2 };
};

export const validateConnection = (
  connection: Connection, 
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);
  
  if (sourceNode?.type === 'endNode' || sourceNode?.type === 'forceEndNode') {
    toast.error("End nodes cannot have outgoing connections");
    return false;
  }
  
  if (targetNode?.type === 'startNode') {
    toast.error("Start nodes cannot have incoming connections");
    return false;
  }
  
  return true;
};

export const cleanupOrphanedEdges = (
  nodes: Node[],
  edges: Edge[]
): Edge[] => {
  const validNodeIds = new Set(nodes.map(node => node.id));
  
  return edges.filter(edge => {
    const isSourceValid = validNodeIds.has(edge.source);
    const isTargetValid = validNodeIds.has(edge.target);
    
    return isSourceValid && isTargetValid;
  });
};

export const ensureStartNode = (nodes: Node[]): Node[] => {
  if (nodes.length === 0) {
    return [
      {
        id: `startNode-${Date.now()}`,
        type: 'startNode',
        position: { x: 250, y: 50 },
        data: { label: 'Start' }
      }
    ];
  }
  
  const hasStartNode = nodes.some(node => node.type === 'startNode');
  if (hasStartNode) {
    return nodes;
  }
  
  return [
    ...nodes,
    {
      id: `startNode-${Date.now()}`,
      type: 'startNode',
      position: { x: 250, y: 50 },
      data: { label: 'Start' }
    }
  ];
};

export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  const strategy = { nodes, edges };
  localStorage.setItem('tradyStrategy', JSON.stringify(strategy));
  toast.success("Strategy saved successfully");
};

export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  const savedStrategy = localStorage.getItem('tradyStrategy');
  if (savedStrategy) {
    try {
      return JSON.parse(savedStrategy);
    } catch (error) {
      console.error('Failed to load strategy:', error);
      return null;
    }
  }
  return null;
};

export const exportStrategyToFile = (nodes: Node[], edges: Edge[]) => {
  const strategy = { nodes, edges };
  const blob = new Blob([JSON.stringify(strategy, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trady-strategy-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Strategy exported successfully");
};

export const importStrategyFromEvent = (
  event: React.ChangeEvent<HTMLInputElement>,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  addHistoryItem: (nodes: Node[], edges: Edge[]) => void,
  resetHistory: () => void
): boolean => {
  const file = event.target.files?.[0];
  if (!file) {
    return false;
  }
  
  const reader = new FileReader();
  let success = false;
  
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      if (!result) {
        toast.error("Failed to read file");
        return;
      }
      
      const imported = JSON.parse(result);
      if (imported && imported.nodes && imported.edges) {
        const nodes = JSON.parse(JSON.stringify(imported.nodes));
        const edges = JSON.parse(JSON.stringify(imported.edges));
        
        const validatedNodes = nodes.map((node: Node) => ({
          ...node,
          id: node.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: node.type || 'default',
          position: node.position || { x: 0, y: 0 },
          data: node.data || {}
        }));
        
        const validatedEdges = edges.map((edge: Edge) => ({
          ...edge,
          id: edge.id || `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source || '',
          target: edge.target || ''
        }));
        
        const validNodeIds = new Set(validatedNodes.map((node: Node) => node.id));
        const cleanedEdges = validatedEdges.filter((edge: Edge) => {
          return validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
        });
        
        setNodes(validatedNodes);
        setEdges(cleanedEdges);
        resetHistory();
        addHistoryItem(validatedNodes, cleanedEdges);
        toast.success("Strategy imported successfully");
        success = true;
      } else {
        toast.error("Invalid strategy file format");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to parse strategy file");
    }
  };
  
  reader.readAsText(file);
  return success;
};
