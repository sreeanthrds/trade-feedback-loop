
import React from 'react';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import { TextField, FormHelperText, FormControl } from '@mui/material';

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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <FormControl fullWidth>
      <TextField
        label={param.label}
        id={`param-${param.name}`}
        type="number"
        value={value === undefined ? '' : value}
        onChange={handleChange}
        inputProps={{
          step: stepValue,
          min: param.min,
          max: param.max
        }}
        required={required}
        size="small"
        variant="outlined"
        margin="dense"
      />
      {param.description && (
        <FormHelperText>{param.description}</FormHelperText>
      )}
    </FormControl>
  );
};

export default NumberParameterInput;
