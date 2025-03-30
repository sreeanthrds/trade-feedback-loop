
import React from 'react';
import { 
  Expression, 
  ConstantExpression
} from '../../../utils/conditionTypes';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ConstantValueEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const ConstantValueEditor: React.FC<ConstantValueEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'constant') {
    return null;
  }

  const constantExpr = expression as ConstantExpression;
  
  // Update constant value
  const updateConstantValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string for temporary editing state
    if (value === '') {
      updateExpression({
        ...constantExpr,
        value: ''
      });
      return;
    }
    
    // Try to convert to number if possible
    const numValue = !isNaN(Number(value)) ? Number(value) : value;
    updateExpression({
      ...constantExpr,
      value: numValue
    });
  };
  
  return (
    <Input
      value={constantExpr.value?.toString() || ''}
      onChange={updateConstantValue}
      className={cn("h-8", required && "border-red-200 focus:border-red-400")}
      placeholder={required ? "Required" : ""}
    />
  );
};

export default ConstantValueEditor;
