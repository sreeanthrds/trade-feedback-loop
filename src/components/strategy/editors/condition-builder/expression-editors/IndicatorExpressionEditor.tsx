
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import IndicatorSelector from '../IndicatorSelector';

interface IndicatorExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const IndicatorExpressionEditor: React.FC<IndicatorExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <IndicatorSelector
      expression={expression}
      updateExpression={updateExpression}
    />
  );
};

export default IndicatorExpressionEditor;
