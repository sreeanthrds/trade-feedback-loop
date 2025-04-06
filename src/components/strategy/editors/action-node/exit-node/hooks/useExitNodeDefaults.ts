
import { useMemo } from 'react';
import { 
  ExitOrderType, 
  ExitNodeData,
  ReEntryConfig
} from '../types';

/**
 * Hook to create default exit node data structure
 */
export const useExitNodeDefaults = () => {
  // Default exit node data - memoized to avoid recreation on each render
  const defaultExitNodeData = useMemo<ExitNodeData>(() => ({
    exitOrderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    },
    // Default re-entry config (disabled)
    reEntryConfig: {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    },
    // Include these for backward compatibility
    orderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    }
  }), []);

  return { defaultExitNodeData };
};
