
import React from 'react';
import { Expression } from '../../utils/conditions';
import { useIndicatorSelector } from './hooks/useIndicatorSelector';
import IndicatorMissingAlert from './components/IndicatorMissingAlert';
import IndicatorNameSelector from './components/IndicatorNameSelector';
import IndicatorParameterSelector from './components/IndicatorParameterSelector';
import NoIndicatorsHelp from './components/NoIndicatorsHelp';

interface IndicatorSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  const {
    indicatorExpr,
    availableIndicators,
    missingIndicator,
    hasMultipleOutputs,
    getParameterOptions,
    getIndicatorDisplayName,
    updateIndicatorName,
    updateParameter
  } = useIndicatorSelector({ expression, updateExpression });
  
  return (
    <div className="space-y-2">
      {missingIndicator && indicatorExpr.name && (
        <IndicatorMissingAlert
          indicatorName={indicatorExpr.name}
          displayName={getIndicatorDisplayName(indicatorExpr.name)}
        />
      )}
      
      <IndicatorNameSelector
        indicatorName={indicatorExpr.name}
        availableIndicators={availableIndicators}
        missingIndicator={missingIndicator}
        required={required}
        onChange={updateIndicatorName}
        getDisplayName={getIndicatorDisplayName}
        disabled={availableIndicators.length === 0}
      />
      
      {indicatorExpr.name && hasMultipleOutputs(indicatorExpr.name) && (
        <IndicatorParameterSelector
          parameter={indicatorExpr.parameter}
          parameters={getParameterOptions(indicatorExpr.name)}
          onParameterChange={updateParameter}
          required={required && hasMultipleOutputs(indicatorExpr.name)}
        />
      )}
      
      {availableIndicators.length === 0 && (
        <NoIndicatorsHelp />
      )}
    </div>
  );
};

export default IndicatorSelector;
