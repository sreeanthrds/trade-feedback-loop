
// Exit order types
export type ExitOrderType = 'market' | 'limit';

// Exit order configuration
export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: 'all' | 'partial';
  partialQuantityPercentage?: number;
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
  // Remove multipleOrders flag
  // multipleOrders?: boolean;
  // orders?: ExitOrderConfig[];
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
