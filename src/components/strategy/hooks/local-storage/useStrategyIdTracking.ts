
import { useEffect, useRef } from 'react';

export function useStrategyIdTracking(currentStrategyId: string) {
  const currentStrategyIdRef = useRef(currentStrategyId);
  const isInitialLoadRef = useRef(true);
  
  // Update the ref when the strategy ID changes
  useEffect(() => {
    if (currentStrategyId !== currentStrategyIdRef.current) {
      console.log(`Strategy ID changed from ${currentStrategyIdRef.current} to ${currentStrategyId}`);
      isInitialLoadRef.current = true; // Reset to trigger loading the new strategy
      currentStrategyIdRef.current = currentStrategyId;
    }
  }, [currentStrategyId]);

  return {
    currentStrategyIdRef,
    isInitialLoadRef
  };
}
