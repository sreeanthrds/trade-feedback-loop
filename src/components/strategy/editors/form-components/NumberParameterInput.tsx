
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
  // Determine if this should be an integer-only field
  const isIntegerOnly = param.step ? 
    (typeof param.step === 'number' && Number.isInteger(param.step) && param.step >= 1) : false;
    
  // Convert the step to a number or use a default value
  const stepValue = param.step !== undefined ? 
    (typeof param.step === 'number' ? param.step : Number(param.step)) : 
    (isIntegerOnly ? 1 : 0.01);

  return (
    <EnhancedNumberInput
      id={`param-${param.name}`}
      label={param.label}
      value={value}
      onChange={onChange}
      min={param.min as number | undefined}
      max={param.max as number | undefined}
      step={stepValue}
      tooltip={param.description}
      required={required}
    />
  );
};

export default NumberParameterInput;
