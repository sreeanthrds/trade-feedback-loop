
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  composeHOC, 
  withLabel, 
  withFormValidation, 
  withLoadingState,
  withErrorHandling,
  LabelProps,
  ValidationProps,
  LoadingProps,
  ErrorHandlingProps
} from '@/components/ui/hoc';

// Component props 
export interface EnhancedNumberInputProps extends 
  LabelProps, 
  ValidationProps, 
  LoadingProps,
  ErrorHandlingProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

// Base input component that will be enhanced
const NumberInputField: React.FC<EnhancedNumberInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  required = false,
  min,
  max,
  step,
  // Exclude HOC-specific props before passing to Input
  label,
  hideLabel,
  labelClassName,
  description,
  isRequired,
  error,
  isValid,
  isLoading,
  loadingComponent,
  errorContext,
  handleError,
  showToasts,
  catchRenderErrors,
  ...rest
}) => {
  // Handle input change, converting empty strings to undefined
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow clearing the field
    if (inputValue === '') {
      onChange(undefined);
      return;
    }
    
    // Convert to number if it's a valid number
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <Input
      id={id}
      type="number"
      value={value === undefined ? '' : value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
      min={min}
      max={max}
      step={step}
      required={required}
      {...rest}
    />
  );
};

// Create enhanced number input field with HOCs
const EnhancedNumberInput = composeHOC(
  withErrorHandling,
  withLoadingState,
  withFormValidation,
  withLabel
)(NumberInputField);

export default EnhancedNumberInput;
