
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import IndicatorSelector from '../IndicatorSelector';
import MarketDataSelector from '../MarketDataSelector';
import TimeSelector from '../TimeSelector';
import ComplexExpressionEditor from '../ComplexExpressionEditor';
import ConstantValueEditor from '../components/ConstantValueEditor';

interface ExpressionEditorRouterProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

/**
 * Routes to the appropriate editor based on expression type
 */
const ExpressionEditorRouter: React.FC<ExpressionEditorRouterProps> = ({
  expression,
  updateExpression
}) => {
  // Render the appropriate editor based on expression type
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

export default ExpressionEditorRouter;
