
import React from 'react';
import { Expression } from '../../../utils/conditions';
import { expressionEditorMap } from '../expression-editors';
import { Label } from '@/components/ui/label';
import ExpressionTypeSelector from './ExpressionTypeSelector';

interface ExpressionWrapperProps {
  label: string;
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
  showLabels?: boolean;
  conditionContext?: 'entry' | 'exit';
}

const ExpressionWrapper: React.FC<ExpressionWrapperProps> = ({
  label,
  expression,
  updateExpression,
  required = false,
  showLabels = true,
  conditionContext = 'entry'
}) => {
  // Get the appropriate editor component for this expression type
  const EditorComponent = expression ? expressionEditorMap[expression.type] : null;

  // Extract only the props that each editor component accepts
  const commonEditorProps = {
    expression,
    updateExpression,
    required
  };

  return (
    <div className="space-y-2 overflow-visible w-full">
      {showLabels && (
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <ExpressionTypeSelector 
            expression={expression} 
            updateExpression={updateExpression}
            conditionContext={conditionContext}
          />
        </div>
      )}
      
      {!showLabels && (
        <div className="flex justify-end">
          <ExpressionTypeSelector 
            expression={expression} 
            updateExpression={updateExpression}
            conditionContext={conditionContext}
          />
        </div>
      )}
      
      {EditorComponent && (
        <EditorComponent
          {...commonEditorProps}
        />
      )}
    </div>
  );
};

export default ExpressionWrapper;
