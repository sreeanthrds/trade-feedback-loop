
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ExitNodeData,
  ExitOrderConfig,
  ReEntryConfig
} from '../types';

export const useExitNodeDefaults = () => {
  const defaultOrderConfig: ExitOrderConfig = useMemo(() => ({
    orderType: 'market',
    quantity: 'all',
    partialQuantityPercentage: 50,
    specificQuantity: 1,
    _lastUpdated: Date.now()
  }), []);

  const defaultReEntryConfig: ReEntryConfig = useMemo(() => ({
    enabled: false,
    groupNumber: 1,
    maxReEntries: 1
  }), []);

  const defaultExitNodeData: ExitNodeData = useMemo(() => ({
    orderConfig: defaultOrderConfig,
    reEntryConfig: defaultReEntryConfig,
    _initialized: true
  }), [defaultOrderConfig, defaultReEntryConfig]);

  return {
    defaultExitNodeData,
    defaultOrderConfig,
    defaultReEntryConfig
  };
};
