
import React from 'react';
import { Expression, ExecutionDataExpression } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ExecutionDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ExecutionDataExpressionEditor: React.FC<ExecutionDataExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  if (expression.type !== 'execution_data') {
    return null;
  }

  const executionExpr = expression as ExecutionDataExpression;
  
  // Field options for execution data
  const executionFields = [
    { value: 'orderStatus', label: 'Order Status' },
    { value: 'filledQuantity', label: 'Filled Quantity' },
    { value: 'remainingQuantity', label: 'Remaining Quantity' },
    { value: 'executionPrice', label: 'Execution Price' },
    { value: 'slippage', label: 'Slippage' },
    { value: 'orderAge', label: 'Order Age (seconds)' },
    { value: 'marketImpact', label: 'Market Impact' },
  ];

  // Status options for orderStatus
  const statusOptions = [
    { value: 'FILLED', label: 'Filled' },
    { value: 'PARTIALLY_FILLED', label: 'Partially Filled' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Update the field
  const updateField = (value: string) => {
    updateExpression({
      ...executionExpr,
      field: value
    });
  };

  // Update VPI (used as order reference)
  const updateVPI = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateExpression({
      ...executionExpr,
      vpi: event.target.value
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="execution-field" className="text-xs block mb-1">Execution Data Field</Label>
        <Select 
          value={executionExpr.field} 
          onValueChange={updateField}
        >
          <SelectTrigger id="execution-field" className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {executionFields.map(field => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="execution-vpi" className="text-xs block mb-1">Order Reference (Optional)</Label>
        <Input
          id="execution-vpi"
          className="h-8 text-xs"
          placeholder="Order ID"
          value={executionExpr.vpi || ''}
          onChange={updateVPI}
        />
      </div>

      {executionExpr.field === 'orderStatus' && (
        <div className="bg-muted/40 p-2 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Compare with these values:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {statusOptions.map(option => (
              <div key={option.value} className="text-xs">
                "{option.value}" - {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionDataExpressionEditor;
