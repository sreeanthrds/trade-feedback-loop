
import React from 'react';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface NumberParameterInputProps {
  param: IndicatorParameter;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

const NumberParameterInput: React.FC<NumberParameterInputProps> = ({
  param,
  value,
  onChange,
  required = false
}) => {
  // Extract number-specific properties safely with type checks
  const options = param.options || {};
  const min = typeof options === 'object' && 'min' in options ? options.min as number : undefined;
  const max = typeof options === 'object' && 'max' in options ? options.max as number : undefined;
  const step = typeof options === 'object' && 'step' in options ? options.step as number : 1;
  
  return (
    <EnhancedNumberInput
      label={param.label || param.name}
      id={`param-${param.name}`}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      placeholder={param.placeholder || `Enter ${param.name}`}
      description={param.description}
      required={required}
    />
  );
};

export default NumberParameterInput;
