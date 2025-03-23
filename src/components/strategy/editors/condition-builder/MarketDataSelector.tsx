
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
      field: value,
      // Clear sub-indicator when changing field
      sub_indicator: value === 'PivotPoints' ? 'Pivot' : undefined
    });
  };
  
  // Update sub-indicator for fields that have them (like PivotPoints)
  const updateSubIndicator = (value: string) => {
    updateExpression({
      ...marketDataExpr,
      sub_indicator: value
    });
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
          <SelectItem value="PivotPoints">Pivot Points</SelectItem>
        </SelectContent>
      </Select>
      
      {marketDataExpr.field === 'PivotPoints' && (
        <Select 
          value={marketDataExpr.sub_indicator || 'Pivot'} 
          onValueChange={updateSubIndicator}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pivot">Pivot</SelectItem>
            <SelectItem value="R1">Resistance 1</SelectItem>
            <SelectItem value="R2">Resistance 2</SelectItem>
            <SelectItem value="R3">Resistance 3</SelectItem>
            <SelectItem value="S1">Support 1</SelectItem>
            <SelectItem value="S2">Support 2</SelectItem>
            <SelectItem value="S3">Support 3</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default MarketDataSelector;
