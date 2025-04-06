
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ExitNodeData,
  ExitOrderConfig,
  StopLossConfig,
  TrailingStopConfig,
  TakeProfitConfig,
  PostExecutionConfig
} from '../types';

export const useExitNodeDefaults = () => {
  const defaultOrderConfig: ExitOrderConfig = useMemo(() => ({
    orderType: 'market',
    quantity: 'all',
    partialQuantityPercentage: 50,
    specificQuantity: 1,
    _lastUpdated: Date.now()
  }), []);

  const defaultStopLossConfig: StopLossConfig = useMemo(() => ({
    enabled: false,
    triggerType: 'percentage',
    stopPercentage: 5,
    stopPoints: 10,
    stopPnl: 1000,
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
    initialPnl: 1000,
    stepSize: 1,
    pointsStepSize: 1,
    pnlStepSize: 100,
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
    targetPnl: 2000,
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
    postExecutionConfig: defaultPostExecutionConfig,
    _initialized: true
  }), [defaultOrderConfig, defaultPostExecutionConfig]);

  return {
    defaultExitNodeData,
    defaultOrderConfig,
    defaultStopLossConfig,
    defaultTrailingStopConfig,
    defaultTakeProfitConfig,
    defaultPostExecutionConfig
  };
};
