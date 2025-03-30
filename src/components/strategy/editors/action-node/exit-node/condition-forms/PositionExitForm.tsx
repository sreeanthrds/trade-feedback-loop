
import React from 'react';
import InputField from '../../../shared/InputField';
import { ExitByPositionIdentifier } from '../types';

interface PositionExitFormProps {
  exitCondition: ExitByPositionIdentifier;
  updateField: (field: string, value: any) => void;
}

const PositionExitForm: React.FC<PositionExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <InputField
      label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
      value={exitCondition.identifier || ''}
      onChange={(e) => updateField('identifier', e.target.value)}
      description={`Enter the ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'} to exit`}
    />
  );
};

export default PositionExitForm;
