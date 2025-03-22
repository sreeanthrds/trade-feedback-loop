
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
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.nodes && imported.edges) {
          setNodes(imported.nodes);
          setEdges(imported.edges);
          resetHistory();
          addHistoryItem(imported.nodes, imported.edges);
          toast.success("Strategy imported successfully");
        } else {
          toast.error("Invalid strategy file format");
        }
      } catch (error) {
        toast.error("Failed to parse strategy file");
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
};
