
import { v4 as uuidv4 } from 'uuid';
import { 
  Expression, 
  ExpressionType, 
  Condition, 
  GroupCondition 
} from './types';

// Default expressions for new conditions
export const createDefaultExpression = (type: ExpressionType): Expression => {
  const id = `expr_${uuidv4().substring(0, 8)}`;
  
  switch (type) {
    case 'indicator':
      return { id, type: 'indicator', name: '', offset: 0 };
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
    id: `cond_${uuidv4().substring(0, 8)}`,
    lhs: createDefaultExpression('market_data'),
    operator: '>',
    rhs: createDefaultExpression('constant')
  };
};

// Create a new empty group condition
export const createEmptyGroupCondition = (): GroupCondition => {
  return {
    id: `group_${uuidv4().substring(0, 8)}`,
    groupLogic: 'AND',
    conditions: [createEmptyCondition()]
  };
};
