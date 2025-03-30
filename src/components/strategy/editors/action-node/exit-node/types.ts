
// Exit order types
export type ExitOrderType = 'market' | 'limit';

// Exit order configuration
export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: 'all' | 'partial';
  partialQuantityPercentage?: number;
}

// Overall exit node data
export interface ExitNodeData {
  exitOrderConfig: ExitOrderConfig;
  multipleOrders?: boolean;
  orders?: ExitOrderConfig[];
}
