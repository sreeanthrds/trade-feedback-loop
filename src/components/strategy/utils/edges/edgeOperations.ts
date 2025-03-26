
import { Node, Edge, Connection } from '@xyflow/react';
import { toast } from 'sonner';

export const createEdgeBetweenNodes = (
  sourceNode: Node,
  targetNode: Node,
  edgeType: string = 'default'
): Edge => {
  return {
    id: `e-${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
    type: edgeType,
    animated: true
  };
};

export const validateConnection = (
  connection: Connection, 
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);
  
  if (sourceNode?.type === 'endNode' || sourceNode?.type === 'forceEndNode') {
    toast.error("End nodes cannot have outgoing connections");
    return false;
  }
  
  if (targetNode?.type === 'startNode') {
    toast.error("Start nodes cannot have incoming connections");
    return false;
  }
  
  return true;
};
