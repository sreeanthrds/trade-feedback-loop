
// Import types
import {
  Expression,
  Condition,
  GroupCondition,
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
import { v4 as uuidv4 } from 'uuid';

// Helper to create unique IDs
export const createUniqueId = () => uuidv4();

// Factory for creating empty conditions
export const createEmptyCondition = (): Condition => {
  return {
    id: createUniqueId(),
    lhs: createDefaultExpression('indicator'),
    operator: '>',
    rhs: createDefaultExpression('constant')
  };
};

// Factory for creating empty group conditions
export const createEmptyGroupCondition = (): GroupCondition => {
  return {
    id: createUniqueId(),
    groupLogic: 'AND',
    conditions: []
  };
};

// Alias for backwards compatibility
export const createDefaultExpression = (type: ExpressionType): Expression => {
  switch (type) {
    case 'indicator':
      return createIndicatorExpression();
    case 'market_data':
      return createMarketDataExpression();
    case 'constant':
      return createConstantExpression();
    case 'time_function':
      return createTimeFunctionExpression();
    case 'position_data':
      return createPositionDataExpression();
    case 'strategy_metric':
      return createStrategyMetricExpression();
    case 'execution_data':
      return createExecutionDataExpression();
    case 'external_trigger':
      return createExternalTriggerExpression();
    case 'expression':
      return createComplexExpression();
    default:
      return createIndicatorExpression();
  }
};

// Alias for createDefaultExpression for backwards compatibility
export const createEmptyExpression = createDefaultExpression;

// Factory for creating indicator expressions
export const createIndicatorExpression = (): IndicatorExpression => {
  return {
    id: createUniqueId(),
    type: 'indicator',
    name: '',
    parameter: undefined,
    offset: 0
  };
};

// Factory for creating market data expressions
export const createMarketDataExpression = (): MarketDataExpression => {
  return {
    id: createUniqueId(),
    type: 'market_data',
    field: 'Close',
    offset: 0
  };
};

// Factory for creating constant expressions
export const createConstantExpression = (): ConstantExpression => {
  return {
    id: createUniqueId(),
    type: 'constant',
    value: 0
  };
};

// Factory for creating time function expressions
export const createTimeFunctionExpression = (): TimeFunctionExpression => {
  return {
    id: createUniqueId(),
    type: 'time_function',
    function: 'today'
  };
};

// Factory for creating position data expressions
export const createPositionDataExpression = (): PositionDataExpression => {
  return {
    id: createUniqueId(),
    type: 'position_data',
    field: 'pnl'
  };
};

// Factory for creating strategy metric expressions
export const createStrategyMetricExpression = (): StrategyMetricExpression => {
  return {
    id: createUniqueId(),
    type: 'strategy_metric',
    metric: 'total_pnl'
  };
};

// Factory for creating execution data expressions
export const createExecutionDataExpression = (): ExecutionDataExpression => {
  return {
    id: createUniqueId(),
    type: 'execution_data',
    field: 'execution_price'
  };
};

// Factory for creating external trigger expressions
export const createExternalTriggerExpression = (): ExternalTriggerExpression => {
  return {
    id: createUniqueId(),
    type: 'external_trigger',
    triggerType: 'manual'
  };
};

// Factory for creating complex expressions
export const createComplexExpression = (): ComplexExpression => {
  return {
    id: createUniqueId(),
    type: 'expression',
    operation: '+',
    left: createConstantExpression(),
    right: createConstantExpression()
  };
};
