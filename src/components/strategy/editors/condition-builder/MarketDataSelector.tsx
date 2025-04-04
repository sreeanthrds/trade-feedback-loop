
import React from 'react';
import { 
  Expression, 
  MarketDataExpression
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
  
  // Update the time offset (current, previous, etc.)
  const updateOffset = (value: string) => {
    updateExpression({
      ...marketDataExpr,
      offset: parseInt(value)
    });
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
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
        
        <Select 
          value={String(marketDataExpr.offset || 0)} 
          onValueChange={updateOffset}
        >
          <SelectTrigger className="h-8 min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Current candle</SelectItem>
            <SelectItem value="-1">Previous candle</SelectItem>
            <SelectItem value="-2">2 candles ago</SelectItem>
            <SelectItem value="-3">3 candles ago</SelectItem>
            <SelectItem value="-4">4 candles ago</SelectItem>
            <SelectItem value="-5">5 candles ago</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MarketDataSelector;
