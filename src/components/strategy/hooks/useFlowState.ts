
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge, 
  Connection, 
  addEdge,
  useReactFlow
} from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes, validateConnection, loadStrategyFromLocalStorage } from '../utils/flowUtils';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  const strategyStore = useStrategyStore();

  // Initial load from localStorage - only run once
  useEffect(() => {
    const savedStrategy = loadStrategyFromLocalStorage();
    if (savedStrategy) {
      // Ensure nodes have valid data property
      const validNodes = savedStrategy.nodes.map(node => ({
        ...node,
        data: node.data || {} // Ensure data is at least an empty object
      }));
      
      setNodes(validNodes);
      setEdges(savedStrategy.edges);
      strategyStore.setNodes(validNodes);
      strategyStore.setEdges(savedStrategy.edges);
    } else {
      // Ensure initialNodes have valid data property
      const validInitialNodes = initialNodes.map(node => ({
        ...node,
        data: node.data || {} // Ensure data is at least an empty object
      }));
      
      strategyStore.setNodes(validInitialNodes);
      strategyStore.resetHistory();
      strategyStore.addHistoryItem(validInitialNodes, []);
    }
  }, []);

  // Sync nodes from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && JSON.stringify(storeNodes) !== JSON.stringify(nodes)) {
      // Ensure all nodes have valid data property
      const validNodes = storeNodes.map(node => ({
        ...node,
        data: node.data || {} // Ensure data is at least an empty object
      }));
      
      setNodes(validNodes);
      
      // Update selectedNode if it's in the nodes list
      if (selectedNode) {
        const updatedSelectedNode = validNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode && JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)) {
          setSelectedNode(updatedSelectedNode);
        }
      }
    }
  }, [strategyStore.nodes, nodes, selectedNode]);

  // Sync edges from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeEdges = strategyStore.edges;
    if (JSON.stringify(storeEdges) !== JSON.stringify(edges)) {
      setEdges(storeEdges);
    }
  }, [strategyStore.edges, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(nodes, newEdges);
    },
    [nodes, edges, setEdges, strategyStore]
  );

  return {
    nodes,
    edges,
    selectedNode,
    isPanelOpen,
    reactFlowWrapper,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  };
}
