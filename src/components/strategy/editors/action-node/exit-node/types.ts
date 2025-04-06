
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

export interface ExitNodeData {
  orderConfig: ExitOrderConfig;
  reEntryConfig?: ReEntryConfig;
  exitOrderConfig?: ExitOrderConfig; // Add this for compatibility with existing code
  _initialized?: boolean;
}
