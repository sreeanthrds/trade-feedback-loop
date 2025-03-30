
import IndicatorExpressionEditor from './IndicatorExpressionEditor';
import MarketDataExpressionEditor from './MarketDataExpressionEditor';
import ConstantExpressionEditor from './ConstantExpressionEditor';
import TimeExpressionEditor from './TimeExpressionEditor';
import ComplexExpressionEditorWrapper from './ComplexExpressionEditorWrapper';
import PositionDataExpressionEditor from './PositionDataExpressionEditor';
import StrategyMetricExpressionEditor from './StrategyMetricExpressionEditor';
import ExecutionDataExpressionEditor from './ExecutionDataExpressionEditor';
import ExternalTriggerExpressionEditor from './ExternalTriggerExpressionEditor';

// Create a map of expression types to their editor components
export const expressionEditorMap = {
  'indicator': IndicatorExpressionEditor,
  'market_data': MarketDataExpressionEditor,
  'constant': ConstantExpressionEditor,
  'time_function': TimeExpressionEditor,
  'expression': ComplexExpressionEditorWrapper,
  'position_data': PositionDataExpressionEditor,
  'strategy_metric': StrategyMetricExpressionEditor,
  'execution_data': ExecutionDataExpressionEditor,
  'external_trigger': ExternalTriggerExpressionEditor
};

export {
  IndicatorExpressionEditor,
  MarketDataExpressionEditor,
  ConstantExpressionEditor,
  TimeExpressionEditor,
  ComplexExpressionEditorWrapper,
  PositionDataExpressionEditor,
  StrategyMetricExpressionEditor,
  ExecutionDataExpressionEditor,
  ExternalTriggerExpressionEditor
};
