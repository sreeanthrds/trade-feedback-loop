
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
  // This addresses the type error by ensuring step is always a number
  const stepValue = param.step !== undefined ? 
    (typeof param.step === 'number' ? param.step : Number(param.step)) : 
    (isIntegerOnly ? 1 : undefined);

  return (
    <div className="space-y-2" key={param.name}>
      <EnhancedNumberInput
        label={param.label}
        id={`param-${param.name}`}
        value={value}
        onChange={onChange}
        step={stepValue}
        min={param.min}
        max={param.max}
        className="h-8"
        required={required}
        description={param.description}
      />
    </div>
  );
};

export default NumberParameterInput;
