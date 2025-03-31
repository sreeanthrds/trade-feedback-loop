
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ExpressionWrapper from './ExpressionWrapper';

interface ExpressionPartsProps {
  leftExpression: Expression;
  rightExpression: Expression;
  updateLeft: (expr: Expression) => void;
  updateRight: (expr: Expression) => void;
  required?: boolean;
  showLabels?: boolean;
}

const ExpressionParts: React.FC<ExpressionPartsProps> = ({
  leftExpression,
  rightExpression,
  updateLeft,
  updateRight,
  required = false,
  showLabels = true
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ExpressionWrapper
        label="Left Expression"
        expression={leftExpression}
        updateExpression={updateLeft}
        required={required}
        showLabel={showLabels}
      />
      <ExpressionWrapper
        label="Right Expression"
        expression={rightExpression}
        updateExpression={updateRight}
        required={required}
        showLabel={showLabels}
      />
    </div>
  );
};

export default ExpressionParts;
