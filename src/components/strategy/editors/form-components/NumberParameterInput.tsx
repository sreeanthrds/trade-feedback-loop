
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import { cn } from '@/lib/utils';

interface NumberParameterInputProps {
  param: IndicatorParameter;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

const NumberParameterInput: React.FC<NumberParameterInputProps> = ({
  param,
  value,
  onChange,
  required = false
}) => {
  // Handle empty values and allow users to clear the field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string to clear the field
    if (inputValue === '') {
      // Pass undefined or default to the onChange handler
      // This allows the user to clear the field before typing a new value
      onChange(undefined as any);
      return;
    }
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  // Determine if this should be an integer-only field
  const isIntegerOnly = param.step ? 
    (typeof param.step === 'number' && Number.isInteger(param.step) && param.step >= 1) : false;
  const step = param.step || (isIntegerOnly ? 1 : 'any');

  // Check if value is empty for validation - handle both null, undefined and NaN
  const isEmpty = value === undefined || value === null || (typeof value === 'string' && value === '');
  const showValidationError = required && isEmpty;

  return (
    <div className="space-y-2" key={param.name}>
      <div className="flex items-center gap-2">
        <Label htmlFor={`param-${param.name}`} className="text-sm flex items-center">
          {param.label}
          {required && <span className="ml-1 text-red-500">*</span>}
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
        value={value === undefined ? '' : value}
        onChange={handleInputChange}
        step={step}
        min={param.min}
        max={param.max}
        className={cn(
          "h-8",
          showValidationError && "border-red-300 focus:ring-red-200"
        )}
      />
      {showValidationError && (
        <p className="text-xs text-red-500 mt-1">This field is required</p>
      )}
    </div>
  );
};

export default NumberParameterInput;
