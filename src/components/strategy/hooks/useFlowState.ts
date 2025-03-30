
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
  const isReactFlowInitializedRef = useRef(false);
  const [isReactFlowReady, setIsReactFlowReady] = useState(false);
  
  // Safe React Flow instance reference
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Get React Flow instance safely
  useEffect(() => {
    // Only attempt to get the React Flow instance if not already initialized
    if (isReactFlowInitializedRef.current) return;
    
    try {
      const instance = useReactFlow();
      if (instance) {
        setReactFlowInstance(instance);
        isReactFlowInitializedRef.current = true;
        
        // Use setTimeout to break the render cycle
        setTimeout(() => {
          setIsReactFlowReady(true);
        }, 0);
      }
    } catch (error) {
      // Handle the case where useReactFlow is called outside of provider
      console.warn('ReactFlow provider not ready yet');
    }
  }, []);
  
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
  
  // Sync with localStorage - but only if React Flow is ready
  const { isInitialLoadRef } = useLocalStorageSync(
    setNodes,
    setEdges,
    strategyStore,
    initialNodes
  );
  
  // Use a separate hook for store sync to avoid render-time updates
  // Only enable store sync if React Flow is ready
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
