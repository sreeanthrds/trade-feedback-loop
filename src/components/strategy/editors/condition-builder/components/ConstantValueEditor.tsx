
import React from 'react';
import { 
  Expression, 
  ConstantExpression
} from '../../../utils/conditions';
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
  const isEmpty = constantExpr.value === undefined || constantExpr.value === null || constantExpr.value === '';
  const showRequired = required && isEmpty;
  
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
    <div className="relative">
      {showRequired && (
        <span className="absolute -top-1 right-0 text-red-500 text-xs">*</span>
      )}
      <Input
        value={constantExpr.value?.toString() || ''}
        onChange={updateConstantValue}
        className={cn("h-8", showRequired && "border-red-300 focus:ring-red-200")}
        placeholder={required ? "Required" : ""}
      />
    </div>
  );
};

export default ConstantValueEditor;
