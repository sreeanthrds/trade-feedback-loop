
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
  const step = param.step || (isIntegerOnly ? 1 : 'any');

  return (
    <div className="space-y-2" key={param.name}>
      <EnhancedNumberInput
        label={param.label}
        id={`param-${param.name}`}
        value={value}
        onChange={onChange}
        step={step}
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
