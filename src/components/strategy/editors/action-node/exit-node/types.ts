
// Exit order types
export type ExitOrderType = 'market' | 'limit';

// Exit order configuration
export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: 'all' | 'partial';
  partialQuantityPercentage?: number;
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
  multipleOrders?: boolean;
  orders?: ExitOrderConfig[];
  // Re-entry configuration
  reEntryConfig?: ReEntryConfig;
  // Reference to linked retry node
  linkedRetryNodeId?: string;
  // Adding these for backward compatibility
  exitCondition?: ExitCondition;
  orderConfig?: {
    orderType: ExitOrderType;
    limitPrice?: number;
  };
}

// For backward compatibility with existing code
export type ExitConditionType = 'vpi' | 'vpt' | 'all_positions' | 'realized_pnl' | 'unrealized_pnl' | 
  'premium_change' | 'position_value_change' | 'price_target' | 'indicator_underlying' | 
  'indicator_contract' | 'time_based' | 'market_close' | 'limit_to_market' | 'rolling';

// Base exit condition interface
export interface ExitCondition {
  type: ExitConditionType;
}

// Specific exit condition types
export interface ExitByPositionIdentifier extends ExitCondition {
  type: 'vpi' | 'vpt';
  identifier?: string;
}

export interface ExitByPnL extends ExitCondition {
  type: 'realized_pnl' | 'unrealized_pnl';
  value?: number; // Fixed from target
  direction?: 'above' | 'below'; // Added missing property
  targetType?: 'percentage' | 'absolute';
}

export interface ExitByPercentage extends ExitCondition {
  type: 'premium_change' | 'position_value_change';
  percentage?: number;
  direction?: 'increase' | 'decrease'; // Changed from up/down to match implementation
}

export interface ExitByPriceTarget extends ExitCondition {
  type: 'price_target';
  price?: number;
  direction?: 'above' | 'below';
}

export interface ExitByIndicator extends ExitCondition {
  type: 'indicator_underlying' | 'indicator_contract';
  indicator?: string;
  condition?: 'crossover' | 'crossunder' | 'above' | 'below';
  value?: number;
  offset?: number; // Add the offset property for lookback functionality
}

export interface ExitByTime extends ExitCondition {
  type: 'time_based';
  minutes?: number;
  seconds?: number;
}

export interface ExitBeforeMarketClose extends ExitCondition {
  type: 'market_close';
  minutesBefore?: number; // Fix the property name
}

export interface ExitWithFallback extends ExitCondition {
  type: 'limit_to_market';
  waitSeconds?: number; // Fix the property name
}

export interface ExitWithRolling extends ExitCondition {
  type: 'rolling';
  daysBeforeExpiry?: number;
  strikeDifference?: number; // Add missing property
}
