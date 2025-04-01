
import { Node, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationWarning {
  type: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

/**
 * Validates the entire workflow for structural issues
 */
export const validateWorkflow = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };
  
  // Find start nodes
  const startNodes = nodes.filter(node => node.type === 'startNode');
  
  // Check if there's at least one start node
  if (startNodes.length === 0) {
    result.valid = false;
    result.errors.push({
      type: 'missing-start',
      message: 'Workflow must have at least one start node'
    });
  }
  
  // Check for disconnected nodes (except start nodes)
  const connectedNodeIds = new Set<string>();
  
  // Add all nodes that have connections
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });
  
  // Find disconnected nodes (excluding start nodes which can be unconnected)
  const disconnectedNodes = nodes.filter(node => 
    node.type !== 'startNode' && !connectedNodeIds.has(node.id)
  );
  
  if (disconnectedNodes.length > 0) {
    result.warnings.push({
      type: 'disconnected-nodes',
      message: `There are ${disconnectedNodes.length} disconnected nodes in the workflow`,
    });
    
    // Add individual warnings for each disconnected node
    disconnectedNodes.forEach(node => {
      result.warnings.push({
        type: 'disconnected-node',
        message: `Node "${node.id}" is not connected to the workflow`,
        nodeId: node.id
      });
    });
  }
  
  // Check for nodes without outgoing edges (terminal nodes)
  // Only end nodes and forceEnd nodes should be terminal
  const nodesWithoutOutgoing = findNodesWithoutOutgoingEdges(nodes, edges);
  const invalidTerminalNodes = nodesWithoutOutgoing.filter(
    node => node.type !== 'endNode' && node.type !== 'forceEndNode'
  );
  
  if (invalidTerminalNodes.length > 0) {
    invalidTerminalNodes.forEach(node => {
      result.warnings.push({
        type: 'invalid-terminal',
        message: `Node "${node.id}" has no outgoing connections but is not an end node`,
        nodeId: node.id
      });
    });
  }
  
  // Check that each path from start eventually reaches an end node
  const pathsToEnd = checkPathsToEndNodes(nodes, edges);
  if (!pathsToEnd.allPathsEndProperly) {
    result.errors.push({
      type: 'incomplete-path',
      message: 'Not all paths in the workflow lead to an end node'
    });
    
    pathsToEnd.nodesWithoutPathToEnd.forEach(nodeId => {
      result.errors.push({
        type: 'no-path-to-end',
        message: `Node "${nodeId}" doesn't have a path to an end node`,
        nodeId
      });
    });
  }
  
  // Check for node-specific validation requirements
  const nodeValidationIssues = validateNodeData(nodes);
  result.errors.push(...nodeValidationIssues.errors);
  result.warnings.push(...nodeValidationIssues.warnings);
  
  // Update overall validity based on errors
  if (result.errors.length > 0) {
    result.valid = false;
  }
  
  return result;
};

/**
 * Finds nodes that don't have any outgoing edges
 */
const findNodesWithoutOutgoingEdges = (nodes: Node[], edges: Edge[]): Node[] => {
  const nodesWithOutgoing = new Set<string>();
  
  // Find all nodes that have outgoing edges
  edges.forEach(edge => {
    nodesWithOutgoing.add(edge.source);
  });
  
  // Return nodes that don't have outgoing edges
  return nodes.filter(node => !nodesWithOutgoing.has(node.id));
};

/**
 * Checks if all paths from start nodes eventually reach an end node
 */
