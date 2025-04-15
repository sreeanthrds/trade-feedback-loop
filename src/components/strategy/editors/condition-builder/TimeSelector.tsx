
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
  
  // State for the specific date and time inputs
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    timeExpr.function === 'specific_date' && timeExpr.parameters?.date ? 
    new Date(timeExpr.parameters.date) : undefined
  );
  
  const [selectedDatetime, setSelectedDatetime] = useState<Date | undefined>(
    timeExpr.function === 'specific_datetime' && timeExpr.parameters?.datetime ? 
    new Date(timeExpr.parameters.datetime) : undefined
  );
  
  const [selectedTime, setSelectedTime] = useState<string>(
    timeExpr.function === 'specific_time' && timeExpr.parameters?.time ? 
    timeExpr.parameters.time : ''
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
      case 'specific_datetime':
        newParams = selectedDatetime ? { datetime: selectedDatetime.toISOString() } : { datetime: new Date().toISOString() };
        break;
      case 'specific_time':
        newParams = selectedTime ? { time: selectedTime } : { time: format(new Date(), 'HH:mm:ss') };
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
  
  // Update datetime parameter (for 'specific_datetime' function)
  const updateDatetimeParameter = (date: Date | undefined) => {
    if (!date) return;
    
    // Keep the time component when updating just the date part
    const newDatetime = selectedDatetime ? 
      new Date(
        date.getFullYear(), 
        date.getMonth(), 
        date.getDate(),
        selectedDatetime.getHours(),
        selectedDatetime.getMinutes(),
        selectedDatetime.getSeconds()
      ) : 
      date;
    
    setSelectedDatetime(newDatetime);
    updateExpression({
      ...timeExpr,
      parameters: { datetime: newDatetime.toISOString() }
    });
  };
  
  // Update time part of datetime
  const updateDatetimeTimeParameter = (timeStr: string) => {
    if (!timeStr) return;
    
    // Fixed: Ensure we convert string parts to numbers before using them
    const [hoursStr, minutesStr, secondsStr = '00'] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;
    const seconds = parseInt(secondsStr, 10) || 0;
    
    const newDatetime = selectedDatetime || new Date();
    newDatetime.setHours(hours, minutes, seconds);
    
    setSelectedDatetime(new Date(newDatetime));
    updateExpression({
      ...timeExpr,
      parameters: { datetime: newDatetime.toISOString() }
    });
  };
  
  // Update time parameter (for 'specific_time' function)
  const updateTimeParameter = (timeStr: string) => {
    setSelectedTime(timeStr);
    updateExpression({
      ...timeExpr,
      parameters: { time: timeStr }
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
          <SelectItem value="specific_datetime">Specific date & time</SelectItem>
          <SelectItem value="specific_time">Specific time</SelectItem>
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
      
      {timeExpr.function === 'specific_datetime' && (
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-8 px-3 justify-start text-left font-normal",
                  !selectedDatetime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDatetime ? format(selectedDatetime, 'PP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDatetime}
                onSelect={updateDatetimeParameter}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time" 
              step="1"
              className="h-8 max-w-[200px]"
              value={
                selectedDatetime ? 
                format(selectedDatetime, 'HH:mm:ss') : 
                format(new Date(), 'HH:mm:ss')
              }
              onChange={(e) => updateDatetimeTimeParameter(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {timeExpr.function === 'specific_time' && (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="time" 
            step="1"
            className="h-8 max-w-[200px]"
            value={selectedTime || format(new Date(), 'HH:mm:ss')}
            onChange={(e) => updateTimeParameter(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TimeSelector;

