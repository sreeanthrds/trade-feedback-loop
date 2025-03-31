
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import IndicatorSelector from '../IndicatorSelector';

interface IndicatorExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const IndicatorExpressionEditor: React.FC<IndicatorExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  return (
    <IndicatorSelector
      expression={expression}
      updateExpression={updateExpression}
      required={required}
    />
  );
};

export default IndicatorExpressionEditor;
