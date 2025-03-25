
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
  const isInitialLoad = useRef(true);
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<Node[] | null>(null);

  // Initial load from localStorage - only run once
  useEffect(() => {
    if (isInitialLoad.current) {
      const savedStrategy = loadStrategyFromLocalStorage();
      if (savedStrategy) {
        setNodes(savedStrategy.nodes);
        setEdges(savedStrategy.edges);
        strategyStore.setNodes(savedStrategy.nodes);
        strategyStore.setEdges(savedStrategy.edges);
      } else {
        strategyStore.setNodes(initialNodes);
        strategyStore.resetHistory();
        strategyStore.addHistoryItem(initialNodes, []);
      }
      isInitialLoad.current = false;
    }
  }, []);

  // Detect when node dragging starts and ends
  const onNodesChangeWithDragDetection = useCallback((changes) => {
    // Detect drag operations
    const dragChange = changes.find(change => 
      change.type === 'position' || 
      change.type === 'dimensions'
    );
    
    if (dragChange) {
      if (dragChange.dragging) {
        isDraggingRef.current = true;
      } else if (isDraggingRef.current && !dragChange.dragging) {
        // Drag ended, apply the pending update
        isDraggingRef.current = false;
        if (pendingNodesUpdate.current) {
          strategyStore.setNodes(pendingNodesUpdate.current);
          strategyStore.addHistoryItem(pendingNodesUpdate.current, strategyStore.edges);
          pendingNodesUpdate.current = null;
        }
      }
    }
    
    // Always apply the changes to nodes
    onNodesChange(changes);
  }, [onNodesChange, strategyStore]);

  // Custom setNodes wrapper to ensure both local state and store are updated
  // But throttle updates to the store during node drag operations
  const setNodesAndStore = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // Handle both functional and direct updates
    if (typeof updatedNodes === 'function') {
      setNodes((prevNodes) => {
        const newNodes = updatedNodes(prevNodes);
        
        // Only update store if not currently dragging
        if (!isDraggingRef.current) {
          strategyStore.setNodes(newNodes);
        } else {
          // Store the update to apply when dragging ends
          pendingNodesUpdate.current = newNodes;
        }
        
        return newNodes;
      });
    } else {
      setNodes(updatedNodes);
      
      // Only update store if not currently dragging
      if (!isDraggingRef.current) {
        strategyStore.setNodes(updatedNodes);
      } else {
        // Store the update to apply when dragging ends
        pendingNodesUpdate.current = updatedNodes;
      }
    }
  }, [setNodes, strategyStore]);

  // Sync nodes from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    if (isDraggingRef.current) return; // Skip updates during dragging
    
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && 
        JSON.stringify(storeNodes.map(n => ({ id: n.id, type: n.type, data: n.data }))) !== 
        JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, data: n.data })))) {
      setNodes(storeNodes);
    }
  }, [strategyStore.nodes, setNodes, nodes]);

  // Sync edges from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeEdges = strategyStore.edges;
    if (JSON.stringify(storeEdges) !== JSON.stringify(edges)) {
      setEdges(storeEdges);
    }
  }, [strategyStore.edges, setEdges, edges]);

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
    onNodesChange: onNodesChangeWithDragDetection,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    setNodes: setNodesAndStore, // Use the wrapped version
    setEdges,
    strategyStore
  };
}
