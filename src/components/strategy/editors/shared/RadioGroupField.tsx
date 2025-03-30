
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupFieldProps {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  layout?: 'vertical' | 'horizontal'; // Added layout property
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  value,
  options,
  onChange,
  className,
  disabled = false,
  required = false,
  layout = 'vertical' // Default to vertical layout
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          "flex flex-col space-y-1",
          layout === 'horizontal' && "flex-row space-x-4 space-y-0"
        )}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
            <Label
              htmlFor={`radio-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioGroupField;
