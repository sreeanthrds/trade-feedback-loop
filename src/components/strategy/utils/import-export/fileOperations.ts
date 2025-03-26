
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
  
  // Transform indicator names to display names throughout the strategy
  nodesCopy.forEach((node: Node) => {
    if (node.type === 'startNode' && node.data) {
      // Type assertions and safety checks
      const nodeData = node.data as { 
        indicators?: string[]; 
        indicatorParameters?: Record<string, Record<string, any>>; 
      };
      
      if (Array.isArray(nodeData.indicators) && nodeData.indicatorParameters) {
        // Create a new array of indicator display names
        const displayIndicators = nodeData.indicators.map((indicator: string) => 
          getIndicatorDisplayName(indicator, nodeData.indicatorParameters)
        );
        
        // Keep the original indicators array for reference
        node.data.originalIndicators = nodeData.indicators;
        // Replace with display names
        node.data.indicators = displayIndicators;
      }
    }
    
    // Also transform any indicator names in condition nodes
    if ((node.type === 'signalNode' || node.type === 'actionNode') && node.data && node.data.conditions) {
      transformConditionIndicators(node.data.conditions, findIndicatorParameters(nodesCopy));
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

// Helper function to find indicator parameters from the start node
const findIndicatorParameters = (nodes: Node[]): Record<string, Record<string, any>> | undefined => {
  const startNode = nodes.find(node => node.type === 'startNode');
  if (startNode && startNode.data) {
    const nodeData = startNode.data as { indicatorParameters?: Record<string, Record<string, any>> };
    return nodeData.indicatorParameters;
  }
  return undefined;
};

// Recursively transform indicator references in conditions
const transformConditionIndicators = (
  conditions: any, 
  indicatorParameters?: Record<string, Record<string, any>>
) => {
  if (!conditions || !indicatorParameters) return;
  
  // If it's a group condition, process each sub-condition
  if (conditions.groupLogic && Array.isArray(conditions.conditions)) {
    conditions.conditions.forEach((condition: any) => {
      transformConditionIndicators(condition, indicatorParameters);
    });
    return;
  }
  
  // Process individual condition with lhs and rhs
  if (conditions.lhs) {
    transformExpression(conditions.lhs, indicatorParameters);
  }
  
  if (conditions.rhs) {
    transformExpression(conditions.rhs, indicatorParameters);
  }
};

// Transform indicator names in expressions
const transformExpression = (
  expression: any, 
  indicatorParameters: Record<string, Record<string, any>>
) => {
  if (!expression) return;
  
  // If this is an indicator expression
  if (expression.type === 'indicator' && expression.name) {
    // Store original name for import
    expression.originalName = expression.name;
    // Replace with display name
    expression.name = getIndicatorDisplayName(expression.name, indicatorParameters);
  }
  
  // If it's a complex expression with left and right sides, process recursively
  if (expression.type === 'expression') {
    if (expression.left) {
      transformExpression(expression.left, indicatorParameters);
    }
    if (expression.right) {
      transformExpression(expression.right, indicatorParameters);
    }
  }
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
        
        // Restore original indicators in all nodes
        nodes.forEach((node: Node) => {
          // Restore original indicators in start nodes
          if (node.type === 'startNode' && node.data) {
            const nodeData = node.data as { originalIndicators?: string[] };
            if (nodeData.originalIndicators) {
              node.data.indicators = nodeData.originalIndicators;
              delete node.data.originalIndicators;
            }
          }
          
          // Restore original indicator names in condition nodes
          if ((node.type === 'signalNode' || node.type === 'actionNode') && node.data && node.data.conditions) {
            restoreConditionIndicators(node.data.conditions);
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

// Recursively restore original indicator names in conditions
const restoreConditionIndicators = (conditions: any) => {
  if (!conditions) return;
  
  // If it's a group condition, process each sub-condition
  if (conditions.groupLogic && Array.isArray(conditions.conditions)) {
    conditions.conditions.forEach((condition: any) => {
      restoreConditionIndicators(condition);
    });
    return;
  }
  
  // Process individual condition with lhs and rhs
  if (conditions.lhs) {
    restoreExpression(conditions.lhs);
  }
  
  if (conditions.rhs) {
    restoreExpression(conditions.rhs);
  }
};

// Restore original indicator names in expressions
const restoreExpression = (expression: any) => {
  if (!expression) return;
  
  // If this is an indicator expression
  if (expression.type === 'indicator' && expression.originalName) {
    // Restore original name
    expression.name = expression.originalName;
    delete expression.originalName;
  }
  
  // If it's a complex expression with left and right sides, process recursively
  if (expression.type === 'expression') {
    if (expression.left) {
      restoreExpression(expression.left);
    }
    if (expression.right) {
      restoreExpression(expression.right);
    }
  }
};

