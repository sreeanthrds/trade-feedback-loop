
import { useMemo } from 'react';
import { 
  ExitConditionType, 
  ExitOrderType, 
  ExitNodeData
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
      groupNumber: 0,
      maxReEntries: 0
    },
    // Include these for backward compatibility
    exitCondition: {
      type: 'all_positions' as ExitConditionType
    },
    orderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    }
  }), []);

  return { defaultExitNodeData };
};
