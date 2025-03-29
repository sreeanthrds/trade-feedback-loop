
// Exit condition types
export type ExitConditionType = 
  | 'vpi' 
  | 'vpt'
  | 'all_positions'
  | 'realized_pnl'
  | 'unrealized_pnl'
  | 'premium_change'
  | 'position_value_change'
  | 'price_target'
  | 'indicator_underlying'
  | 'indicator_contract'
  | 'time_based'
  | 'market_close'
  | 'partial_execution'  // Added these types that were mentioned in error
  | 'cancel_threshold'   // Added these types that were mentioned in error
  | 'limit_to_market'
  | 'rolling';

// Exit order types
export type ExitOrderType = 'market' | 'limit';

// Exit by position identifiers
export interface ExitByPositionIdentifier {
  type: 'vpi' | 'vpt' | 'all_positions';
  identifier?: string; // VPI or VPT value
}

// Exit by PnL
export interface ExitByPnL {
  type: 'realized_pnl' | 'unrealized_pnl';
  value: number;
  direction: 'above' | 'below';
}

// Exit by percentage change
export interface ExitByPercentage {
  type: 'premium_change' | 'position_value_change';
  percentage: number;
  direction: 'increase' | 'decrease';
}

// Exit by price target
export interface ExitByPriceTarget {
  type: 'price_target';
  price: number;
  direction: 'above' | 'below';
}

// Exit by indicator
export interface ExitByIndicator {
  type: 'indicator_underlying' | 'indicator_contract';
  indicator: string;
  condition: string;
  value: number;
}

// Exit by time
export interface ExitByTime {
  type: 'time_based';
  minutes: number;
}

// Exit before market close
export interface ExitBeforeMarketClose {
  type: 'market_close';
  minutesBefore: number;
}

// Exit with fallback
export interface ExitWithFallback {
  type: 'limit_to_market';
  waitSeconds: number;
}

// Exit with rolling
export interface ExitWithRolling {
  type: 'rolling';
  daysBeforeExpiry: number;
  strikeDifference?: number;
}

// Combined exit condition type
export type ExitCondition = 
  | ExitByPositionIdentifier
  | ExitByPnL
  | ExitByPercentage
  | ExitByPriceTarget
  | ExitByIndicator
  | ExitByTime
  | ExitBeforeMarketClose
  | ExitWithFallback
  | ExitWithRolling;

// Exit order configuration
export interface ExitOrderConfig {
  orderType: ExitOrderType;
  limitPrice?: number;
  quantity?: 'all' | 'partial';
  partialQuantityPercentage?: number;
}

// Overall exit node data
export interface ExitNodeData {
  exitCondition: ExitCondition;
  orderConfig: ExitOrderConfig;
  expression?: any; // For complex expression builder
  multipleOrders?: boolean;
  orders?: ExitOrderConfig[];
}
