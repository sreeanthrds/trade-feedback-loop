
import { Node, Edge, Connection } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';

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

export const createNewEdge = (
  sourceId: string,
  targetId: string,
  edgeType: string = 'default'
): Edge => {
  return {
    id: `e-${sourceId}-${targetId}-${nanoid(4)}`,
    source: sourceId,
    target: targetId,
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
  
  return true;
};
