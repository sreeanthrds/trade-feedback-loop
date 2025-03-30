
import { useRef } from 'react';
import { Node as ReactFlowNode, Edge } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { useStoreSync } from './useStoreSync';
import { usePanelState } from './usePanelState';
import { useReactFlowSafe } from './useReactFlowSafe';

export function useFlowState() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const strategyStore = useStrategyStore();
  
  // Get React Flow instance safely
  const { reactFlowInstance, isReactFlowReady } = useReactFlowSafe();
  
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
    onConnect
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
