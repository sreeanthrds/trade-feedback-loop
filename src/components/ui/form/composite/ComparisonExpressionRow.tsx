
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
  showLabels?: boolean;
}

const ComparisonExpressionRow: React.FC<ComparisonExpressionRowProps> = ({
  leftLabel = "Left Side",
  rightLabel = "Right Side",
  operator,
  onOperatorChange,
  leftComponent,
  rightComponent,
  className,
  required = false,
  showLabels = true
}) => {
  return (
    <div className={cn("expression-grid", className)}>
      <ExpressionWrapper
        label={leftLabel}
        required={required}
        showLabel={showLabels}
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
        showLabel={showLabels}
      >
        {rightComponent}
      </ExpressionWrapper>
    </div>
  );
};

export default ComparisonExpressionRow;
