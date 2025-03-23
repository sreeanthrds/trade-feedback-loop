
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IndicatorParameter } from '../../utils/indicatorConfig';

interface DropdownParameterInputProps {
  param: IndicatorParameter;
  value: string;
  onChange: (value: string) => void;
}

const DropdownParameterInput: React.FC<DropdownParameterInputProps> = ({
  param,
  value,
  onChange
}) => {
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
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id={`param-${param.name}`} className="h-8">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {param.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownParameterInput;
