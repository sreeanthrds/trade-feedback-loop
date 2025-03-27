
import React from 'react';
import { 
  Expression, 
  ExpressionType,
  createDefaultExpression
} from '../../utils/conditionTypes';
import ExpressionEditorRouter from './expression-router/ExpressionEditorRouter';
import ExpressionTypeSelector from './components/ExpressionTypeSelector';

interface ExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ExpressionTypeSelector
          type={expression.type}
          onTypeChange={(type) => {
            // When changing type, we need to create a proper default expression
            // We need to maintain the existing ID to prevent issues with references
            const newExpression = createDefaultExpression(type);
            newExpression.id = expression.id;
            updateExpression(newExpression);
          }}
        />
      </div>
      
      <ExpressionEditorRouter 
        expression={expression} 
        updateExpression={updateExpression} 
      />
    </div>
  );
};

export default ExpressionEditor;
