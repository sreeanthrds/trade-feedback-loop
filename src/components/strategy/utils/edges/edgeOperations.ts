
import { Node, Edge, Connection } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export const createEdgeBetweenNodes = (
  sourceNode: Node,
  targetNode: Node,
  edgeType: string = 'bezier'
): Edge => {
  return {
    id: `e-${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
    type: edgeType
    // Removed animated property
  };
};

export const validateConnection = (
  connection: Connection, 
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);
  
  // Validate source node rules
  if (!sourceNode || !targetNode) {
    toast({
      title: "Invalid connection",
      description: "Source or target node not found",
      variant: "destructive"
    });
    return false;
  }
  
  if (sourceNode?.type === 'endNode' || sourceNode?.type === 'forceEndNode') {
    toast({
      title: "Invalid connection",
      description: "End nodes cannot have outgoing connections",
      variant: "destructive"
    });
    return false;
  }
  
  if (targetNode?.type === 'startNode') {
    toast({
      title: "Invalid connection",
      description: "Start nodes cannot have incoming connections",
      variant: "destructive"
    });
    return false;
  }
  
  // Prevent self-connections
  if (sourceNode.id === targetNode.id) {
    toast({
      title: "Invalid connection",
      description: "Cannot connect a node to itself",
      variant: "destructive"
    });
    return false;
  }
  
  // Check for existing connections between these nodes
  const existingConnection = isConnectionExisting(sourceNode.id, targetNode.id, nodes);
  if (existingConnection) {
    toast({
      title: "Connection exists",
      description: "These nodes are already connected",
      variant: "destructive"
    });
    return false;
  }
  
  // Check for circular dependencies (simplified version)
  if (wouldCreateCycle(sourceNode.id, targetNode.id, nodes)) {
    toast({
      title: "Invalid connection",
      description: "This would create a circular flow",
      variant: "destructive"
    });
    return false;
  }
  
  // Node type-specific connection rules
  if (targetNode.type === 'entryNode' && sourceNode.type !== 'signalNode' && sourceNode.type !== 'startNode') {
    toast({
      title: "Invalid connection",
      description: "Entry nodes can only receive connections from Signal or Start nodes",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};

// Helper function to check if a connection already exists between two nodes
const isConnectionExisting = (sourceId: string, targetId: string, nodes: Node[]): boolean => {
  for (const node of nodes) {
    if (node.__rf?.edges) {
      for (const edge of node.__rf.edges) {
        if (edge.source === sourceId && edge.target === targetId) {
          return true;
        }
      }
    }
  }
  return false;
};

// Simple cycle detection algorithm
const wouldCreateCycle = (sourceId: string, targetId: string, nodes: Node[]): boolean => {
  // If we're connecting to a node that's upstream of us, we have a cycle
  // This is a simplified version - we would need a more robust graph traversal for complex cases
  if (sourceId === targetId) return true;
  
  // Get all edges from the nodes' internal ReactFlow state
  const edges: Edge[] = [];
  nodes.forEach(node => {
    if (node.__rf?.edges) {
      edges.push(...node.__rf.edges);
    }
  });
  
  // Check if target leads back to source
  const visited = new Set<string>();
  
  const checkPathExists = (currentId: string, endId: string): boolean => {
    if (currentId === endId) return true;
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    
    // Find all outgoing edges from current node
    const outgoingEdges = edges.filter(e => e.source === currentId);
    
    // Check if any of the target nodes lead to our end node
    for (const edge of outgoingEdges) {
      if (checkPathExists(edge.target, endId)) {
        return true;
      }
    }
    
    return false;
  };
  
  return checkPathExists(targetId, sourceId);
};
