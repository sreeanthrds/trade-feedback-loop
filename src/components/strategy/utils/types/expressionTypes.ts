
/**
 * Core expression types used throughout the application
 */

export type OperatorType = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'crosses above' | 'crosses below' | 'is above' | 'is below';

// All expression types used in the components
export type ExpressionType = 'indicator' | 'market_data' | 'constant' | 'time_function' | 'expression';

export type ComparisonOperator = '==' | '!=' | '>' | '>=' | '<' | '<=';

// Base interface for all expressions
export interface Expression {
  id: string;
  type: ExpressionType;
}

// Specific expression types
export interface IndicatorExpression extends Expression {
  type: 'indicator';
  name: string;
  parameter?: string;
}

export interface MarketDataExpression extends Expression {
  type: 'market_data';
  field: string;
}

export interface ConstantExpression extends Expression {
  type: 'constant';
  value: number | string;
}

export interface TimeFunctionExpression extends Expression {
  type: 'time_function';
  function: string;
  parameters?: number;
}

export interface ComplexExpression extends Expression {
  type: 'expression';
  operation: '+' | '-' | '*' | '/' | '%';
  left: Expression;
  right: Expression;
}

/**
 * Condition types
 */
export interface Condition {
  id: string;
  lhs: Expression;
  operator: ComparisonOperator;
  rhs: Expression;
}

export interface GroupCondition {
  id: string;
  groupLogic: 'AND' | 'OR';
  conditions: (Condition | GroupCondition)[];
}
