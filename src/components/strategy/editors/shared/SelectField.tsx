
import React from 'react';
import FormField from './FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: (SelectOption | string)[];
  onChange: (value: string) => void;
  id?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
  id,
  description,
  placeholder = 'Select an option',
  className = '',
  triggerClassName = '',
}) => {
  // Normalize options to always be SelectOption objects
  const normalizedOptions: SelectOption[] = options.map(option => 
    typeof option === 'string' ? { value: option, label: option } : option
  );

  return (
    <FormField label={label} htmlFor={id} description={description} className={className}>
      <Select
        value={value}
        onValueChange={onChange}
        defaultValue={value}
      >
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {normalizedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label || option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default SelectField;
