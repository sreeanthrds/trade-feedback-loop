
import React, { useState, useEffect } from 'react';
import { EnhancedSelectField } from '@/components/ui/form/enhanced';
import { ExitByPositionIdentifier } from '../types';
import { useVpsStore } from '@/hooks/useVpsStore';

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
  const { positions } = useVpsStore();
  
  // Get available VPIs or VPTs based on condition type
  const positionOptions = React.useMemo(() => {
    const uniqueValues = new Set<string>();
    
    // Add an option for "All positions"
    const options = [{
      value: "",
      label: "All positions"
    }];
    
    if (positions.length > 0) {
      positions.forEach(position => {
        if (exitCondition.type === 'vpi' && position.vpi && !uniqueValues.has(position.vpi)) {
          uniqueValues.add(position.vpi);
          options.push({
            value: position.vpi,
            label: position.vpi
          });
        } else if (exitCondition.type === 'vpt' && position.vpt && !uniqueValues.has(position.vpt)) {
          uniqueValues.add(position.vpt);
          options.push({
            value: position.vpt,
            label: position.vpt
          });
        }
      });
    }
    
    return options;
  }, [positions, exitCondition.type]);
  
  useEffect(() => {
    // Reset error when condition changes
    setError(undefined);
    setTouched(false);
  }, [exitCondition.type]);
  
  const handleChange = (value: string) => {
    updateField('identifier', value);
    setTouched(true);
    
    if (!value && exitCondition.type !== 'all_positions') {
      setError('This field is required');
    } else {
      setError(undefined);
    }
  };
  
  const showError = touched && !exitCondition.identifier && exitCondition.type !== 'all_positions';
  
  return (
    <EnhancedSelectField
      label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
      value={exitCondition.identifier || ''}
      onChange={handleChange}
      options={positionOptions}
      description={`Select the ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'} to exit`}
      required={true}
      tooltip={exitCondition.type === 'vpi' 
        ? "Select the specific position ID to exit" 
        : "Select the position tag to exit all positions with this tag"}
    />
  );
};

export default PositionExitForm;
