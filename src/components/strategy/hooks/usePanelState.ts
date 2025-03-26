
import { useState, useCallback } from 'react';

/**
 * Hook to manage the node configuration panel state
 */
export function usePanelState() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Memoize the setter to provide a stable reference
  const setPanelOpen = useCallback((isOpen: boolean) => {
    setIsPanelOpen(isOpen);
  }, []);
  
  return {
    isPanelOpen,
    setIsPanelOpen: setPanelOpen
  };
}
