
import { 
  Expression, 
  Condition, 
  GroupCondition, 
  ConstantExpression,
  IndicatorExpression,
  MarketDataExpression,
  TimeFunctionExpression,
  ComplexExpression
} from './expressionTypes';

/**
 * Convert an expression to a string for display
 */
export function expressionToString(expression: Expression | undefined, startNodeData?: any): string {
  if (!expression) return '?';

  switch (expression.type) {
    case 'indicator': {
      const indicatorExpr = expression as IndicatorExpression;
      const displayName = indicatorExpr.name || '?';
      return indicatorExpr.parameter 
        ? `${displayName}(${indicatorExpr.parameter})` 
        : displayName;
    }
    
    case 'market_data': {
      const marketExpr = expression as MarketDataExpression;
      return marketExpr.field || 'Price';
    }
    
    case 'constant': {
      const constExpr = expression as ConstantExpression;
      return `${constExpr.value}`;
    }
    
    case 'time_function': {
      const timeExpr = expression as TimeFunctionExpression;
      if (timeExpr.function === 'n_days_ago' && timeExpr.parameters) {
        return `${timeExpr.parameters} days ago`;
      }
      return timeExpr.function || 'now';
    }
    
    case 'expression': {
      const complexExpr = expression as ComplexExpression;
      const leftStr = expressionToString(complexExpr.left, startNodeData);
      const rightStr = expressionToString(complexExpr.right, startNodeData);
      return `(${leftStr} ${complexExpr.operation} ${rightStr})`;
    }
    
    default:
      return '?';
  }
}

/**
 * Convert a condition to a string for display
 */
export function conditionToString(condition: Condition | undefined, startNodeData?: any): string {
  if (!condition || !condition.lhs || !condition.operator || !condition.rhs) {
    return '?';
  }
  
  const lhsStr = expressionToString(condition.lhs, startNodeData);
  const rhsStr = expressionToString(condition.rhs, startNodeData);
  
  return `${lhsStr} ${condition.operator} ${rhsStr}`;
}

/**
 * Convert a group condition to a string for display
 */
export function groupConditionToString(group: GroupCondition | undefined, startNodeData?: any): string {
  if (!group || !Array.isArray(group.conditions) || group.conditions.length === 0) {
    return '?';
  }
  
  const conditionStrings = group.conditions.map(condition => {
    if (isGroupCondition(condition)) {
      return `(${groupConditionToString(condition, startNodeData)})`;
    } else if (isCondition(condition)) {
      return conditionToString(condition, startNodeData);
    }
    return '?';
  });
  
  return conditionStrings.join(` ${group.groupLogic} `);
}

// Add the imported type guards that are required by the formatter
function isGroupCondition(value: any): value is GroupCondition {
  return value && 
    typeof value === 'object' && 
    'groupLogic' in value && 
    'conditions' in value && 
    Array.isArray(value.conditions);
}

function isCondition(value: any): value is Condition {
  return value && 
    typeof value === 'object' && 
    'lhs' in value && 
    'operator' in value && 
    'rhs' in value;
}
