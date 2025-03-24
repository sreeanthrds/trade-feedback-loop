
import React from 'react';
import FormField from './FormField';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  description?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  value,
  options,
  onChange,
  description,
  className = '',
  layout = 'vertical',
}) => {
  const layoutClass = layout === 'horizontal' ? 'flex gap-4' : 'flex flex-col space-y-1';

  return (
    <FormField label={label} description={description} className={className}>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className={layoutClass}
      >
        {options.map((option) => (
          <div className="flex items-center space-x-2" key={option.value}>
            <RadioGroupItem value={option.value} id={`option-${option.value}`} />
            <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormField>
  );
};

export default RadioGroupField;
