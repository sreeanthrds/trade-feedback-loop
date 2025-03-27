
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ComplexExpressionEditor from '../ComplexExpressionEditor';

interface ComplexExpressionEditorWrapperProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ComplexExpressionEditorWrapper: React.FC<ComplexExpressionEditorWrapperProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <ComplexExpressionEditor
      expression={expression}
      updateExpression={updateExpression}
    />
  );
};

export default ComplexExpressionEditorWrapper;
