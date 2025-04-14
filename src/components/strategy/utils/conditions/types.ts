
// Base type definitions for condition builder

// Expression component types
export type ExpressionType = 
  | 'indicator' 
  | 'market_data' 
  | 'constant' 
  | 'time_function' 
  | 'expression'
  | 'position_data'
  | 'strategy_metric'
  | 'execution_data'
  | 'external_trigger';

// Basic expression with no operation
export interface BaseExpression {
  id: string;
  type: ExpressionType;
}

// Indicator reference (e.g., EMA_21, RSI_14)
export interface IndicatorExpression extends BaseExpression {
  type: 'indicator';
  name: string;
  parameter?: string; // For indicators with multiple outputs
  offset?: number; // 0 = current candle, -1 = previous candle, -2 = 2 candles ago, etc.
}

// Market data reference (Open, High, Low, Close)
export interface MarketDataExpression extends BaseExpression {
  type: 'market_data';
  field: string;
  sub_indicator?: string;
  offset?: number; // 0 = current candle, -1 = previous candle, -2 = 2 candles ago, etc.
}

// Constant value (number or string)
export interface ConstantExpression extends BaseExpression {
  type: 'constant';
  value: number | string;
}

// Time-based function (yesterday, N days ago, etc.)
export interface TimeFunctionExpression extends BaseExpression {
  type: 'time_function';
  function: string; // 'today' | 'yesterday' | 'n_seconds_ago' | 'n_minutes_ago' | 'n_hours_ago' | 'n_days_ago' | 'specific_date' | 'this_week' | 'last_week' | 'this_month' | 'last_month';
  parameters?: any; // number for n_X_ago functions, Date object for specific_date
}

// Position tracking data (P&L, MTM, etc.)
export interface PositionDataExpression extends BaseExpression {
  type: 'position_data';
  field: string;
  vpi?: string; // Virtual Position ID reference
  vpt?: string; // Virtual Position Tag reference
}

// Strategy-level metrics
export interface StrategyMetricExpression extends BaseExpression {
  type: 'strategy_metric';
  metric: string;
}

// Trade execution data
export interface ExecutionDataExpression extends BaseExpression {
  type: 'execution_data';
  field: string;
  vpi?: string; // Order reference
}

// External triggers
export interface ExternalTriggerExpression extends BaseExpression {
  type: 'external_trigger';
  triggerType: string;
  parameters?: any;
}

// Complex expression with operation
export interface ComplexExpression extends BaseExpression {
  type: 'expression';
  operation: '+' | '-' | '*' | '/' | '%' | '+%' | '-%'; // Added +% and -% for percentage operations
  left: Expression;
  right: Expression;
}

// Union type for all expression types
export type Expression = 
  | IndicatorExpression 
  | MarketDataExpression 
  | ConstantExpression 
  | TimeFunctionExpression
  | PositionDataExpression
  | StrategyMetricExpression
  | ExecutionDataExpression
  | ExternalTriggerExpression
  | ComplexExpression;

// Comparison operators
export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!=';

// Single condition (LHS operator RHS)
export interface Condition {
  id: string;
  lhs: Expression;
  operator: ComparisonOperator;
  rhs: Expression;
}

// Group of conditions with logical operator
export interface GroupCondition {
  id: string;
  groupLogic: 'AND' | 'OR';
  conditions: (Condition | GroupCondition)[];
}
