
import React from 'react';
import { 
  Expression, 
  ExpressionType
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
            // Type change logic is now handled directly here
            updateExpression({
              ...expression,
              type
            });
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
