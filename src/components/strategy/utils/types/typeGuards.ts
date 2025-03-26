
import { 
  Expression, 
  Condition, 
  GroupCondition,
  IndicatorExpression,
  MarketDataExpression,
  ConstantExpression,
  TimeFunctionExpression,
  ComplexExpression
} from './expressionTypes';

/**
 * Type guard to check if an object is a GroupCondition
 */
export function isGroupCondition(value: any): value is GroupCondition {
  return value && 
    typeof value === 'object' && 
    'groupLogic' in value && 
    'conditions' in value && 
    Array.isArray(value.conditions);
}

/**
 * Type guard to check if an object is a Condition
 */
export function isCondition(value: any): value is Condition {
  return value && 
    typeof value === 'object' && 
    'lhs' in value && 
    'operator' in value && 
    'rhs' in value;
}

/**
 * Type guard to check if an object is an IndicatorExpression
 */
export function isIndicatorExpression(expr: Expression): expr is IndicatorExpression {
  return expr && expr.type === 'indicator';
}

/**
 * Type guard to check if an object is a MarketDataExpression
 */
export function isMarketDataExpression(expr: Expression): expr is MarketDataExpression {
  return expr && expr.type === 'market_data';
}

/**
 * Type guard to check if an object is a ConstantExpression
 */
export function isConstantExpression(expr: Expression): expr is ConstantExpression {
  return expr && expr.type === 'constant';
}

/**
 * Type guard to check if an object is a TimeFunctionExpression
 */
export function isTimeFunctionExpression(expr: Expression): expr is TimeFunctionExpression {
  return expr && expr.type === 'time_function';
}

/**
 * Type guard to check if an object is a ComplexExpression
 */
export function isComplexExpression(expr: Expression): expr is ComplexExpression {
  return expr && expr.type === 'expression';
}
