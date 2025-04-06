
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ExitNodeData,
  ExitOrderConfig,
  ReEntryConfig,
  PostExecutionConfig,
  StopLossConfig,
  TrailingStopConfig,
  TakeProfitConfig
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

  const defaultStopLossConfig: StopLossConfig = useMemo(() => ({
    enabled: false,
    triggerType: 'percentage',
    stopPercentage: 5,
    stopPoints: 10,
    stopPnl: 100,
    reEntry: {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    }
  }), []);

  const defaultTrailingStopConfig: TrailingStopConfig = useMemo(() => ({
    enabled: false,
    triggerType: 'percentage',
    initialDistance: 5,
    initialPoints: 10,
    initialPnl: 100,
    stepSize: 1,
    pointsStepSize: 2,
    pnlStepSize: 20,
    reEntry: {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    }
  }), []);

  const defaultTakeProfitConfig: TakeProfitConfig = useMemo(() => ({
    enabled: false,
    triggerType: 'percentage',
    targetPercentage: 10,
    targetPoints: 20,
    targetPnl: 200,
    reEntry: {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    }
  }), []);

  const defaultPostExecutionConfig: PostExecutionConfig = useMemo(() => ({
    stopLoss: defaultStopLossConfig,
    trailingStop: defaultTrailingStopConfig,
    takeProfit: defaultTakeProfitConfig
  }), [defaultStopLossConfig, defaultTrailingStopConfig, defaultTakeProfitConfig]);

  const defaultExitNodeData: ExitNodeData = useMemo(() => ({
    orderConfig: defaultOrderConfig,
    reEntryConfig: defaultReEntryConfig,
    postExecutionConfig: defaultPostExecutionConfig,
    _initialized: true
  }), [defaultOrderConfig, defaultReEntryConfig, defaultPostExecutionConfig]);

  return {
    defaultExitNodeData,
    defaultOrderConfig,
    defaultReEntryConfig,
    defaultPostExecutionConfig,
    defaultStopLossConfig,
    defaultTrailingStopConfig,
    defaultTakeProfitConfig
  };
};
