
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { UseIndicatorManagementProps } from './types';
import { handleError } from '../../../utils/errorHandling';

export const useIndicatorParameters = ({ 
  selectedIndicators, 
  onChange 
}: UseIndicatorManagementProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  
  const handleParameterChange = (indicatorName: string, paramName: string, value: any) => {
    try {
      const updatedIndicators = {
        ...selectedIndicators,
        [indicatorName]: {
          ...selectedIndicators[indicatorName],
          [paramName]: value
        }
      };
      
      onChange(updatedIndicators);
    } catch (error) {
      handleError(error, 'handleParameterChange');
      toast({
        title: "Error updating parameter",
        description: "Failed to update indicator parameter",
        variant: "destructive"
      });
    }
  };
  
  const toggleOpen = (indicatorName: string) => {
    setOpenStates(prev => ({
      ...prev,
      [indicatorName]: !prev[indicatorName]
    }));
  };

  return {
    selectedIndicator,
    setSelectedIndicator,
    openStates,
    setOpenStates,
    handleParameterChange,
    toggleOpen
  };
};
