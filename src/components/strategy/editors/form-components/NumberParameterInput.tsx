
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

interface NumberParameterInputProps {
  param: IndicatorParameter;
  value: number;
  onChange: (value: number) => void;
}

const NumberParameterInput: React.FC<NumberParameterInputProps> = ({
  param,
  value,
  onChange
}) => {
  // Handle empty values and allow users to clear the field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string to clear the field
    if (inputValue === '') {
      // Pass undefined or default to the onChange handler
      // This allows the user to clear the field before typing a new value
      onChange(param.default !== undefined ? param.default : undefined as any);
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

  return (
    <div className="space-y-2" key={param.name}>
      <div className="flex items-center gap-2">
        <Label htmlFor={`param-${param.name}`} className="text-sm">
          {param.label}
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
        className="h-8"
      />
    </div>
  );
};

export default NumberParameterInput;
