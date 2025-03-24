
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
  orientation?: 'vertical' | 'horizontal';
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
  orientation = 'horizontal',
}) => {
  return (
    <FormField 
      label={label} 
      htmlFor={id} 
      description={description} 
      className={className}
      orientation={orientation}
    >
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        className={orientation === 'horizontal' ? 'w-full' : ''}
      />
    </FormField>
  );
};

export default InputField;
