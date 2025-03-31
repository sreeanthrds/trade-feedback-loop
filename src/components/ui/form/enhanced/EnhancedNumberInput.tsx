import React, { useState, useEffect } from 'react';
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
  // Use local state to handle the input value as a string
  const [inputValue, setInputValue] = useState<string>(value === undefined ? '' : value.toString());
  
  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value === undefined ? '' : value.toString());
  }, [value]);

  // Handle input change, allowing for empty values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue === '') {
      // If the input is empty, pass undefined to the onChange handler
      onChange(undefined);
    } else {
      // Otherwise, parse the number and pass it to the onChange handler
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
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
