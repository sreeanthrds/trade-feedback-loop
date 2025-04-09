
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
    
    // Clean up the URL object after download
    URL.revokeObjectURL(url);
    
    // Updated toast implementation
    toast({
      title: "Strategy exported successfully",
      description: "Your strategy has been downloaded as a JSON file"
    });
  } catch (error) {
    console.error("Export error:", error);
    
    // Updated toast implementation
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
          // Make a deep copy to ensure we're not importing references
          console.log(`Found ${imported.nodes.length} nodes and ${imported.edges.length} edges`);
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
            console.error("Invalid edge connections found");
            toast({
              title: "Invalid file format",
              description: "Invalid edge connections in imported file",
              variant: "destructive"
            });
            resolve(false);
            return;
          }
          
          // Use current strategy ID or the imported one
          const strategyId = currentStrategyId || imported.id || `strategy-${Date.now()}`;
          const strategyName = currentStrategyName || imported.name || "Imported Strategy";
          
          console.log(`Importing to strategy: ${strategyId} - ${strategyName}`);
          
          // Clear current working strategy only, not other strategies
          localStorage.removeItem('tradyStrategy');
          console.log("Cleared current working strategy from localStorage");
          
          // Reset history before applying changes to avoid state conflicts
          console.log("Resetting history before applying new strategy");
          resetHistory();
          
          // Apply the changes in a carefully sequenced manner
          // We need to ensure the store is updated correctly to avoid visual glitches
          
          // Step 1: Clear existing nodes and edges (this ensures a clean slate)
          setNodes([]);
          setEdges([]);
          
          // Step 2: Apply the new nodes and edges with a slight delay to ensure the UI has updated
          setTimeout(() => {
            try {
              console.log("Setting validated nodes:", validatedNodes.length);
              // Set nodes first
              setNodes(validatedNodes);
              
              // Step 3: Set edges immediately after to ensure proper connection
              console.log("Setting validated edges:", validatedEdges.length);
              setEdges(validatedEdges);
              
              // Step 4: Save to localStorage and update history
              setTimeout(() => {
                try {
                  console.log(`Saving imported strategy to localStorage with ID: ${strategyId}`);
                  
                  // Create the strategy object for localStorage
                  const strategyToSave = {
                    nodes: validatedNodes,
                    edges: validatedEdges,
                    name: strategyName,
                    id: strategyId,
                    lastModified: new Date().toISOString(),
                    created: imported.created || new Date().toISOString(),
                    description: imported.description || "Imported trading strategy"
                  };
                  
                  // Save as current strategy
                  localStorage.setItem('tradyStrategy', JSON.stringify(strategyToSave));
                  
                  // Also save with ID for persistence
                  localStorage.setItem(`strategy_${strategyId}`, JSON.stringify(strategyToSave));
                  
                  // Step 5: Add to history after everything else is done
                  console.log("Adding imported strategy to history");
                  addHistoryItem(validatedNodes, validatedEdges);
                  
                  // Update strategies list to include this strategy
                  updateStrategiesList(strategyToSave);
                  
                  // Show success message
                  toast({
                    title: "Strategy imported successfully",
                    description: "Your strategy has been loaded"
                  });
                  
                  // Resolve the promise with success
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
          }, 200);
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

/**
 * Update the strategies list in localStorage
 */
const updateStrategiesList = (strategyData: any) => {
  let strategies = [];
  try {
    const savedStrategiesList = localStorage.getItem('strategies');
    strategies = savedStrategiesList ? JSON.parse(savedStrategiesList) : [];
  } catch (e) {
    console.error('Failed to parse strategies list:', e);
    strategies = [];
  }
  
  // Extract metadata for the strategies list
  const strategyMetadata = {
    id: strategyData.id,
    name: strategyData.name,
    lastModified: strategyData.lastModified,
    created: strategyData.created,
    description: strategyData.description
  };
  
  // Check if strategy already exists in the list
  const existingIndex = strategies.findIndex((s: any) => s.id === strategyData.id);
  if (existingIndex >= 0) {
    // Update existing strategy metadata
    strategies[existingIndex] = strategyMetadata;
    console.log(`Updated existing strategy in list at index ${existingIndex}`);
  } else {
    // Add new strategy to list
    strategies.push(strategyMetadata);
    console.log(`Added new strategy to list, now contains ${strategies.length} strategies`);
  }
  
  // Save updated strategies list
  localStorage.setItem('strategies', JSON.stringify(strategies));
  console.log('Saved updated strategies list to localStorage');
};
