
import React from 'react';
import { 
  Expression, 
  MarketDataExpression
} from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface MarketDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const MarketDataExpressionEditor: React.FC<MarketDataExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'market_data') {
    return null;
  }

  const marketDataExpr = expression as MarketDataExpression;
  
  // Update the field (Open, High, Low, Close, etc.)
  const updateField = (value: string) => {
    updateExpression({
      ...marketDataExpr,
      field: value
    });
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={marketDataExpr.field} 
        onValueChange={updateField}
      >
        <SelectTrigger className={cn(
          "h-8",
          required && !marketDataExpr.field && "border-red-300 focus:ring-red-200"
        )}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Close">Close</SelectItem>
          <SelectItem value="Volume">Volume</SelectItem>
          <SelectItem value="LTP">LTP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MarketDataExpressionEditor;
