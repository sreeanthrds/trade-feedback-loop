import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface EnhancedNumberInputProps {
  label?: string;
  id?: string;
  value?: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

const EnhancedNumberInput: React.FC<EnhancedNumberInputProps> = ({
  label,
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className,
  description,
  required = false,
  disabled = false
}) => {
  // Handle input change, allowing for empty values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      // If the input is empty, pass undefined to the onChange handler
      onChange(undefined);
    } else {
      // Otherwise, parse the number and pass it to the onChange handler
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={id} 
          className="text-sm font-medium"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Input
        type="number"
        id={id}
        value={value === undefined ? '' : value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full"
        required={required}
        disabled={disabled}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default EnhancedNumberInput;
