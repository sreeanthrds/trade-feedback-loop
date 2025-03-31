
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface EnhancedRadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  layout?: 'vertical' | 'horizontal';
  className?: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
}

const EnhancedRadioGroup: React.FC<EnhancedRadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
  layout = 'vertical',
  className,
  description,
  tooltip,
  required = false,
  disabled = false
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          layout === 'horizontal' ? "flex space-x-4" : "space-y-2",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
      >
        {options.map(option => (
          <div key={option.value} className={cn(
            "flex items-center space-x-2",
            layout === 'horizontal' && "mr-4"
          )}>
            <RadioGroupItem 
              value={option.value} 
              id={`option-${option.value}`}
              disabled={option.disabled || disabled}
            />
            <Label 
              htmlFor={`option-${option.value}`}
              className="text-sm cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default EnhancedRadioGroup;
