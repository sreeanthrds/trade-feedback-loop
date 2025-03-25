
import { Node, Edge, Connection, ReactFlowInstance } from '@xyflow/react';
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
  const position = reactFlowInstance.screenToFlowPosition({
    x: (reactFlowWrapper.current?.clientWidth || 800) / 2,
    y: (reactFlowWrapper.current?.clientHeight || 600) / 2,
  });
  
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
  
  return {
    id: `${type}-${Date.now()}`,
    type: type as any,
    position,
    data: defaultData
  };
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
        // Make a deep copy to ensure we're not importing references
        const nodes = JSON.parse(JSON.stringify(imported.nodes));
        const edges = JSON.parse(JSON.stringify(imported.edges));
        
        // Ensure each node has appropriate properties
        const validatedNodes = nodes.map((node: Node) => ({
          ...node,
          id: node.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: node.type || 'default',
          position: node.position || { x: 0, y: 0 },
          data: node.data || {}
        }));
        
        // Ensure each edge has appropriate properties
        const validatedEdges = edges.map((edge: Edge) => ({
          ...edge,
          id: edge.id || `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source || '',
          target: edge.target || ''
        }));
        
        // Only proceed if we have valid connections
        if (validatedEdges.some((edge: Edge) => !edge.source || !edge.target)) {
          toast.error("Invalid edge connections in imported file");
          return;
        }
        
        // Apply the changes
        setNodes(validatedNodes);
        setEdges(validatedEdges);
        resetHistory();
        addHistoryItem(validatedNodes, validatedEdges);
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
