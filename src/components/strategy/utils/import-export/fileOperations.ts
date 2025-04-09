
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { indicatorConfig } from '../indicatorConfig';
import { saveStrategyToLocalStorage } from '../storage/operations/saveStrategy';

const getIndicatorDisplayName = (key: string, parameters: Record<string, any>) => {
  const baseName = key.split('_')[0];
  const displayParams = { ...parameters };
  delete displayParams.indicator_name;
  const paramList = Object.values(displayParams).join(',');
  return `${baseName}(${paramList})`;
};

const transformNodeForExport = (node: Node) => {
  const transformedNode = { ...node };
  
  if (
    transformedNode.data && 
    transformedNode.data.indicatorParameters && 
    transformedNode.data.indicators &&
    Array.isArray(transformedNode.data.indicators)
  ) {
    const indicatorParams = transformedNode.data.indicatorParameters as Record<string, Record<string, any>>;
    
    const indicatorDisplayMap = Object.fromEntries(
      transformedNode.data.indicators.map(indicator => {
        const params = indicatorParams[indicator];
        
        const baseName = indicator.split('_')[0];
        if (params) {
          params.indicator_name = baseName;
        }
        
        const displayName = getIndicatorDisplayName(indicator, params);
        
        return [indicator, displayName];
      })
    );
    
    transformedNode.data.indicators = transformedNode.data.indicators.map(
      indicator => indicatorDisplayMap[indicator] || indicator
    );
  }
  
  return transformedNode;
};

export const exportStrategyToFile = (nodes: Node[], edges: Edge[], strategyName: string = 'Untitled Strategy') => {
  try {
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
    
    toast({
      title: "Strategy exported successfully",
      description: "Your strategy has been downloaded as a JSON file"
    });
  } catch (error) {
    console.error("Export error:", error);
    
    toast({
      title: "Failed to export strategy",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
  }
};

export const importStrategyFromEvent = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  addHistoryItem: (nodes: Node[], edges: Edge[]) => void,
  resetHistory: () => void,
  currentStrategyId?: string | null,
  currentStrategyName?: string | null
): Promise<boolean> => {
  return new Promise((resolve) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected for import");
      toast({
        title: "Import failed",
        description: "No file was selected",
        variant: "destructive"
      });
      resolve(false);
      return;
    }
    
    if (!currentStrategyId) {
      console.error("Cannot import strategy without target strategy ID");
      toast({
        title: "Import failed",
        description: "Strategy context is missing",
        variant: "destructive"
      });
      resolve(false);
      return;
    }
    
    console.log("File selected for import:", file.name);
    console.log(`Importing to strategy ID: ${currentStrategyId} - ${currentStrategyName || 'Unnamed'}`);
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const result = e.target?.result as string;
        if (!result) {
          console.error("FileReader result is empty");
          toast({
            title: "Failed to read file",
            description: "Could not read the uploaded file",
            variant: "destructive"
          });
          resolve(false);
          return;
        }
        
        console.log("File content loaded, attempting to parse JSON");
        const imported = JSON.parse(result);
        
        if (!imported) {
          console.error("Parsed result is null or undefined");
          toast({
            title: "Invalid file format",
            description: "The file does not contain valid JSON",
            variant: "destructive"
          });
          resolve(false);
          return;
        }
        
        console.log("Checking for nodes and edges in imported data");
        if (imported.nodes && imported.edges) {
          console.log(`Found ${imported.nodes.length} nodes and ${imported.edges.length} edges`);
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
            target: edge.target || '',
            type: edge.type || 'default'
          }));
          
          if (validatedEdges.some((edge: Edge) => !edge.source || !edge.target)) {
            console.error("Invalid edge connections found");
            toast({
              title: "Invalid file format",
              description: "Invalid edge connections in imported file",
              variant: "destructive"
            });
            resolve(false);
            return;
          }
          
          // Use the current strategy ID and name for isolation
          const strategyId = currentStrategyId;
          const strategyName = currentStrategyName || imported.name || "Imported Strategy";
          
          // CRITICAL: First completely remove the existing strategy data
          console.log(`Removing existing strategy data for ID: ${strategyId}`);
          localStorage.removeItem(`strategy_${strategyId}`);
          
          // Then save the imported strategy directly to localStorage with the current ID
          console.log(`Saving imported strategy directly to localStorage with ID: ${strategyId}`);
          saveStrategyToLocalStorage(validatedNodes, validatedEdges, strategyId, strategyName);
          
          // Now clear existing app state before setting new nodes and edges
          console.log("Clearing existing nodes and edges before setting new ones");
          setNodes([]);
          await new Promise(r => setTimeout(r, 100));
          setEdges([]);
          await new Promise(r => setTimeout(r, 100));
          
          // Reset history for this specific strategy
          resetHistory();
          
          // Wait for changes to propagate
          await new Promise(r => setTimeout(r, 200));
          
          // Set the new nodes and edges
          console.log(`Setting ${validatedNodes.length} nodes and ${validatedEdges.length} edges`);
          setNodes(validatedNodes);
          await new Promise(r => setTimeout(r, 100));
          setEdges(validatedEdges);
          
          // Add to history after a delay
          setTimeout(() => {
            try {
              console.log("Adding imported strategy to history");
              addHistoryItem(validatedNodes, validatedEdges);
              
              toast({
                title: "Strategy imported successfully",
                description: `Strategy imported as "${strategyName}"`
              });
              
              // Force reload the strategy by triggering a storage event
              // This ensures all components update consistently
              window.dispatchEvent(new StorageEvent('storage', {
                key: `strategy_${strategyId}`,
                newValue: localStorage.getItem(`strategy_${strategyId}`)
              }));
              
              resolve(true);
            } catch (e) {
              console.error("Error in final import steps:", e);
              resolve(false);
            }
          }, 300);
        } else {
          console.error("Missing nodes or edges in imported data", imported);
          toast({
            title: "Invalid file format",
            description: "The file does not contain a valid strategy",
            variant: "destructive"
          });
          resolve(false);
        }
      } catch (error) {
        console.error("Import parsing error:", error);
        toast({
          title: "Import failed",
          description: "Failed to parse strategy file",
          variant: "destructive"
        });
        resolve(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast({
        title: "Error reading file",
        description: "Could not read the uploaded file",
        variant: "destructive"
      });
      resolve(false);
    };
    
    reader.readAsText(file);
  });
};
