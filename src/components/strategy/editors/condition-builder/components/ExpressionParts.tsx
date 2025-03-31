
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ExpressionWrapper from './ExpressionWrapper';

interface ExpressionPartsProps {
  leftExpression: Expression;
  rightExpression: Expression;
  updateLeft: (expr: Expression) => void;
  updateRight: (expr: Expression) => void;
  required?: boolean;
}

const ExpressionParts: React.FC<ExpressionPartsProps> = ({
  leftExpression,
  rightExpression,
  updateLeft,
  updateRight,
  required = false
}) => {
  return (
    <div className="condition-scroll-container">
      <div className="grid grid-cols-2 gap-3 min-w-[600px]">
        <ExpressionWrapper
          label="Left Expression"
          expression={leftExpression}
          updateExpression={updateLeft}
          required={required}
        />
        <ExpressionWrapper
          label="Right Expression"
          expression={rightExpression}
          updateExpression={updateRight}
          required={required}
        />
      </div>
    </div>
  );
};

export default ExpressionParts;
