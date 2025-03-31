
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface InputFieldProps {
  label: string;
  id: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  description?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  required = false,
  min,
  max,
  step,
  description
}) => {
  // If this is a number field, use our EnhancedNumberInput
  if (type === 'number') {
    // Convert string numbers to actual numbers
    const minValue = min !== undefined ? Number(min) : undefined;
    const maxValue = max !== undefined ? Number(max) : undefined;
    const stepValue = step !== undefined ? Number(step) : undefined;
    
    // Convert value to number if it's not undefined or empty
    const numValue = value !== undefined && value !== '' ? Number(value) : undefined;
    
    // Create a handler that wraps the original onChange
    const handleNumberChange = (newValue: number | undefined) => {
      // Simulate an input event to maintain compatibility
      const simulatedEvent = {
        target: {
          value: newValue !== undefined ? newValue.toString() : '',
          id,
          type: 'number'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(simulatedEvent);
    };
    
    return (
      <EnhancedNumberInput
        label={label}
        id={id}
        value={numValue}
        onChange={handleNumberChange}
        min={minValue}
        max={maxValue}
        step={stepValue}
        placeholder={placeholder}
        className={className}
        tooltip={description}
        required={required}
      />
    );
  }
  
  // For non-number fields, use the regular Input
  // Check if field is empty for required validation
  const isEmpty = value === '' || value === undefined || value === null;
  const showRequired = required && isEmpty;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="flex items-center">
          {label}
        </Label>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        {showRequired && (
          <span className="absolute -top-1 right-0 text-red-500 text-xs">*</span>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            className,
            showRequired && "border-red-300 focus:ring-red-200"
          )}
        />
      </div>
    </div>
  );
};

export default InputField;
