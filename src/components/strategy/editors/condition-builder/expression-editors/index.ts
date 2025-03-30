
import IndicatorExpressionEditor from './IndicatorExpressionEditor';
import MarketDataExpressionEditor from './MarketDataExpressionEditor';
import TimeExpressionEditor from './TimeExpressionEditor';
import ComplexExpressionEditorWrapper from './ComplexExpressionEditorWrapper';
import ConstantExpressionEditor from './ConstantExpressionEditor';
import PositionDataExpressionEditor from './PositionDataExpressionEditor';
import StrategyMetricExpressionEditor from './StrategyMetricExpressionEditor';
import ExecutionDataExpressionEditor from './ExecutionDataExpressionEditor';
import ExternalTriggerExpressionEditor from './ExternalTriggerExpressionEditor';

// Export all components individually to allow tree-shaking
export {
  IndicatorExpressionEditor,
  MarketDataExpressionEditor,
  TimeExpressionEditor,
  ComplexExpressionEditorWrapper,
  ConstantExpressionEditor,
  PositionDataExpressionEditor,
  StrategyMetricExpressionEditor,
  ExecutionDataExpressionEditor,
  ExternalTriggerExpressionEditor
};

// Create a map for dynamic lookup to improve performance
export const expressionEditorMap = {
  indicator: IndicatorExpressionEditor,
  marketData: MarketDataExpressionEditor,
  time: TimeExpressionEditor,
  complex: ComplexExpressionEditorWrapper,
  constant: ConstantExpressionEditor,
  positionData: PositionDataExpressionEditor,
  strategyMetric: StrategyMetricExpressionEditor,
  executionData: ExecutionDataExpressionEditor,
  externalTrigger: ExternalTriggerExpressionEditor
};
