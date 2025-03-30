
import React from 'react';
import { Expression } from '../../../utils/conditionTypes';
import { Label } from '@/components/ui/label';
import ExpressionEditor from '../ExpressionEditor';

interface ExpressionWrapperProps {
  label: string;
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ExpressionWrapper: React.FC<ExpressionWrapperProps> = ({
  label,
  expression,
  updateExpression
}) => {
  return (
    <div>
      <Label className="text-xs mb-1 block">{label}</Label>
      <ExpressionEditor 
        expression={expression}
        updateExpression={updateExpression}
      />
    </div>
  );
};

export default ExpressionWrapper;
