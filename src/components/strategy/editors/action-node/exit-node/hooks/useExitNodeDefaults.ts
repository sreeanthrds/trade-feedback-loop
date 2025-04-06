
import { useMemo } from 'react';
import { 
  ExitOrderType, 
  ExitNodeData,
  ReEntryConfig,
  StopLossConfig,
  TrailingStopConfig,
  TakeProfitConfig,
  PostExecutionConfig
} from '../types';

/**
 * Hook to create default exit node data structure
 */
export const useExitNodeDefaults = () => {
  // Default exit node data - memoized to avoid recreation on each render
  const defaultExitNodeData = useMemo<ExitNodeData>(() => ({
    exitOrderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined,
      quantity: 'all',
      partialQuantityPercentage: 50,
      specificQuantity: 1
    },
    // Default re-entry config (disabled)
    reEntryConfig: {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    },
    // Default post-execution config
    postExecutionConfig: {
      stopLoss: {
        enabled: false,
        stopPrice: undefined,
        stopPercentage: 5,
        reEntry: {
          enabled: false,
          groupNumber: 1,
          maxReEntries: 1
        }
      },
      trailingStop: {
        enabled: false,
        initialDistance: 5,
        stepSize: 1,
        reEntry: {
          enabled: false,
          groupNumber: 1,
          maxReEntries: 1
        }
      },
      takeProfit: {
        enabled: false,
        targetPrice: undefined,
        targetPercentage: 10,
        reEntry: {
          enabled: false,
          groupNumber: 1,
          maxReEntries: 1
        }
      }
    },
    // Include these for backward compatibility
    orderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    }
  }), []);

  return { defaultExitNodeData };
};
