
import React from 'react';
import { Expression } from '../../../utils/conditions';
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
    <div className="w-full overflow-visible">
      <div className="grid grid-cols-2 gap-3 w-full overflow-visible">
        <ExpressionWrapper
          label=""
          expression={leftExpression}
          updateExpression={updateLeft}
          required={required}
          showLabels={showLabels}
        />
        <ExpressionWrapper
          label=""
          expression={rightExpression}
          updateExpression={updateRight}
          required={required}
          showLabels={showLabels}
        />
      </div>
    </div>
  );
};

export default ExpressionParts;
