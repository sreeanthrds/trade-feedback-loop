
// Exit order types
export type ExitOrderType = 'market' | 'limit';

// Exit quantity options
export type QuantityType = 'all' | 'percentage' | 'specific';

// Exit order configuration
export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: QuantityType;
  partialQuantityPercentage?: number;
  specificQuantity?: number;
  // Position to exit
  targetPositionId?: string;
}

// Re-entry configuration
export interface ReEntryConfig {
  enabled: boolean;
  groupNumber: number;
  maxReEntries: number;
}

// Stop Loss configuration
export interface StopLossConfig {
  enabled: boolean;
  stopPrice?: number;
  stopPercentage?: number;
  // Re-entry after stop loss
  reEntry?: ReEntryConfig;
}

// Trailing Stop configuration
export interface TrailingStopConfig {
  enabled: boolean;
  initialDistance?: number;
  stepSize?: number;
  // Re-entry after trailing stop
  reEntry?: ReEntryConfig;
}

// Take Profit configuration
export interface TakeProfitConfig {
  enabled: boolean;
  targetPrice?: number;
  targetPercentage?: number;
  // Re-entry after take profit
  reEntry?: ReEntryConfig;
}

// Post-execution configuration
export interface PostExecutionConfig {
  stopLoss?: StopLossConfig;
  trailingStop?: TrailingStopConfig;
  takeProfit?: TakeProfitConfig;
}

// Overall exit node data
export interface ExitNodeData {
  exitOrderConfig: ExitOrderConfig;
  // Re-entry configuration
  reEntryConfig?: ReEntryConfig;
  // Post-execution configuration
  postExecutionConfig?: PostExecutionConfig;
  // Reference to linked retry node
  linkedRetryNodeId?: string;
  // For backward compatibility
  orderConfig?: {
    orderType: ExitOrderType;
    limitPrice?: number;
  };
}
