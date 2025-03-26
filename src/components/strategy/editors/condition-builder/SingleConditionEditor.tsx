
import React from 'react';
import { 
  Condition, 
  Expression,
  ComparisonOperator,
  createDefaultExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ExpressionEditor from './ExpressionEditor';

interface SingleConditionEditorProps {
  condition: Condition;
  updateCondition: (updated: Condition) => void;
}

const SingleConditionEditor: React.FC<SingleConditionEditorProps> = ({
  condition,
  updateCondition
}) => {
  // Ensure we have valid expressions
  const safeCondition: Condition = {
    ...condition,
    lhs: condition.lhs || createDefaultExpression('indicator'),
    rhs: condition.rhs || createDefaultExpression('constant'),
    operator: condition.operator || '=='
  };

  // Update the condition operator
  const updateOperator = (value: string) => {
    updateCondition({
      ...safeCondition,
      operator: value as ComparisonOperator
    });
  };

  // Update the left-hand side expression
  const updateLhs = (expr: Expression) => {
    if (!expr) return;
    updateCondition({
      ...safeCondition,
      lhs: expr
    });
  };

  // Update the right-hand side expression
  const updateRhs = (expr: Expression) => {
    if (!expr) return;
    updateCondition({
      ...safeCondition,
      rhs: expr
    });
  };

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
      {/* Left-hand side expression */}
      <div>
        <Label className="text-xs mb-1 block">Left Side</Label>
        <ExpressionEditor 
          expression={safeCondition.lhs}
          updateExpression={updateLhs}
        />
      </div>
      
      {/* Operator */}
      <div className="pt-6">
        <Select 
          value={safeCondition.operator} 
          onValueChange={updateOperator}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=">">{'>'}</SelectItem>
            <SelectItem value="<">{'<'}</SelectItem>
            <SelectItem value=">=">{'≥'}</SelectItem>
            <SelectItem value="<=">{'≤'}</SelectItem>
            <SelectItem value="==">{'='}</SelectItem>
            <SelectItem value="!=">{'≠'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Right-hand side expression */}
      <div>
        <Label className="text-xs mb-1 block">Right Side</Label>
        <ExpressionEditor 
          expression={safeCondition.rhs}
          updateExpression={updateRhs}
        />
      </div>
    </div>
  );
};

export default SingleConditionEditor;
