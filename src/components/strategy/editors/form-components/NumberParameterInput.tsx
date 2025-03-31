
import React, { useState, useEffect } from 'react';
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
  // Use local state to handle the input value as a string
  const [inputValue, setInputValue] = useState<string>(value === undefined ? '' : value.toString());
  
  // Determine if this should be an integer-only field
  const isIntegerOnly = param.step ? 
    (typeof param.step === 'number' && Number.isInteger(param.step) && param.step >= 1) : false;
    
  // Convert the step to a number or use a default value
  const stepValue = param.step !== undefined ? 
    (typeof param.step === 'number' ? param.step : Number(param.step)) : 
    (isIntegerOnly ? 1 : 0.01);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value === undefined ? '' : value.toString());
  }, [value]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  // Handle blur event to ensure proper formatting
  const handleBlur = () => {
    if (inputValue !== '' && !isNaN(parseFloat(inputValue))) {
      // Format the number properly on blur
      const numValue = parseFloat(inputValue);
      setInputValue(numValue.toString());
    }
  };

  return (
    <FormControl fullWidth>
      <TextField
        label={param.label}
        id={`param-${param.name}`}
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
