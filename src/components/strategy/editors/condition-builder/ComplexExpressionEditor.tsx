
import React from 'react';
import { 
  Expression, 
  ComplexExpression
} from '../../utils/conditionTypes';
import OperationSelector from './components/OperationSelector';
import ExpressionParts from './components/ExpressionParts';
import { cn } from '@/lib/utils';

interface ComplexExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const ComplexExpressionEditor: React.FC<ComplexExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'expression') {
    return null;
  }

  const complexExpr = expression as ComplexExpression;
  
  // Update the operation (+, -, *, /, %, +%, -%)
  const updateOperation = (value: string) => {
    updateExpression({
      ...complexExpr,
      operation: value as '+' | '-' | '*' | '/' | '%' | '+%' | '-%'
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
    <div className={cn(
      "space-y-3 border border-border rounded-md p-3 mt-2 overflow-visible w-full",
      required && !complexExpr.operation && "border-red-300"
    )}>
      {/* Operation selector */}
      <OperationSelector 
        operation={complexExpr.operation}
        updateOperation={updateOperation}
        required={required}
      />
      
      {/* Left and right expressions - always show labels */}
      <ExpressionParts
        leftExpression={complexExpr.left}
        rightExpression={complexExpr.right}
        updateLeft={updateLeft}
        updateRight={updateRight}
        required={required}
        showLabels={true}
      />
    </div>
  );
};

export default ComplexExpressionEditor;
