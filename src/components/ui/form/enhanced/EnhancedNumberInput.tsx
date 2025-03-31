
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

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
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value === undefined ? '' : value.toString());
  }, [value]);

  // Validate the input
  const validate = (): boolean => {
    if (required && (inputValue === '' || inputValue === undefined)) {
      setError('This field is required');
      return false;
    }
    
    if (inputValue !== '' && !isNaN(parseFloat(inputValue))) {
      const numValue = parseFloat(inputValue);
      
      if (min !== undefined && numValue < min) {
        setError(`Value must be at least ${min}`);
        return false;
      }
      
      if (max !== undefined && numValue > max) {
        setError(`Value must be at most ${max}`);
        return false;
      }
    }
    
    setError(undefined);
    return true;
  };

  // Handle input change, allowing for empty values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setTouched(true);
    
    if (newValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  // Handle blur event to run validation
  const handleBlur = () => {
    setTouched(true);
    validate();
    
    if (inputValue !== '' && !isNaN(parseFloat(inputValue))) {
      // Format the number properly on blur
      const numValue = parseFloat(inputValue);
      setInputValue(numValue.toString());
    }
  };

  // Determine if we should show validation errors
  const showError = touched && error;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={id} 
          className="text-sm font-medium flex items-center"
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
        className={cn(
          "w-full",
          showError && "border-destructive focus-visible:ring-destructive"
        )}
        required={required}
        disabled={disabled}
        aria-invalid={!!showError}
      />
      {showError && (
        <div className="flex items-center text-destructive text-xs gap-1 mt-1">
          <AlertTriangle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
      {description && !showError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default EnhancedNumberInput;
