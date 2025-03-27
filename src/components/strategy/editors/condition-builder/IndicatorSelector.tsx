
import React from 'react';
import { Expression, IndicatorExpression } from '../../utils/conditionTypes';
import IndicatorDropdown from './indicator-selector/IndicatorDropdown';
import IndicatorParameterSelector from './indicator-selector/IndicatorParameterSelector';
import IndicatorWarning from './indicator-selector/IndicatorWarning';
import EmptyIndicatorMessage from './indicator-selector/EmptyIndicatorMessage';
import { useIndicatorUtils } from './indicator-selector/useIndicatorUtils';

interface IndicatorSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  expression,
  updateExpression
}) => {
  if (expression.type !== 'indicator') {
    return null;
  }

  const indicatorExpr = expression as IndicatorExpression;
  const { 
    availableIndicators, 
    missingIndicator, 
    hasMultipleOutputs, 
    getIndicatorDisplayName 
  } = useIndicatorUtils({ expression: indicatorExpr });
  
  const updateIndicatorName = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      name: value,
      parameter: undefined
    });
  };
  
  const updateParameter = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      parameter: value
    });
  };
  
  return (
    <div className="space-y-2">
      <IndicatorWarning 
        indicatorName={indicatorExpr.name}
        displayName={getIndicatorDisplayName(indicatorExpr.name)}
        isMissing={missingIndicator}
      />
      
      <IndicatorDropdown
        indicatorName={indicatorExpr.name}
        onIndicatorChange={updateIndicatorName}
        availableIndicators={availableIndicators}
        getIndicatorDisplayName={getIndicatorDisplayName}
        isMissingIndicator={missingIndicator}
      />
      
      {indicatorExpr.name && (
        <IndicatorParameterSelector
          indicator={indicatorExpr.name}
          parameter={indicatorExpr.parameter}
          onParameterChange={updateParameter}
          hasMultipleOutputs={hasMultipleOutputs(indicatorExpr.name)}
        />
      )}
      
      {availableIndicators.length === 0 && <EmptyIndicatorMessage />}
    </div>
  );
};

export default IndicatorSelector;
