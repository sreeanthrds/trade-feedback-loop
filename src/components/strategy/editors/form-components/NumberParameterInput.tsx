
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
  
  // Get min, max, step from either the options object or direct properties
  const min = typeof options === 'object' && 'min' in options 
    ? options.min as number 
    : param.min;
    
  const max = typeof options === 'object' && 'max' in options 
    ? options.max as number 
    : param.max;
    
  const step = typeof options === 'object' && 'step' in options 
    ? options.step as number 
    : param.step || 1;
  
  const placeholder = param.placeholder || `Enter ${param.name}`;
  
  return (
    <EnhancedNumberInput
      label={param.label || param.name}
      id={`param-${param.name}`}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      description={param.description}
      required={required}
    />
  );
};

export default NumberParameterInput;
