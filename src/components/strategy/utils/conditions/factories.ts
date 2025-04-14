import { v4 as uuid } from 'uuid';
import { 
  Expression, 
  ExpressionType,
  IndicatorExpression,
  MarketDataExpression,
  ConstantExpression,
  TimeFunctionExpression,
  PositionDataExpression,
  StrategyMetricExpression,
  ExecutionDataExpression,
  ExternalTriggerExpression,
  ComplexExpression
} from './types';

// Create a default expression of the given type
export const createDefaultExpression = (type: ExpressionType): Expression => {
  const id = uuid();
  
  switch (type) {
    case 'indicator':
      return {
        id,
        type: 'indicator',
        name: '',
        offset: 0
      };
      
    case 'market_data':
      return {
        id,
        type: 'market_data',
        field: '',
        offset: 0
      };
      
    case 'constant':
      return {
        id,
        type: 'constant',
        value: 0
      };
      
    case 'time_function':
      return {
        id,
        type: 'time_function',
        function: 'today'
      };
      
    case 'position_data':
      return {
        id,
        type: 'position_data',
        field: ''
      };
      
    case 'strategy_metric':
      return {
        id,
        type: 'strategy_metric',
        metric: ''
      };
      
    case 'execution_data':
      return {
        id,
        type: 'execution_data',
        field: ''
      };
      
    case 'external_trigger':
      return {
        id,
        type: 'external_trigger',
        triggerType: ''
      };
      
    case 'expression':
      return {
        id,
        type: 'expression',
        operation: '+',
        left: createDefaultExpression('constant'),
        right: createDefaultExpression('constant')
      };
      
    default:
      return {
        id,
        type: 'constant',
        value: 0
      };
  }
};
