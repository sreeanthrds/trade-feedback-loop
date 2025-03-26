
export type OperatorType = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'crosses above' | 'crosses below' | 'is above' | 'is below';

// Updated ExpressionType to include all types used in the components
export type ExpressionType = 'indicator' | 'market_data' | 'constant' | 'time_function' | 'expression';

export type ComparisonOperator = '==' | '!=' | '>' | '>=' | '<' | '<=';

// Base interface for all expressions
export interface Expression {
  id: string;
  type: ExpressionType;
}

// Expression value structure used in previous version
export interface ExpressionValue {
  type: ExpressionType;
  value: any;
  params?: Record<string, any>;
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
 * Creates a default expression based on the type
 */
export function createDefaultExpression(type: ExpressionType): Expression {
  const id = `expr_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type) {
    case 'indicator':
      return {
        id,
        type: 'indicator',
        name: ''
      } as IndicatorExpression;
    
    case 'market_data':
      return {
        id,
        type: 'market_data',
        field: 'Close'
      } as MarketDataExpression;
    
    case 'constant':
      return {
        id,
        type: 'constant',
        value: 0
      } as ConstantExpression;
    
    case 'time_function':
      return {
        id,
        type: 'time_function',
        function: 'today'
      } as TimeFunctionExpression;
    
    case 'expression':
      return {
        id,
        type: 'expression',
        operation: '+',
        left: createDefaultExpression('constant'),
        right: createDefaultExpression('constant')
      } as ComplexExpression;
    
    default:
      return {
        id,
        type: 'constant',
        value: 0
      } as ConstantExpression;
  }
}

/**
 * Creates an empty condition with default values
 */
export const createEmptyCondition = (): Condition => ({
  id: `condition_${Math.random().toString(36).substr(2, 9)}`,
  lhs: createDefaultExpression('indicator') as Expression,
  operator: '==',
  rhs: createDefaultExpression('constant') as Expression
});

/**
 * Creates an empty group condition with a single empty condition
 */
export const createEmptyGroupCondition = (): GroupCondition => ({
  id: `group_${Math.random().toString(36).substr(2, 9)}`,
  groupLogic: 'AND',
  conditions: [createEmptyCondition()]
});

/**
 * Convert an expression to a string for display
 */
function expressionToString(expression: Expression, startNodeData?: any): string {
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
function conditionToString(condition: Condition, startNodeData?: any): string {
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
export function groupConditionToString(group: GroupCondition, startNodeData?: any): string {
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
