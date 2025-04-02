
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
    
    // Add an option for "All positions" with a non-empty value
    const options = [{
      value: "all",
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
    // If "all" is selected, convert it to empty string for the exitCondition
    const identifierValue = value === "all" ? "" : value;
    updateField('identifier', identifierValue);
    setTouched(true);
    
    // Only show error for non-all positions and when the field is required
    // Check if type is not 'all_positions' which is a different type than vpi/vpt
    const isAllPositions = exitCondition.type === 'all_positions' as any;
    
    if (!value && !isAllPositions) {
      setError('This field is required');
    } else {
      setError(undefined);
    }
  };
  
  // Determine if an error should be shown
  const showError = touched && 
    (!exitCondition.identifier && exitCondition.type !== 'all_positions' as any);
  
  return (
    <EnhancedSelectField
      label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
      value={exitCondition.identifier || 'all'}
      onChange={handleChange}
      options={positionOptions}
      description={`Select the ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'} to exit`}
      required={exitCondition.type !== 'all_positions' as any}
      tooltip={exitCondition.type === 'vpi' 
        ? "Select the specific position ID to exit" 
        : "Select the position tag to exit all positions with this tag"}
    />
  );
};

export default PositionExitForm;
