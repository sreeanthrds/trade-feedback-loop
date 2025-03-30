
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
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
  step
}) => {
  // For number inputs, handle empty value differently
  let inputValue = value;
  if (type === 'number' && (value === '' || value === null || value === undefined)) {
    inputValue = '';
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={inputValue}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          className,
          required && type === 'number' && inputValue === '' && "border-red-300 focus:ring-red-200",
          required && type === 'text' && inputValue === '' && "border-red-300 focus:ring-red-200"
        )}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default InputField;
