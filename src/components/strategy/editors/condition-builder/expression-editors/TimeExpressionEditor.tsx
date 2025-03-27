
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import TimeSelector from '../TimeSelector';

interface TimeExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const TimeExpressionEditor: React.FC<TimeExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <TimeSelector
      expression={expression}
      updateExpression={updateExpression}
    />
  );
};

export default TimeExpressionEditor;
