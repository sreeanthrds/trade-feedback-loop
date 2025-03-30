
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
  target?: number;
  targetType?: 'percentage' | 'absolute';
}

export interface ExitByPercentage extends ExitCondition {
  type: 'premium_change' | 'position_value_change';
  percentage?: number;
  direction?: 'up' | 'down';
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
}

export interface ExitByTime extends ExitCondition {
  type: 'time_based';
  minutes?: number;
  seconds?: number;
}

export interface ExitBeforeMarketClose extends ExitCondition {
  type: 'market_close';
  minutes?: number;
}

export interface ExitWithFallback extends ExitCondition {
  type: 'limit_to_market';
  seconds?: number;
}

export interface ExitWithRolling extends ExitCondition {
  type: 'rolling';
  daysBeforeExpiry?: number;
}
