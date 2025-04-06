
export type ExitOrderType = 'market' | 'limit';

export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
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
}
