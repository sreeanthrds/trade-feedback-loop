
import React from 'react';
import { 
  Expression, 
  TimeFunctionExpression
} from '../../utils/conditions';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'time_function') {
    return null;
  }

  const timeExpr = expression as TimeFunctionExpression;
  
  // Update the time function
  const updateFunction = (value: string) => {
    updateExpression({
      ...timeExpr,
      function: value,
      // Reset parameters for functions that don't need them
      parameters: value === 'n_days_ago' ? (timeExpr.parameters || 1) : undefined
    });
  };
  
  // Update days parameter for 'n_days_ago'
  const updateDaysParameter = (value: string) => {
    const numValue = parseInt(value) || 1;
    updateExpression({
      ...timeExpr,
      parameters: numValue
    });
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={timeExpr.function} 
        onValueChange={updateFunction}
      >
        <SelectTrigger 
          className={cn(
            "h-8", 
            required && !timeExpr.function && "border-red-300 focus:ring-red-200"
          )}
        >
          <SelectValue placeholder="Select time function" />
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
          className={cn(
            "h-8",
            required && !timeExpr.parameters && "border-red-300 focus:ring-red-200"
          )}
        />
      )}
    </div>
  );
};

export default TimeSelector;
