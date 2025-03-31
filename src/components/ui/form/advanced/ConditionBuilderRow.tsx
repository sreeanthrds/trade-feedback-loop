
import React from 'react';
import { ComparisonExpressionRow } from '../composite';
import { ComparisonOperator } from '../ComparisonOperatorSelector';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionBuilderRowProps {
  operator: ComparisonOperator;
  onOperatorChange: (value: ComparisonOperator) => void;
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  onDelete?: () => void;
  canDelete?: boolean;
  className?: string;
  required?: boolean;
}

const ConditionBuilderRow: React.FC<ConditionBuilderRowProps> = ({
  operator,
  onOperatorChange,
  leftComponent,
  rightComponent,
  onDelete,
  canDelete = true,
  className,
  required = false
}) => {
  return (
    <div className={cn("relative group condition-item", className)}>
      <ComparisonExpressionRow
        operator={operator}
        onOperatorChange={onOperatorChange}
        leftComponent={leftComponent}
        rightComponent={rightComponent}
        required={required}
      />
      
      {canDelete && onDelete && (
        <div className="absolute -right-10 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConditionBuilderRow;
