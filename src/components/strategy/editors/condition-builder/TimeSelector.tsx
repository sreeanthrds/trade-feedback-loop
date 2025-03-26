
import React from 'react';
import { 
  Expression, 
  TimeFunctionExpression,
  isTimeFunctionExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TimeSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  expression,
  updateExpression
}) => {
  if (!isTimeFunctionExpression(expression)) {
    return null;
  }

  const timeExpr = expression as TimeFunctionExpression;
  
  // Update the time function
  const updateFunction = (value: string) => {
    const updated: TimeFunctionExpression = {
      ...timeExpr,
      function: value,
      // Reset parameters for functions that don't need them
      parameters: value === 'n_days_ago' ? (timeExpr.parameters || 1) : undefined
    };
    updateExpression(updated);
  };
  
  // Update days parameter for 'n_days_ago'
  const updateDaysParameter = (value: string) => {
    const numValue = parseInt(value) || 1;
    const updated: TimeFunctionExpression = {
      ...timeExpr,
      parameters: numValue
    };
    updateExpression(updated);
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={timeExpr.function} 
        onValueChange={updateFunction}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="n_days_ago">N days ago</SelectItem>
          <SelectItem value="this_week">This week</SelectItem>
          <SelectItem value="last_week">Last week</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
        </SelectContent>
      </Select>
      
      {timeExpr.function === 'n_days_ago' && (
        <Input
          type="number"
          min="1"
          value={timeExpr.parameters || 1}
          onChange={(e) => updateDaysParameter(e.target.value)}
          className="h-8"
        />
      )}
    </div>
  );
};

export default TimeSelector;