const checkPathsToEndNodes = (nodes: Node[], edges: Edge[]) => {
  const result = {
    allPathsEndProperly: true,
    nodesWithoutPathToEnd: [] as string[]
  };
  
  // Create an adjacency list representation of the graph
  const graph: Record<string, string[]> = {};
  nodes.forEach(node => {
    graph[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });
  
  // Find all end nodes
  const endNodeIds = new Set(
    nodes
      .filter(node => node.type === 'endNode' || node.type === 'forceEndNode')
      .map(node => node.id)
  );
  
  // If there are no end nodes, mark all nodes as not having a path to end
  if (endNodeIds.size === 0) {
    result.allPathsEndProperly = false;
    result.nodesWithoutPathToEnd = nodes.map(node => node.id);
    return result;
  }
  
  // For each node, check if there's a path to an end node
  nodes.forEach(node => {
    if (node.type !== 'endNode' && node.type !== 'forceEndNode') {
      const visited = new Set<string>();
      const hasPathToEnd = checkPathToEnd(node.id, graph, endNodeIds, visited);
      
      if (!hasPathToEnd) {
        result.allPathsEndProperly = false;
        result.nodesWithoutPathToEnd.push(node.id);
      }
    }
  });
  
  return result;
};

/**
 * Recursive DFS to check if there's a path from start to any end node
 */
const checkPathToEnd = (
  nodeId: string, 
  graph: Record<string, string[]>, 
  endNodeIds: Set<string>,
  visited: Set<string>
): boolean => {
  // If we've already visited this node in this path, return false to avoid cycles
  if (visited.has(nodeId)) return false;
  
  // If this is an end node, we found a path
  if (endNodeIds.has(nodeId)) return true;
  
  // Mark node as visited
  visited.add(nodeId);
  
  // Check all neighbors
  for (const neighbor of graph[nodeId] || []) {
    if (checkPathToEnd(neighbor, graph, endNodeIds, visited)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Validates node-specific data requirements
 */
const validateNodeData = (nodes: Node[]): { errors: ValidationError[], warnings: ValidationWarning[] } => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  nodes.forEach(node => {
    // Start node validations
    if (node.type === 'startNode') {
      if (!node.data?.symbol) {
        errors.push({
          type: 'missing-data',
          message: 'Start node is missing a symbol',
          nodeId: node.id
        });
      }
      
      if (node.data?.indicators && Array.isArray(node.data.indicators) && node.data.indicators.length === 0) {
        warnings.push({
          type: 'missing-indicators',
          message: 'Start node has no indicators configured',
          nodeId: node.id
        });
      }
    }
    
    // Signal node validations
    if (node.type === 'signalNode') {
      if (!node.data?.conditions || (Array.isArray(node.data.conditions) && node.data.conditions.length === 0)) {
        errors.push({
          type: 'missing-conditions',
          message: 'Signal node has no conditions configured',
          nodeId: node.id
        });
      }
    }
    
    // Action node validations (entry/exit)
    if (node.type === 'entryNode') {
      if (!node.data?.actionType) {
        errors.push({
          type: 'missing-action-type',
          message: 'Entry node is missing an action type',
          nodeId: node.id
        });
      }
    }
    
    if (node.type === 'exitNode') {
      if (!node.data?.exitCondition) {
        errors.push({
          type: 'missing-exit-condition',
          message: 'Exit node is missing an exit condition',
          nodeId: node.id
        });
      }
    }
  });
  
  return { errors, warnings };
};

/**
 * Shows validation results to the user as toast notifications
 */
export const showValidationResults = (results: ValidationResult): void => {
  if (results.valid) {
    toast({
      title: "Validation successful",
      description: "Your strategy workflow is valid",
      variant: "default"
    });
    return;
  }
  
  // Show errors
  if (results.errors.length > 0) {
    toast({
      title: `Strategy has ${results.errors.length} error${results.errors.length === 1 ? '' : 's'}`,
      description: results.errors[0].message,
      variant: "destructive"
    });
  }
  
  // Show warnings
  if (results.warnings.length > 0) {
    toast({
      title: `Strategy has ${results.warnings.length} warning${results.warnings.length === 1 ? '' : 's'}`,
      description: results.warnings[0].message,
      variant: "default"  // Changed from "warning" to "default"
    });
  }
};

/**
 * Validates a workflow and returns a promise that resolves to the validation result
 */
export const validateWorkflowAsync = async (nodes: Node[], edges: Edge[]): Promise<ValidationResult> => {
  // We can add more complex async validation logic here if needed
  return validateWorkflow(nodes, edges);
};
