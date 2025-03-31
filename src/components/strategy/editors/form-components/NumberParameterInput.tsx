
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
  // Extract number-specific properties
  const { min, max, step } = param.options || {};
  
  return (
    <EnhancedNumberInput
      label={param.label || param.name}
      id={`param-${param.name}`}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step || 1}
      placeholder={param.placeholder}
      description={param.description}
      required={required}
    />
  );
};

export default NumberParameterInput;
