
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useReactFlow, Node as ReactFlowNode, Edge } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { useStoreSync } from './useStoreSync';
import { usePanelState } from './usePanelState';

export function useFlowState() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const isReactFlowReadyRef = useRef(false);
  const [isReactFlowReady, setIsReactFlowReady] = useState(false);
  
  // Get React Flow instance safely
  let reactFlowInstance;
  try {
    reactFlowInstance = useReactFlow();
    if (!isReactFlowReady && reactFlowInstance) {
      setIsReactFlowReady(true);
      isReactFlowReadyRef.current = true;
    }
  } catch (error) {
    // Handle the case where useReactFlow is called outside of provider
    console.warn('ReactFlow provider not ready yet');
  }
  
  const strategyStore = useStrategyStore();
  
  // Node state management
  const {
    nodes,
    setNodes,
    onNodesChange,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  } = useNodeStateManagement(initialNodes, strategyStore);
  
  // Edge state management - pass empty array directly to avoid useState error
  const {
    edges,
    setEdges,
    onEdgesChange,
    onConnect: baseOnConnect
  } = useEdgeStateManagement([], strategyStore);
  
  // Panel state
  const { isPanelOpen, setIsPanelOpen } = usePanelState();
  
  // Sync with localStorage
  const { isInitialLoadRef } = useLocalStorageSync(
    setNodes,
    setEdges,
    strategyStore,
    initialNodes
  );
  
  // Use a separate hook for store sync to avoid render-time updates
  useStoreSync(
    nodes,
    edges,
    setNodes,
    setEdges,
    strategyStore,
    isDraggingRef,
    isInitialLoadRef
  );
  
  // Create onConnect handler with nodes - use useCallback to memoize
  const onConnect = useCallback((params) => {
    if (baseOnConnect) {
      baseOnConnect(params, nodes);
    }
  }, [baseOnConnect, nodes]);

  // Effect to initialize React Flow after the provider is available
  useEffect(() => {
    if (isReactFlowReady && !isReactFlowReadyRef.current) {
      isReactFlowReadyRef.current = true;
    }
  }, [isReactFlowReady]);

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
    strategyStore,
    isReactFlowReady
  };
}
