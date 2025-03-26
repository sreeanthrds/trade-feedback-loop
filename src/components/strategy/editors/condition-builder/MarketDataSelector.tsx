
import React from 'react';
import { 
  Expression, 
  MarketDataExpression,
  isMarketDataExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MarketDataSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const MarketDataSelector: React.FC<MarketDataSelectorProps> = ({
  expression,
  updateExpression
}) => {
  if (!isMarketDataExpression(expression)) {
    return null;
  }

  const marketDataExpr = expression as MarketDataExpression;
  
  // Update the field (Open, High, Low, Close, etc.)
  const updateField = (value: string) => {
    const updated: MarketDataExpression = {
      ...marketDataExpr,
      field: value
    };
    updateExpression(updated);
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={marketDataExpr.field} 
        onValueChange={updateField}
      >
        <SelectTrigger className="h-8">
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

export default MarketDataSelector;
