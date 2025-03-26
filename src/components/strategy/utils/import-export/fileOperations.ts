import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

const getIndicatorDisplayName = (key: string, indicatorParameters?: Record<string, Record<string, any>>) => {
  if (!indicatorParameters) return key;
  
  // Extract base indicator name (before any underscore)
  const baseName = key.split('_')[0];
  
  // If we have parameters for this indicator
  if (indicatorParameters[key]) {
    const params = indicatorParameters[key];
    
    // Format all parameters into a single, readable string - only values
    const paramList = Object.values(params).join(',');
    
    return `${baseName}(${paramList})`;
  }
  
  return key;
};

export const exportStrategyToFile = (nodes: Node[], edges: Edge[]) => {
  // Create a deep copy of nodes to modify
  const nodesCopy = JSON.parse(JSON.stringify(nodes));
  
  // Transform indicator names to display names in start nodes
  nodesCopy.forEach((node: Node) => {
    if (node.type === 'startNode' && node.data.indicators && node.data.indicatorParameters) {
      // Create a new array of indicator display names
      const displayIndicators = node.data.indicators.map((indicator: string) => 
        getIndicatorDisplayName(indicator, node.data.indicatorParameters)
      );
      
      // Keep the original indicators array for reference
      node.data.originalIndicators = node.data.indicators;
      // Replace with display names
      node.data.indicators = displayIndicators;
    }
  });
  
  const strategy = { nodes: nodesCopy, edges };
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
        
        // Restore original indicators if present
        nodes.forEach((node: Node) => {
          if (node.type === 'startNode' && node.data.originalIndicators) {
            node.data.indicators = node.data.originalIndicators;
            delete node.data.originalIndicators;
          }
        });
        
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
