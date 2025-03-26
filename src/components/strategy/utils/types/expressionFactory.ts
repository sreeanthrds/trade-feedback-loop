
import { 
  ExpressionType, 
  Expression, 
  IndicatorExpression, 
  MarketDataExpression, 
  ConstantExpression, 
  TimeFunctionExpression, 
  ComplexExpression,
  Condition,
  GroupCondition
} from './expressionTypes';

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
