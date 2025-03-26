
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { getIndicatorDisplayNames } from '../indicatorUtils';

export const exportStrategyToFile = (nodes: Node[], edges: Edge[]) => {
  // Get the start node to access indicator parameters
  const startNode = nodes.find(node => node.type === 'startNode');
  let indicatorDisplayNames = {};
  
  if (startNode && startNode.data.indicators && startNode.data.indicatorParameters) {
    indicatorDisplayNames = getIndicatorDisplayNames(
      startNode.data.indicators, 
      startNode.data.indicatorParameters
    );
  }
  
  // Create a strategy object with nodes, edges, and indicator display names
  const strategy = { 
    nodes, 
    edges,
    metadata: {
      indicatorDisplayNames
    }
  };
  
  const blob = new Blob([JSON.stringify(strategy, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trady-strategy-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast({
    title: "Success",
    description: "Strategy exported successfully"
  });
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
          target: edge.target || '',
          type: edge.type || 'default' // Make sure edge type is preserved
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
