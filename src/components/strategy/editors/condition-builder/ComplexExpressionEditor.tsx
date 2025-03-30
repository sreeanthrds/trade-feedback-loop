
import React from 'react';
import { 
  Expression, 
  ComplexExpression
} from '../../utils/conditionTypes';
import OperationSelector from './components/OperationSelector';
import ExpressionParts from './components/ExpressionParts';

interface ComplexExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ComplexExpressionEditor: React.FC<ComplexExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  if (expression.type !== 'expression') {
    return null;
  }

  const complexExpr = expression as ComplexExpression;
  
  // Update the operation (+, -, *, /, %)
  const updateOperation = (value: string) => {
    updateExpression({
      ...complexExpr,
      operation: value as '+' | '-' | '*' | '/' | '%'
    });
  };
  
  // Update the left expression
  const updateLeft = (expr: Expression) => {
    updateExpression({
      ...complexExpr,
      left: expr
    });
  };
  
  // Update the right expression
  const updateRight = (expr: Expression) => {
    updateExpression({
      ...complexExpr,
      right: expr
    });
  };
  
  return (
    <div className="space-y-3 border border-border rounded-md p-3 mt-2">
      {/* Operation selector */}
      <OperationSelector 
        operation={complexExpr.operation}
        updateOperation={updateOperation}
      />
      
      {/* Left and right expressions */}
      <ExpressionParts
        leftExpression={complexExpr.left}
        rightExpression={complexExpr.right}
        updateLeft={updateLeft}
        updateRight={updateRight}
      />
    </div>
  );
};

export default ComplexExpressionEditor;
