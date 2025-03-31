
import React from 'react';
import ComparisonOperatorSelector from '../ComparisonOperatorSelector';
import type { ComparisonOperator } from '../ComparisonOperatorSelector';
import ExpressionWrapper from '../ExpressionWrapper';
import { cn } from '@/lib/utils';

interface ComparisonExpressionRowProps {
  leftLabel?: string;
  rightLabel?: string;
  operator: ComparisonOperator;
  onOperatorChange: (value: ComparisonOperator) => void;
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  className?: string;
  required?: boolean;
}

const ComparisonExpressionRow: React.FC<ComparisonExpressionRowProps> = ({
  leftLabel = "Left Side",
  rightLabel = "Right Side",
  operator,
  onOperatorChange,
  leftComponent,
  rightComponent,
  className,
  required = false
}) => {
  return (
    <div className={cn("grid grid-cols-[1fr,auto,1fr] gap-2 items-start", className)}>
      <ExpressionWrapper
        label={leftLabel}
        required={required}
      >
        {leftComponent}
      </ExpressionWrapper>
      
      <div className="pt-6">
        <ComparisonOperatorSelector 
          value={operator}
          onValueChange={onOperatorChange}
          required={required}
        />
      </div>
      
      <ExpressionWrapper
        label={rightLabel}
        required={required}
      >
        {rightComponent}
      </ExpressionWrapper>
    </div>
  );
};

export default ComparisonExpressionRow;
