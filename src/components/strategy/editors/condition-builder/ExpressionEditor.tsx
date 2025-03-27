
import React from 'react';
import { 
  Expression, 
  ExpressionType,
  createDefaultExpression
} from '../../utils/conditionTypes';
import MarketDataSelector from './MarketDataSelector';
import IndicatorSelector from './IndicatorSelector';
import TimeSelector from './TimeSelector';
import ComplexExpressionEditor from './ComplexExpressionEditor';
import ExpressionTypeSelector from './components/ExpressionTypeSelector';
import ConstantValueEditor from './components/ConstantValueEditor';

interface ExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  // Change expression type (indicator, market_data, constant, etc.)
  const changeExpressionType = (type: ExpressionType) => {
    const newExpr = createDefaultExpression(type);
    newExpr.id = expression.id; // Keep the same ID
    updateExpression(newExpr);
  };

  // Render the appropriate editor based on expression type
  const renderExpressionEditor = () => {
    switch (expression.type) {
      case 'indicator':
        return (
          <IndicatorSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'market_data':
        return (
          <MarketDataSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'constant':
        return (
          <ConstantValueEditor
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'time_function':
        return (
          <TimeSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'expression':
        return (
          <ComplexExpressionEditor
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ExpressionTypeSelector
          type={expression.type}
          onTypeChange={changeExpressionType}
        />
      </div>
      
      {renderExpressionEditor()}
    </div>
  );
};

export default ExpressionEditor;
