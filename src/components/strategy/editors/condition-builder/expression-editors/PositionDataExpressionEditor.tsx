
import React from 'react';
import { Expression, PositionDataExpression } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PositionDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const PositionDataExpressionEditor: React.FC<PositionDataExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'position_data') {
    return null;
  }

  const positionExpr = expression as PositionDataExpression;
  
  // Field options for position data
  const positionFields = [
    { value: 'unrealizedPnl', label: 'Unrealized P&L' },
    { value: 'realizedPnl', label: 'Realized P&L' },
    { value: 'quantity', label: 'Position Size' },
    { value: 'entryPrice', label: 'Entry Price' },
    { value: 'marketValue', label: 'Market Value' },
    { value: 'costBasis', label: 'Cost Basis' },
    { value: 'percentChange', label: 'Percent Change' },
  ];

  // Update the field
  const updateField = (value: string) => {
    updateExpression({
      ...positionExpr,
      field: value
    });
  };

  // Update VPI
  const updateVPI = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateExpression({
      ...positionExpr,
      vpi: event.target.value
    });
  };

  // Update VPT
  const updateVPT = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateExpression({
      ...positionExpr,
      vpt: event.target.value
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="position-field" className="text-xs block mb-1">Position Field</Label>
        <Select 
          value={positionExpr.field || ''} 
          onValueChange={updateField}
        >
          <SelectTrigger 
            id="position-field" 
            className={cn("h-8", required && !positionExpr.field && "border-red-300 focus:ring-red-200")}
          >
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {positionFields.map(field => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="position-vpi" className="text-xs block mb-1">VPI Filter (Optional)</Label>
          <Input
            id="position-vpi"
            className="h-8 text-xs"
            placeholder="Position ID"
            value={positionExpr.vpi || ''}
            onChange={updateVPI}
          />
        </div>
        <div>
          <Label htmlFor="position-vpt" className="text-xs block mb-1">VPT Filter (Optional)</Label>
          <Input
            id="position-vpt"
            className="h-8 text-xs"
            placeholder="Position Tag"
            value={positionExpr.vpt || ''}
            onChange={updateVPT}
          />
        </div>
      </div>
    </div>
  );
};

export default PositionDataExpressionEditor;
