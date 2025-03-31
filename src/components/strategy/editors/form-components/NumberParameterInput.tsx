
import React, { useState, useEffect } from 'react';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NumberParameterInputProps {
  param: IndicatorParameter;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

const NumberParameterInput: React.FC<NumberParameterInputProps> = ({
  param,
  value,
  onChange,
  required = false
}) => {
  // Use local state to handle the input value as a string
  const [inputValue, setInputValue] = useState<string>(value === undefined ? '' : value.toString());
  
  // Determine if this should be an integer-only field
  const isIntegerOnly = param.step ? 
    (typeof param.step === 'number' && Number.isInteger(param.step) && param.step >= 1) : false;
    
  // Convert the step to a number or use a default value
  const stepValue = param.step !== undefined ? 
    (typeof param.step === 'number' ? param.step : Number(param.step)) : 
    (isIntegerOnly ? 1 : 0.01);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value === undefined ? '' : value.toString());
  }, [value]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  // Handle blur event to ensure proper formatting
  const handleBlur = () => {
    if (inputValue !== '' && !isNaN(parseFloat(inputValue))) {
      // Format the number properly on blur
      const numValue = parseFloat(inputValue);
      setInputValue(numValue.toString());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={`param-${param.name}`} className="text-sm">
          {param.label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {param.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{param.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={`param-${param.name}`}
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={param.min}
        max={param.max}
        step={stepValue}
        required={required}
        className="w-full"
      />
      {required && inputValue === '' && (
        <p className="text-xs text-destructive mt-1">This field is required</p>
      )}
    </div>
  );
};

export default NumberParameterInput;
