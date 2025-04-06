
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

// Overall exit node data
export interface ExitNodeData {
  exitOrderConfig: ExitOrderConfig;
  // Re-entry configuration
  reEntryConfig?: ReEntryConfig;
  // Reference to linked retry node
  linkedRetryNodeId?: string;
  // For backward compatibility
  orderConfig?: {
    orderType: ExitOrderType;
    limitPrice?: number;
  };
}
