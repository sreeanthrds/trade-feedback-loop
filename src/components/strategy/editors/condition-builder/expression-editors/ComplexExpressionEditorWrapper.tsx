
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ComplexExpressionEditor from '../ComplexExpressionEditor';

interface ComplexExpressionEditorWrapperProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const ComplexExpressionEditorWrapper: React.FC<ComplexExpressionEditorWrapperProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  return (
    <ComplexExpressionEditor
      expression={expression}
      updateExpression={updateExpression}
      required={required}
    />
  );
};

export default ComplexExpressionEditorWrapper;
