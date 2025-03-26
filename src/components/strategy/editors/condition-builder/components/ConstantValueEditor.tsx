
import React from 'react';
import { 
  Expression, 
  ConstantExpression,
  isConstantExpression
} from '../../../utils/conditionTypes';
import { Input } from '@/components/ui/input';

interface ConstantValueEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ConstantValueEditor: React.FC<ConstantValueEditorProps> = ({
  expression,
  updateExpression
}) => {
  if (!isConstantExpression(expression)) {
    return null;
  }

  const constExpr = expression as ConstantExpression;
  
  const updateValue = (value: string) => {
    const numberValue = !isNaN(Number(value)) ? Number(value) : value;
    const updated: ConstantExpression = {
      ...constExpr,
      value: numberValue
    };
    updateExpression(updated);
  };
  
  return (
    <div>
      <Input
        type="text"
        value={constExpr.value}
        onChange={(e) => updateValue(e.target.value)}
        className="h-8"
        placeholder="Enter value"
      />
    </div>
  );
};

export default ConstantValueEditor;
