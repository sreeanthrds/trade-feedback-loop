
import { useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useStrategyIdTracking } from './local-storage/useStrategyIdTracking';
import { useSafeFlowSetters } from './local-storage/useSafeFlowSetters';
import { useInitialLocalStorageLoad } from './local-storage/useInitialLocalStorageLoad';
import { useExternalStorageChangeListener } from './local-storage/useExternalStorageChangeListener';

interface UseLocalStorageSyncProps {
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  strategyStore: any;
  initialNodes: Node[];
  currentStrategyId: string;
}

export function useLocalStorageSync({
  setNodes,
  setEdges,
  strategyStore,
  initialNodes,
  currentStrategyId
}: UseLocalStorageSyncProps) {
  // Track if updates are in progress to avoid conflicts
  const isUpdatingFromLocalStorageRef = useRef(false);
  
  // Track strategy ID changes
  const { currentStrategyIdRef, isInitialLoadRef } = useStrategyIdTracking(currentStrategyId);
  
  // Get safe setters for ReactFlow
  const { safeSetNodes, safeSetEdges } = useSafeFlowSetters({ setNodes, setEdges });
  
  // Handle initial load from localStorage
  useInitialLocalStorageLoad({
    setNodes,
    setEdges,
    strategyStore,
    initialNodes,
    currentStrategyId,
    isInitialLoadRef,
    isUpdatingFromLocalStorageRef
  });
  
  // Listen for external changes to localStorage (from another tab or from import)
  useExternalStorageChangeListener({
    setNodes,
    setEdges,
    strategyStore,
    currentStrategyIdRef,
    isUpdatingFromLocalStorageRef
  });

  return { 
    isInitialLoadRef,
    isUpdatingFromLocalStorageRef,
    currentStrategyIdRef
  };
}
