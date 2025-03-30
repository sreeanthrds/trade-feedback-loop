
import { useState, useCallback, useRef } from 'react';

/**
 * Hook to manage the node configuration panel state
 * with immediate updates
 */
export function usePanelState() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Use a stable reference for the setter to avoid unnecessary rerenders
  const setIsPanelOpenStable = useCallback((isOpen: boolean) => {
    setIsPanelOpen(isOpen);
  }, []);
  
  return {
    isPanelOpen,
    setIsPanelOpen: setIsPanelOpenStable
  };
}
