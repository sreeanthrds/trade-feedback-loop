
import React from 'react';
import FormField from './FormField';
import { Input } from '@/components/ui/input';

interface InputFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number | string;
  disabled?: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  id,
  type = 'text',
  placeholder,
  description,
  className = '',
  min,
  max,
  step,
  disabled,
  readOnly,
}) => {
  // Handle the change for number inputs to allow empty value
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For number inputs, let the field be cleared (empty string)
    if (type === 'number' && e.target.value === '') {
      onChange(e);
      return;
    }
    
    // For number inputs with min/max constraints
    if (type === 'number' && e.target.value !== '') {
      const numValue = parseFloat(e.target.value);
      
      // If the value is not a valid number, pass through the event
      if (isNaN(numValue)) {
        onChange(e);
        return;
      }
      
      // Apply min/max constraints only for valid numbers
      if (min !== undefined && numValue < min) {
        e.target.value = min.toString();
      } else if (max !== undefined && numValue > max) {
        e.target.value = max.toString();
      }
    }
    
    onChange(e);
  };
  
  // Convert empty, undefined, or null value to empty string for controlled input
  const inputValue = value === undefined || value === null ? '' : value;
  
  // Determine step based on type and provided step
  const effectiveStep = step !== undefined ? step : (type === 'number' ? 'any' : undefined);
  
  return (
    <FormField label={label} htmlFor={id} description={description} className={className}>
      <Input
        id={id}
        type={type}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={effectiveStep}
        disabled={disabled}
        readOnly={readOnly}
        className="focus:ring-2 focus:ring-primary/30"
      />
    </FormField>
  );
};

export default InputField;
