
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { UseNodeClickHandlerProps } from './types';

export const useNodeClickHandler = ({
  setSelectedNode,
  setIsPanelOpen
}: UseNodeClickHandlerProps) => {
  // Create stable handler for node click
  return useCallback((event, node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, [setSelectedNode, setIsPanelOpen]);
};
