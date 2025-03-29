
import { useState, useCallback } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to manage the node configuration panel state
 * with immediate updates
 */
export function usePanelState() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Use a stable reference for the setter to avoid unnecessary rerenders
  const setIsPanelOpenStable = useCallback((isOpen: boolean) => {
    setIsPanelOpen(isOpen);
  }, []);
  
  const setSelectedNodeStable = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);
  
  return {
    isPanelOpen,
    selectedNode,
    setIsPanelOpen: setIsPanelOpenStable,
    setSelectedNode: setSelectedNodeStable
  };
}
