
import { useState } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to manage the node configuration panel state
 */
export function usePanelState() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  return {
    isPanelOpen,
    setIsPanelOpen
  };
}
