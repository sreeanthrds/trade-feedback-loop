
import { useRef, useMemo, useCallback } from 'react';
import { useReactFlow, Node as ReactFlowNode, Edge, useStore } from '@xyflow/react';
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
  
  // Create onConnect handler with nodes - use useCallback to memoize
  const onConnect = useCallback((params) => {
    // Use the current nodes from the store to prevent stale closures
    const currentNodes = useStore.getState().nodes;
    baseOnConnect(params, currentNodes as ReactFlowNode[]);
  }, [baseOnConnect]);

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
