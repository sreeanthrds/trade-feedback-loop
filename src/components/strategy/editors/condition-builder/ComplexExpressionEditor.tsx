
import React from 'react';
import { 
  Expression, 
  ComplexExpression,
  createDefaultExpression,
  isComplexExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExpressionEditor from './ExpressionEditor';

interface ComplexExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ComplexExpressionEditor: React.FC<ComplexExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  if (!isComplexExpression(expression)) {
    return null;
  }

  const complexExpr = expression as ComplexExpression;
  
  // Update the operation (+, -, *, /, %)
  const updateOperation = (value: string) => {
    const updated: ComplexExpression = {
      ...complexExpr,
      operation: value as '+' | '-' | '*' | '/' | '%'
    };
    updateExpression(updated);
  };
  
  // Update the left expression
  const updateLeft = (expr: Expression) => {
    const updated: ComplexExpression = {
      ...complexExpr,
      left: expr
    };
    updateExpression(updated);
  };
  
  // Update the right expression
  const updateRight = (expr: Expression) => {
    const updated: ComplexExpression = {
      ...complexExpr,
      right: expr
    };
    updateExpression(updated);
  };
  
  return (
    <div className="space-y-3 border border-border rounded-md p-3 mt-2">
      {/* Operation selector */}
      <Select 
        value={complexExpr.operation} 
        onValueChange={updateOperation}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+">Addition (+)</SelectItem>
          <SelectItem value="-">Subtraction (-)</SelectItem>
          <SelectItem value="*">Multiplication (×)</SelectItem>
          <SelectItem value="/">Division (÷)</SelectItem>
          <SelectItem value="%">Modulo (%)</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Left and right expressions */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Left Expression</div>
          <ExpressionEditor
            expression={complexExpr.left}
            updateExpression={updateLeft}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Right Expression</div>
          <ExpressionEditor
            expression={complexExpr.right}
            updateExpression={updateRight}
          />
        </div>
      </div>
    </div>
  );
};

export default ComplexExpressionEditor;
