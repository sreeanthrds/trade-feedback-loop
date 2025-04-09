
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { indicatorConfig } from '../indicatorConfig';

// Helper function to get a readable display name for an indicator
const getIndicatorDisplayName = (key: string, parameters: Record<string, any>) => {
  // Extract base indicator name (before any underscore)
  const baseName = key.split('_')[0];
  
  // Create a copy of parameters without indicator_name
  const displayParams = { ...parameters };
  delete displayParams.indicator_name;
  
  // Format all parameters into a single, readable string - only values
  const paramList = Object.values(displayParams).join(',');
  
  return `${baseName}(${paramList})`;
};

// Helper function to transform node data for export
const transformNodeForExport = (node: Node) => {
  const transformedNode = { ...node };
  
  // Process indicator data if present
  if (
    transformedNode.data && 
    transformedNode.data.indicatorParameters && 
    transformedNode.data.indicators &&
    Array.isArray(transformedNode.data.indicators)
  ) {
    const indicatorParams = transformedNode.data.indicatorParameters as Record<string, Record<string, any>>;
    
    // Create a mapping of original indicator names to display names
    const indicatorDisplayMap = Object.fromEntries(
      transformedNode.data.indicators.map(indicator => {
        const params = indicatorParams[indicator];
        
        // Add indicator base name to params for backend reference
        const baseName = indicator.split('_')[0];
        if (params) {
          params.indicator_name = baseName;
        }
        
        // Get display name (this won't include the indicator_name we just added)
        const displayName = getIndicatorDisplayName(indicator, params);
        
        return [indicator, displayName];
      })
    );
    
    // Update indicators array with display names
    transformedNode.data.indicators = transformedNode.data.indicators.map(
      indicator => indicatorDisplayMap[indicator] || indicator
    );
  }
  
  return transformedNode;
};

export const exportStrategyToFile = (nodes: Node[], edges: Edge[], strategyName: string = 'Untitled Strategy') => {
  try {
    // Transform nodes to include display names for indicators
    const transformedNodes = nodes.map(transformNodeForExport);
    
    const strategy = { 
      nodes: transformedNodes, 
      edges,
      name: strategyName,
      id: `strategy-${Date.now()}`,
      lastModified: new Date().toISOString(),
      created: new Date().toISOString(),
      description: "Trading strategy created with Trady"
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
    toast.success("Strategy exported successfully");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export strategy");
  }
};

export const importStrategyFromEvent = (
  event: React.ChangeEvent<HTMLInputElement>,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  addHistoryItem: (nodes: Node[], edges: Edge[]) => void,
  resetHistory: () => void
): Promise<boolean> => {
  return new Promise((resolve) => {
    const file = event.target.files?.[0];
    if (!file) {
      resolve(false);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (!result) {
          toast({
            title: "Failed to read file",
            description: "Could not read the uploaded file"
          });
          resolve(false);
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
            toast({
              title: "Invalid file format",
              description: "Invalid edge connections in imported file"
            });
            resolve(false);
            return;
          }
          
          // Clear any existing strategy first
          localStorage.removeItem('tradyStrategy');
          
          // Apply the changes - use a slight delay to ensure proper rendering
          setTimeout(() => {
            // First reset history to avoid any issues with history
            resetHistory();
            
            // Then apply the changes to both local state and store
            setNodes(validatedNodes);
            setEdges(validatedEdges);
            
            // Add this as a new history item
            addHistoryItem(validatedNodes, validatedEdges);
            
            // Also save the imported strategy to localStorage
            if (imported.name && imported.id) {
              localStorage.setItem('tradyStrategy', JSON.stringify({
                nodes: validatedNodes,
                edges: validatedEdges,
                name: imported.name,
                id: imported.id,
                lastModified: new Date().toISOString(),
                created: imported.created || new Date().toISOString(),
                description: imported.description || "Imported trading strategy"
              }));
            }
            
            toast({
              title: "Strategy imported successfully",
              description: "Your strategy has been loaded"
            });
            
            resolve(true);
          }, 100);
        } else {
          toast({
            title: "Invalid file format",
            description: "The file does not contain a valid strategy"
          });
          resolve(false);
        }
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Import failed",
          description: "Failed to parse strategy file"
        });
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the uploaded file"
      });
      resolve(false);
    };
    
    reader.readAsText(file);
  });
};
