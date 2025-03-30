
import React from 'react';
import { 
  Condition, 
} from '../../utils/conditionTypes';
import OperatorSelector from './components/OperatorSelector';
import ExpressionWrapper from './components/ExpressionWrapper';

interface SingleConditionEditorProps {
  condition: Condition;
  updateCondition: (updated: Condition) => void;
}

const SingleConditionEditor: React.FC<SingleConditionEditorProps> = ({
  condition,
  updateCondition
}) => {
  // Update the condition operator
  const updateOperator = (value: string) => {
    updateCondition({
      ...condition,
      operator: value as any
    });
  };

  // Update the left-hand side expression
  const updateLhs = (expr: any) => {
    updateCondition({
      ...condition,
      lhs: expr
    });
  };

  // Update the right-hand side expression
  const updateRhs = (expr: any) => {
    updateCondition({
      ...condition,
      rhs: expr
    });
  };

  // Check if the condition requires values
  // For comparison operators, both sides are required
  const requiresValues = ['>', '<', '>=', '<=', '==', '!='].includes(condition.operator);

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
      {/* Left-hand side expression */}
      <ExpressionWrapper
        label="Left Side"
        expression={condition.lhs}
        updateExpression={updateLhs}
        required={requiresValues}
      />
      
      {/* Operator */}
      <div className="pt-6">
        <OperatorSelector 
          operator={condition.operator}
          updateOperator={updateOperator}
        />
      </div>
      
      {/* Right-hand side expression */}
      <ExpressionWrapper
        label="Right Side"
        expression={condition.rhs}
        updateExpression={updateRhs}
        required={requiresValues}
      />
    </div>
  );
};

export default SingleConditionEditor;
