import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { indicatorConfig } from '../indicatorConfig';

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

export const importStrategyFromEvent = (
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
    
    console.log("File selected for import:", file.name);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
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
          
          const strategyId = currentStrategyId || imported.id || `strategy-${Date.now()}`;
          const strategyName = currentStrategyName || imported.name || "Imported Strategy";
          
          console.log(`Importing to strategy: ${strategyId} - ${strategyName}`);
          
          localStorage.removeItem('tradyStrategy');
          console.log("Cleared current working strategy from localStorage");
          
          resetHistory();
          
          setNodes([]);
          setEdges([]);
          
          setTimeout(() => {
            try {
              console.log("Setting validated nodes:", validatedNodes.length);
              setNodes(validatedNodes);
              
              console.log("Setting validated edges:", validatedEdges.length);
              setEdges(validatedEdges);
              
              setTimeout(() => {
                try {
                  console.log(`Saving imported strategy to localStorage with ID: ${strategyId}`);
                  
                  const strategyToSave = {
                    nodes: validatedNodes,
                    edges: validatedEdges,
                    name: strategyName,
                    id: strategyId,
                    lastModified: new Date().toISOString(),
                    created: imported.created || new Date().toISOString(),
                    description: imported.description || "Imported trading strategy"
                  };
                  
                  localStorage.setItem(`strategy_${strategyId}`, JSON.stringify(strategyToSave));
                  localStorage.setItem('tradyStrategy', JSON.stringify(strategyToSave));
                  
                  addHistoryItem(validatedNodes, validatedEdges);
                  
                  updateStrategiesList(strategyToSave);
                  
                  toast({
                    title: "Strategy imported successfully",
                    description: "Your strategy has been loaded"
                  });
                  
                  resolve(true);
                } catch (innerError) {
                  console.error("Error during final import steps:", innerError);
                  resolve(false);
                }
              }, 100);
            } catch (error) {
              console.error("Error applying imported strategy:", error);
              toast({
                title: "Import failed",
                description: "Failed to apply imported strategy",
                variant: "destructive"
              });
              resolve(false);
            }
          }, 100);
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

const updateStrategiesList = (strategyData: any) => {
  let strategies = [];
  try {
    const savedStrategiesList = localStorage.getItem('strategies');
    strategies = savedStrategiesList ? JSON.parse(savedStrategiesList) : [];
  } catch (e) {
    console.error('Failed to parse strategies list:', e);
    strategies = [];
  }
  
  const strategyMetadata = {
    id: strategyData.id,
    name: strategyData.name,
    lastModified: strategyData.lastModified,
    created: strategyData.created,
    description: strategyData.description
  };
  
  const existingIndex = strategies.findIndex((s: any) => s.id === strategyData.id);
  if (existingIndex >= 0) {
    strategies[existingIndex] = strategyMetadata;
    console.log(`Updated existing strategy in list at index ${existingIndex}`);
  } else {
    strategies.push(strategyMetadata);
    console.log(`Added new strategy to list, now contains ${strategies.length} strategies`);
  }
  
  localStorage.setItem('strategies', JSON.stringify(strategies));
  console.log('Saved updated strategies list to localStorage');
};
