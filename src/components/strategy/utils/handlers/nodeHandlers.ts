import { Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";
import { NodeFactory } from '../nodes/nodeFactory';
import { createEdgeBetweenNodes } from '../edges';
import { handleError } from '../errorHandling';

type NodeMouseHandler = (event: React.MouseEvent, node: Node) => void;
type ReactFlowInstance = any;

export const createNodeClickHandler = (
  setSelectedNode: (node: Node | null) => void,
  setIsPanelOpen: (isOpen: boolean) => void
): NodeMouseHandler => {
  return (_, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };
};

export const createAddNodeHandler = (
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any
) => {
  return (type: string, parentNodeId?: string) => {
    if (!reactFlowInstance || !reactFlowWrapper.current) {
      console.error('React Flow instance or wrapper not available');
      return;
    }
    
    try {
      const newNode = createNewNode(type, reactFlowInstance, reactFlowWrapper);
      let parentNode = undefined;
      
      if (parentNodeId) {
        parentNode = nodes.find(node => node.id === parentNodeId);
      }
      
      if (!newNode) {
        console.error('Failed to create new node');
        return;
      }
      
      console.log('Before adding node:', nodes.length, 'existing nodes');
      
      const updatedNodes = [...nodes, newNode];
      
      let updatedEdges = [...edges];
      if (parentNode) {
        const newEdge = createEdgeBetweenNodes(parentNode, newNode);
        updatedEdges = [...edges, newEdge];
      }
      
      console.log('After adding node:', updatedNodes.length, 'total nodes');
      
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      
      if (nodes.length <= 1) {
        console.log('First node addition - using immediate store update');
        strategyStore.setNodes(updatedNodes);
        strategyStore.setEdges(updatedEdges);
        strategyStore.addHistoryItem(updatedNodes, updatedEdges);
      } else {
        setTimeout(() => {
          try {
            strategyStore.setNodes(updatedNodes);
            strategyStore.setEdges(updatedEdges);
            strategyStore.addHistoryItem(updatedNodes, updatedEdges);
            console.log('Node added and persisted to store:', newNode.id);
          } catch (error) {
            console.error('Error updating strategy store:', error);
          }
        }, 0);
      }
      
      toast({
        title: "Node added",
        description: `Added ${type.replace('Node', '')} node`
      });
    } catch (error) {
      console.error('Error adding node:', error);
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive"
      });
    }
  };
};

const createNewNode = (
  type: string, 
  reactFlowInstance: ReactFlowInstance, 
  reactFlowWrapper: React.RefObject<HTMLDivElement>
): Node | null => {
  try {
    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    const position = rect 
      ? reactFlowInstance.screenToFlowPosition({
          x: rect.width / 2,
          y: rect.height / 2
        })
      : { x: 100, y: 100 };
    
    const id = `${type.replace('Node', '')}-${uuidv4().substring(0, 6)}`;
    
    return NodeFactory.createNode(id, type, position);
  } catch (error) {
    console.error('Error creating new node:', error);
    return null;
  }
};

export const createUpdateNodeDataHandler = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  strategyStore: any
) => {
  return (id: string, data: any) => {
    if (!nodes || !id || !data) {
      console.error('Invalid parameters for updateNodeData');
      return;
    }
    
    try {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          let mergedData;
          if (data.positions && node.data && node.data.positions) {
            mergedData = { 
              ...node.data, 
              ...data,
              _lastUpdated: Date.now() 
            };
          } else {
            mergedData = { 
              ...node.data, 
              ...data,
              _lastUpdated: Date.now() 
            };
          }
          
          if (node.type === 'startNode' && data.indicatorParameters) {
            mergedData.indicators = Object.keys(data.indicatorParameters);
          }
          
          return { ...node, data: mergedData };
        }
        return node;
      });
      
      setNodes(updatedNodes);
      strategyStore.setNodes(updatedNodes);
      strategyStore.addHistoryItem(updatedNodes, strategyStore.edges);
    } catch (error) {
      console.error('Error updating node data:', error);
    }
  };
};

export const createDeleteNodeHandler = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  strategyStore: any
) => {
  return (nodeId: string) => {
    if (!nodes || !edges || !nodeId) {
      console.error('Invalid parameters for deleteNode');
      return;
    }
    
    try {
      const newNodes = nodes.filter(node => node.id !== nodeId);
      
      const newEdges = edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      );
      
      setNodes(newNodes);
      setEdges(newEdges);
      strategyStore.setNodes(newNodes);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(newNodes, newEdges);
      
      toast({
        title: "Node deleted",
        description: "Node deleted"
      });
    } catch (error) {
      console.error('Error deleting node:', error);
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      });
    }
  };
};
