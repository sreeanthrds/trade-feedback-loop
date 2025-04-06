
export type ExitOrderType = 'market' | 'limit';
export type QuantityType = 'all' | 'percentage' | 'specific';

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

export interface StopLossConfig {
  enabled: boolean;
  stopPercentage?: number;
  reEntry?: ReEntryConfig;
}

export interface TrailingStopConfig {
  enabled: boolean;
  initialDistance?: number;
  stepSize?: number;
  reEntry?: ReEntryConfig;
}

export interface TakeProfitConfig {
  enabled: boolean;
  targetPercentage?: number;
  reEntry?: ReEntryConfig;
}

export interface PostExecutionConfig {
  stopLoss?: StopLossConfig;
  trailingStop?: TrailingStopConfig;
  takeProfit?: TakeProfitConfig;
}

export interface ExitNodeData {
  orderConfig: ExitOrderConfig;
  postExecutionConfig: PostExecutionConfig;
  reEntryConfig?: ReEntryConfig;
  exitOrderConfig?: ExitOrderConfig; // Add this for compatibility with existing code
  _initialized?: boolean;
}
