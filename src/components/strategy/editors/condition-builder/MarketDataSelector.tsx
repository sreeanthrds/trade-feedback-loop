
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
import CandleOffsetSelector from './components/CandleOffsetSelector';

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
  const updateOffset = (value: number) => {
    updateExpression({
      ...marketDataExpr,
      offset: value
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
      </div>
      
      <CandleOffsetSelector 
        offset={marketDataExpr.offset || 0}
        onOffsetChange={updateOffset}
      />
    </div>
  );
};

export default MarketDataSelector;
