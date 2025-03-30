
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import ExpressionEditor from '../ExpressionEditor';

interface ExpressionPartsProps {
  leftExpression: Expression;
  rightExpression: Expression;
  updateLeft: (expr: Expression) => void;
  updateRight: (expr: Expression) => void;
}

const ExpressionParts: React.FC<ExpressionPartsProps> = ({
  leftExpression,
  rightExpression,
  updateLeft,
  updateRight
}) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Left Expression</div>
        <ExpressionEditor
          expression={leftExpression}
          updateExpression={updateLeft}
        />
      </div>
      
      <div>
        <div className="text-xs text-muted-foreground mb-1">Right Expression</div>
        <ExpressionEditor
          expression={rightExpression}
          updateExpression={updateRight}
        />
      </div>
    </div>
  );
};

export default ExpressionParts;
