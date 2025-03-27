
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ConstantValueEditor from '../components/ConstantValueEditor';

interface ConstantExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ConstantExpressionEditor: React.FC<ConstantExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <ConstantValueEditor
      expression={expression}
      updateExpression={updateExpression}
    />
  );
};

export default ConstantExpressionEditor;
