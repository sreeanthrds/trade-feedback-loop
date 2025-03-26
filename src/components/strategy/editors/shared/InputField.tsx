
import React from 'react';
import FormField from './FormField';
import { Input } from '@/components/ui/input';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
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
  // Convert empty value to empty string for controlled input
  const inputValue = value === undefined || value === null ? '' : value;
  
  return (
    <FormField label={label} htmlFor={id} description={description} className={className}>
      <Input
        id={id}
        type={type}
        value={inputValue}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        className="focus:ring-2 focus:ring-primary/30"
      />
    </FormField>
  );
};

export default InputField;
