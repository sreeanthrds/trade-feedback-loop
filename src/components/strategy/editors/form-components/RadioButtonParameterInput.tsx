
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import { cn } from '@/lib/utils';

interface RadioButtonParameterInputProps {
  param: IndicatorParameter;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const RadioButtonParameterInput: React.FC<RadioButtonParameterInputProps> = ({
  param,
  value,
  onChange,
  required = false
}) => {
  // Check if value is empty for validation
  const isEmpty = !value && value !== 0;
  const showValidationError = required && isEmpty;
  
  return (
    <div className="space-y-2" key={param.name}>
      <div className="flex items-center gap-2">
        <Label className="text-sm">
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
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          "flex flex-col space-y-1",
          showValidationError && "border-red-300 p-2 rounded-md border"
        )}
      >
        {param.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`param-${param.name}-${option}`} />
            <Label htmlFor={`param-${param.name}-${option}`} className="text-xs">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {showValidationError && (
        <p className="text-xs text-red-500 mt-1">This field is required</p>
      )}
    </div>
  );
};

export default RadioButtonParameterInput;
