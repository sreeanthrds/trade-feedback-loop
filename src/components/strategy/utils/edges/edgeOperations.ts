
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
  nodes: Node[],
  edges: Edge[] = []
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
  
  // ==== 1. Node Relationships & Linking Restrictions ====
  
  // Rule: End nodes cannot have outgoing connections
  if (sourceNode?.type === 'endNode' || sourceNode?.type === 'forceEndNode') {
    toast({
      title: "Invalid connection",
      description: "End nodes cannot have outgoing connections",
      variant: "destructive"
    });
    return false;
  }
  
  // Rule: Start nodes cannot have incoming connections
  if (targetNode?.type === 'startNode') {
    toast({
      title: "Invalid connection",
      description: "Start nodes cannot have incoming connections",
      variant: "destructive"
    });
    return false;
  }
  
  // Rule: Order nodes (entry, exit) shouldn't directly link to each other
  if ((sourceNode?.type === 'entryNode' || sourceNode?.type === 'exitNode') && 
      (targetNode?.type === 'entryNode' || targetNode?.type === 'exitNode')) {
    toast({
      title: "Invalid connection",
      description: "Order nodes cannot directly link to each other",
      variant: "destructive"
    });
    return false;
  }
  
  // Rule: Order nodes should be triggered by only one signal
  // Check if target node is an order node and already has an incoming signal connection
  if ((targetNode?.type === 'entryNode' || targetNode?.type === 'exitNode')) {
    const existingSignalConnections = edges.filter(edge => {
      const existingSource = nodes.find(n => n.id === edge.source);
      return edge.target === targetNode.id && 
             (existingSource?.type === 'signalNode' || existingSource?.type === 'startNode');
    });
    
    if (existingSignalConnections.length > 0 && 
        (sourceNode?.type === 'signalNode' || sourceNode?.type === 'startNode')) {
      toast({
        title: "Invalid connection",
        description: "An order node can only be triggered by one signal",
        variant: "destructive"
      });
      return false;
    }
  }
  
  // ==== 2. Circular Dependency Prevention ====
  
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
  const existingConnection = isConnectionExisting(sourceNode.id, targetNode.id, edges);
  if (existingConnection) {
    toast({
      title: "Connection exists",
      description: "These nodes are already connected",
      variant: "destructive"
    });
    return false;
  }
  
  // Check for circular dependencies
  if (wouldCreateCycle(sourceNode.id, targetNode.id, edges)) {
    toast({
      title: "Invalid connection",
      description: "This would create a circular flow",
      variant: "destructive"
    });
    return false;
  }
  
  // ==== 3. Node Type-Specific Rules ====
  
  // Rule: Entry nodes should only receive connections from Signal or Start nodes
  if (targetNode.type === 'entryNode' && sourceNode.type !== 'signalNode' && sourceNode.type !== 'startNode') {
    toast({
      title: "Invalid connection",
      description: "Entry nodes can only receive connections from Signal or Start nodes",
      variant: "destructive"
    });
    return false;
  }
  
  // ==== 4. Preventing Too Many Connections ====
  
  // Limit the number of outgoing connections from a node for visual clarity
  const outgoingConnections = edges.filter(edge => edge.source === sourceNode.id);
  if (outgoingConnections.length >= 10) { // Adjust this number based on UI considerations
    toast({
      title: "Too many connections",
      description: "A node cannot have more than 10 outgoing connections",
      variant: "default"
    });
    // This is just a warning, not blocking the connection
  }
  
  return true;
};

// Helper function to check if a connection already exists between two nodes
const isConnectionExisting = (sourceId: string, targetId: string, edges: Edge[]): boolean => {
  return edges.some(edge => edge.source === sourceId && edge.target === targetId);
};

// Simple cycle detection algorithm
const wouldCreateCycle = (sourceId: string, targetId: string, edges: Edge[]): boolean => {
  // If we're connecting to a node that's upstream of us, we have a cycle
  if (sourceId === targetId) return true;
  
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
