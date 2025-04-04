// Type definitions for condition builder

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
  function: string;
  parameters?: any;
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

// Default expressions for new conditions
export const createDefaultExpression = (type: ExpressionType): Expression => {
  const id = `expr_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type) {
    case 'indicator':
      return { id, type: 'indicator', name: '' };
    case 'market_data':
      return { id, type: 'market_data', field: 'Close', offset: 0 };
    case 'constant':
      return { id, type: 'constant', value: 0 };
    case 'time_function':
      return { id, type: 'time_function', function: 'today' };
    case 'position_data':
      return { id, type: 'position_data', field: 'unrealizedPnl' };
    case 'strategy_metric':
      return { id, type: 'strategy_metric', metric: 'totalPnl' };
    case 'execution_data':
      return { id, type: 'execution_data', field: 'orderStatus' };
    case 'external_trigger':
      return { id, type: 'external_trigger', triggerType: 'news' };
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
  if (!group.conditions || group.conditions.length === 0) {
    return '(empty)';
  }
  
  const conditionsStr = group.conditions.map(cond => {
    if ('groupLogic' in cond) {
      return `(${groupConditionToString(cond as GroupCondition, nodeData)})`;
    } else {
      return conditionToString(cond as Condition, nodeData);
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
      let fieldDisplay = expr.sub_indicator ? `${expr.field}.${expr.sub_indicator}` : expr.field;
      // Add offset display if present
      if (expr.offset && expr.offset < 0) {
        if (expr.offset === -1) {
          fieldDisplay = `Previous ${fieldDisplay}`;
        } else {
          fieldDisplay = `${Math.abs(expr.offset)} candles ago ${fieldDisplay}`;
        }
      }
      return fieldDisplay;
    
    case 'constant':
      return `${expr.value}`;
    
    case 'time_function':
      return expr.function;
    
    case 'position_data':
      let positionContext = '';
      if (expr.vpi === '_any' && expr.vpt === '_any') {
        positionContext = '(All Positions)';
      } else if (expr.vpi === '_any' && expr.vpt) {
        positionContext = `(Tag:${expr.vpt})`;
      } else if (expr.vpi && expr.vpi !== '_any') {
        // If specific VPI is selected, only show that (as it implies a specific VPT)
        positionContext = `(ID:${expr.vpi})`;
      }
      return `${expr.field}${positionContext}`;
    
    case 'strategy_metric':
      return `Strategy.${expr.metric}`;
    
    case 'execution_data':
      const orderRef = expr.vpi ? `(Order:${expr.vpi})` : '';
      return `${expr.field}${orderRef}`;
    
    case 'external_trigger':
      return `Trigger.${expr.triggerType}`;
    
    case 'expression':
      const leftStr = expressionToString(expr.left, nodeData);
      const rightStr = expressionToString(expr.right, nodeData);
      
      // Handle percentage operations with special formatting
      if (expr.operation === '+%') {
        return `(${leftStr} increased by ${rightStr}%)`;
      } else if (expr.operation === '-%') {
        return `(${leftStr} decreased by ${rightStr}%)`;
      }
      
      return `(${leftStr} ${expr.operation} ${rightStr})`;
    
    default:
      return '';
  }
};
