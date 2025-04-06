
export type ExitOrderType = 'market' | 'limit';
export type QuantityType = 'all' | 'percentage' | 'specific';
export type TriggerType = 'percentage' | 'points' | 'pnl';

export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: QuantityType;
  partialQuantityPercentage?: number;
  specificQuantity?: number;
  targetPositionId?: string;
  _lastUpdated?: number;
}

export interface ReEntryConfig {
  enabled: boolean;
  groupNumber: number;
  maxReEntries: number;
}

// Add the missing config interfaces
export interface StopLossConfig {
  enabled: boolean;
  triggerType?: TriggerType;
  stopPercentage?: number;
  stopPoints?: number;
  stopPnl?: number;
  reEntry?: ReEntryConfig;
}

export interface TrailingStopConfig {
  enabled: boolean;
  triggerType?: TriggerType;
  initialDistance?: number;
  initialPoints?: number;
  initialPnl?: number;
  stepSize?: number;
  pointsStepSize?: number;
  pnlStepSize?: number;
  reEntry?: ReEntryConfig;
}

export interface TakeProfitConfig {
  enabled: boolean;
  triggerType?: TriggerType;
  targetPercentage?: number;
  targetPoints?: number;
  targetPnl?: number;
  reEntry?: ReEntryConfig;
}

// Add the postExecutionConfig property to ExitNodeData
export interface PostExecutionConfig {
  stopLoss?: StopLossConfig;
  trailingStop?: TrailingStopConfig;
  takeProfit?: TakeProfitConfig;
}

export interface ExitNodeData {
  orderConfig: ExitOrderConfig;
  reEntryConfig?: ReEntryConfig;
  exitOrderConfig?: ExitOrderConfig; // Add this for compatibility with existing code
  postExecutionConfig?: PostExecutionConfig; // Add the missing property
  _initialized?: boolean;
}
