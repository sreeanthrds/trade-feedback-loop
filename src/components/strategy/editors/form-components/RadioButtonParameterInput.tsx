
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

interface RadioButtonParameterInputProps {
  param: IndicatorParameter;
  value: string;
  onChange: (value: string) => void;
}

const RadioButtonParameterInput: React.FC<RadioButtonParameterInputProps> = ({
  param,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2" key={param.name}>
      <div className="flex items-center gap-2">
        <Label className="text-sm">{param.label}</Label>
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
        className="flex gap-4"
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
    </div>
  );
};

export default RadioButtonParameterInput;
