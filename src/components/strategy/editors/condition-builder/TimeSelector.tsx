
import React, { useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';

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
  
  // State for the specific time input
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    timeExpr.function === 'specific_date' && timeExpr.parameters?.date ? 
    new Date(timeExpr.parameters.date) : undefined
  );
  
  // Update the time function
  const updateFunction = (value: string) => {
    let newParams;
    
    // Reset parameters based on function type
    switch (value) {
      case 'n_seconds_ago':
      case 'n_minutes_ago':
      case 'n_hours_ago':
      case 'n_days_ago':
        newParams = 1;
        break;
      case 'specific_date':
        newParams = selectedDate ? { date: selectedDate.toISOString() } : { date: new Date().toISOString() };
        break;
      default:
        newParams = undefined;
    }
    
    updateExpression({
      ...timeExpr,
      function: value,
      parameters: newParams
    });
  };
  
  // Update numerical parameter (for 'n_X_ago' functions)
  const updateNumberParameter = (value: string) => {
    const numValue = parseInt(value) || 1;
    updateExpression({
      ...timeExpr,
      parameters: numValue
    });
  };
  
  // Update date parameter (for 'specific_date' function)
  const updateDateParameter = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    updateExpression({
      ...timeExpr,
      parameters: { date: date.toISOString() }
    });
  };
  
  // Get the label for the numeric input based on function
  const getTimeUnitLabel = () => {
    switch (timeExpr.function) {
      case 'n_seconds_ago': return 'seconds';
      case 'n_minutes_ago': return 'minutes';
      case 'n_hours_ago': return 'hours';
      case 'n_days_ago': return 'days';
      default: return '';
    }
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
          <SelectItem value="n_seconds_ago">Seconds ago</SelectItem>
          <SelectItem value="n_minutes_ago">Minutes ago</SelectItem>
          <SelectItem value="n_hours_ago">Hours ago</SelectItem>
          <SelectItem value="n_days_ago">Days ago</SelectItem>
          <SelectItem value="specific_date">Specific date</SelectItem>
          <SelectItem value="this_week">This week</SelectItem>
          <SelectItem value="last_week">Last week</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
        </SelectContent>
      </Select>
      
      {(timeExpr.function === 'n_seconds_ago' || 
        timeExpr.function === 'n_minutes_ago' || 
        timeExpr.function === 'n_hours_ago' || 
        timeExpr.function === 'n_days_ago') && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={timeExpr.parameters || 1}
            onChange={(e) => updateNumberParameter(e.target.value)}
            className={cn(
              "h-8 w-24",
              required && !timeExpr.parameters && "border-red-300 focus:ring-red-200"
            )}
          />
          <span className="text-xs text-muted-foreground">{getTimeUnitLabel()}</span>
        </div>
      )}
      
      {timeExpr.function === 'specific_date' && (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-8 px-3 justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={updateDateParameter}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
