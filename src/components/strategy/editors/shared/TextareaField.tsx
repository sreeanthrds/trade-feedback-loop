
import React from 'react';
import FormField from './FormField';
import { Textarea } from '@/components/ui/textarea';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  id,
  placeholder,
  description,
  className = '',
  rows = 3,
  disabled,
  readOnly,
  orientation = 'vertical',
}) => {
  return (
    <FormField 
      label={label} 
      htmlFor={id} 
      description={description} 
      className={className}
      orientation={orientation}
    >
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        className={orientation === 'horizontal' ? 'w-full' : ''}
      />
    </FormField>
  );
};

export default TextareaField;
