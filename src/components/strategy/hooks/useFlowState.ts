
import { useRef, useMemo, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { useStoreSync } from './useStoreSync';
import { usePanelState } from './usePanelState';

export function useFlowState() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const strategyStore = useStrategyStore();
  const isInitializedRef = useRef(false);
  const onConnectMemoizedRef = useRef(null);
  
  // Node state management
  const {
    nodes,
    setNodes,
    onNodesChange,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  } = useNodeStateManagement(initialNodes, strategyStore);
  
  // Edge state management
  const {
    edges,
    setEdges,
    onEdgesChange,
    onConnect: baseOnConnect
  } = useEdgeStateManagement([], strategyStore);
  
  // Panel state
  const { isPanelOpen, setIsPanelOpen } = usePanelState();
  
  // Sync with localStorage - only run once
  const { isInitialLoadRef } = useLocalStorageSync(
    setNodes,
    setEdges,
    strategyStore,
    initialNodes
  );
  
  // Only sync with store after initial load is complete
  useEffect(() => {
    if (!isInitializedRef.current && reactFlowInstance) {
      isInitializedRef.current = true;
      
      // We delay the store sync to ensure initial load is complete
      const syncTimeout = setTimeout(() => {
        // Use a separate effect for store sync to avoid render-time updates
        useStoreSync(
          nodes,
          edges,
          setNodes,
          setEdges,
          strategyStore,
          isDraggingRef,
          isInitialLoadRef
        );
      }, 1000); // Longer delay for initialization
      
      return () => clearTimeout(syncTimeout);
    }
  }, [reactFlowInstance]);
  
  // Create onConnect handler with nodes that doesn't recreate on every render
  const onConnect = useMemo(() => {
    // Store the current handler in a ref to avoid recreating it constantly
    onConnectMemoizedRef.current = (params) => baseOnConnect(params, nodes);
    return onConnectMemoizedRef.current;
  }, [baseOnConnect, nodes]);

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
