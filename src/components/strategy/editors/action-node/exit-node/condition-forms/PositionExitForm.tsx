
import React, { useState, useEffect } from 'react';
import { EnhancedInputField } from '@/components/ui/form/enhanced';
import { ExitByPositionIdentifier } from '../types';

interface PositionExitFormProps {
  exitCondition: ExitByPositionIdentifier;
  updateField: (field: string, value: any) => void;
}

const PositionExitForm: React.FC<PositionExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);
  
  useEffect(() => {
    // Reset error when condition changes
    setError(undefined);
    setTouched(false);
  }, [exitCondition.type]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('identifier', e.target.value);
    setTouched(true);
    
    if (!e.target.value) {
      setError('This field is required');
    } else {
      setError(undefined);
    }
  };
  
  const showError = touched && !exitCondition.identifier;
  
  return (
    <EnhancedInputField
      label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
      value={exitCondition.identifier || ''}
      onChange={handleChange}
      description={`Enter the ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'} to exit`}
      isRequired={true}
      error={showError ? 'This field is required' : undefined}
    />
  );
};

export default PositionExitForm;
