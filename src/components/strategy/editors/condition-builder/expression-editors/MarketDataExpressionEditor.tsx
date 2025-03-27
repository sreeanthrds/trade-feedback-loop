
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import MarketDataSelector from '../MarketDataSelector';

interface MarketDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const MarketDataExpressionEditor: React.FC<MarketDataExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  return (
    <MarketDataSelector
      expression={expression}
      updateExpression={updateExpression}
    />
  );
};

export default MarketDataExpressionEditor;
