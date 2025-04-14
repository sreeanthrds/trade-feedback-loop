import { Node } from '@xyflow/react';

/**
 * Handles enabling re-entry for an exit node
 */
export function handleReEntryEnabled(
  node: Node,
  id: string,
  data: any,
  nodes: Node[],
  updateNodeData: (id: string, data: any) => void,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  addToStore: (updatedNodes: Node[], updatedEdges: any[]) => void
): boolean {
  // Default re-entry handling
  updateNodeData(id, data);
  
  console.log(`Re-entry enabled for node ${id}`);
  return true;
}

/**
 * Handles disabling re-entry for an exit node
 */
export function handleReEntryDisabled(
  node: Node,
  id: string,
  data: any,
  edges: any[],
  updateNodeData: (id: string, data: any) => void,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  addToStore: (updatedNodes: Node[], updatedEdges: any[]) => void
): boolean {
  // Default re-entry handling
  updateNodeData(id, data);
  
  console.log(`Re-entry disabled for node ${id}`);
  return true;
}
