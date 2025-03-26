
// Type definitions for condition builder

// Expression component types
export type ExpressionType = 'indicator' | 'market_data' | 'constant' | 'time_function' | 'expression';

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
}

// Market data reference (Open, High, Low, Close)
export interface MarketDataExpression extends BaseExpression {
  type: 'market_data';
  field: string;
  sub_indicator?: string;
}

// Constant value (number or string)
export interface ConstantExpression extends BaseExpression {
  type: 'constant';
  value: number | string;
}

// Time-based function (yesterday, N days ago, etc.)
export interface TimeFunctionExpression extends BaseExpression {
  type: 'time_function';
  function: string;
  parameters?: any;
}

// Complex expression with operation
export interface ComplexExpression extends BaseExpression {
  type: 'expression';
  operation: '+' | '-' | '*' | '/' | '%';
  left: Expression;
  right: Expression;
}

// Union type for all expression types
export type Expression = 
  | IndicatorExpression 
  | MarketDataExpression 
  | ConstantExpression 
  | TimeFunctionExpression
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

// Default expressions for new conditions
export const createDefaultExpression = (type: ExpressionType): Expression => {
  const id = `expr_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type) {
    case 'indicator':
      return { id, type: 'indicator', name: '' };
    case 'market_data':
      return { id, type: 'market_data', field: 'Close' };
    case 'constant':
      return { id, type: 'constant', value: 0 };
    case 'time_function':
      return { id, type: 'time_function', function: 'today' };
    case 'expression':
      return {
        id,
        type: 'expression',
        operation: '+',
        left: createDefaultExpression('market_data'),
        right: createDefaultExpression('constant')
      };
    default:
      return { id, type: 'constant', value: 0 };
  }
};

// Create a new empty condition
export const createEmptyCondition = (): Condition => {
  return {
    id: `cond_${Math.random().toString(36).substr(2, 9)}`,
    lhs: createDefaultExpression('market_data'),
    operator: '>',
    rhs: createDefaultExpression('constant')
  };
};

// Create a new empty group condition
export const createEmptyGroupCondition = (): GroupCondition => {
  return {
    id: `group_${Math.random().toString(36).substr(2, 9)}`,
    groupLogic: 'AND',
    conditions: [createEmptyCondition()]
  };
};

// Helper function to get display name for indicators (similar to StartNode.tsx)
export const getIndicatorDisplayName = (key: string, nodeData?: any): string => {
  if (!nodeData || !nodeData.indicatorParameters) return key;
  
  // Extract base indicator name (before any underscore)
  const baseName = key.split('_')[0];
  
  if (nodeData.indicatorParameters[key]) {
    const params = nodeData.indicatorParameters[key];
    
    // Format all parameters into a single, readable string - only values
    const paramList = Object.values(params).join(',');
    
    return `${baseName}(${paramList})`;
  }
  
  return key;
};

// Convert a condition to a readable string
export const conditionToString = (condition: Condition, nodeData?: any): string => {
  const lhsStr = expressionToString(condition.lhs, nodeData);
  const rhsStr = expressionToString(condition.rhs, nodeData);
  return `${lhsStr} ${condition.operator} ${rhsStr}`;
};

// Convert a group condition to a readable string
export const groupConditionToString = (group: GroupCondition, nodeData?: any): string => {
  if (group.conditions.length === 0) {
    return '(empty)';
  }
  
  const conditionsStr = group.conditions.map(cond => {
    if ('groupLogic' in cond) {
      return `(${groupConditionToString(cond, nodeData)})`;
    } else {
      return conditionToString(cond, nodeData);
    }
  }).join(` ${group.groupLogic} `);
  
  return conditionsStr;
};

// Convert an expression to a readable string
export const expressionToString = (expr: Expression, nodeData?: any): string => {
  switch (expr.type) {
    case 'indicator':
      if (nodeData) {
        const displayName = getIndicatorDisplayName(expr.name, nodeData);
        return expr.parameter ? `${displayName}[${expr.parameter}]` : displayName;
      }
      return expr.parameter ? `${expr.name}[${expr.parameter}]` : expr.name;
    case 'market_data':
      return expr.sub_indicator ? `${expr.field}.${expr.sub_indicator}` : expr.field;
    case 'constant':
      return `${expr.value}`;
    case 'time_function':
      return expr.function;
    case 'expression':
      const leftStr = expressionToString(expr.left, nodeData);
      const rightStr = expressionToString(expr.right, nodeData);
      return `(${leftStr} ${expr.operation} ${rightStr})`;
    default:
      return '';
  }
};
