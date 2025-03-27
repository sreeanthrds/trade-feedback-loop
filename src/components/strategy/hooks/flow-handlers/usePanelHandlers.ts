
import { useCallback } from 'react';
import { Node } from '@xyflow/react';

interface UsePanelHandlersProps {
  setIsPanelOpen: (isOpen: boolean) => void;
  setSelectedNode: (node: Node | null) => void;
}

export const usePanelHandlers = ({
  setIsPanelOpen,
  setSelectedNode
}: UsePanelHandlersProps) => {
  // Create stable handler for closing the panel
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  return {
    closePanel
  };
};
