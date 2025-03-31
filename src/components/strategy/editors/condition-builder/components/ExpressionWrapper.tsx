
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import { expressionEditorMap } from '../expression-editors';
import { Label } from '@/components/ui/label';
import ExpressionTypeSelector from './ExpressionTypeSelector';

interface ExpressionWrapperProps {
  label: string;
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const ExpressionWrapper: React.FC<ExpressionWrapperProps> = ({
  label,
  expression,
  updateExpression,
  required = false
}) => {
  // Get the appropriate editor component for this expression type
  const EditorComponent = expression ? expressionEditorMap[expression.type] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <ExpressionTypeSelector 
          expression={expression} 
          updateExpression={updateExpression} 
        />
      </div>
      
      {EditorComponent && (
        <EditorComponent
          expression={expression}
          updateExpression={updateExpression}
          required={required}
        />
      )}
    </div>
  );
};

export default ExpressionWrapper;
