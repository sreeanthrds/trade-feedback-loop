
import { UseIndicatorManagementProps } from './types';
import { toast } from "@/hooks/use-toast";
import { handleError } from '../../../utils/errorHandling';

export const useIndicatorAddition = ({ 
  selectedIndicators, 
  onChange 
}: UseIndicatorManagementProps) => {

  const handleAddIndicator = (selectedIndicator: string, newIndicator: any) => {
    try {
      if (!selectedIndicator) return;
      
      const defaultValues = newIndicator.parameters.reduce((acc: Record<string, any>, param: any) => {
        acc[param.name] = param.default;
        return acc;
      }, {});
      
      const baseIndicatorName = selectedIndicator;
      let uniqueKey = baseIndicatorName;
      let counter = 1;
      
      while (selectedIndicators[uniqueKey]) {
        uniqueKey = `${baseIndicatorName}_${counter}`;
        counter++;
      }
      
      const updatedIndicators = {
        ...selectedIndicators,
        [uniqueKey]: defaultValues
      };
      
      onChange(updatedIndicators);
      
      toast({
        title: "Indicator added",
        description: `Added ${baseIndicatorName} indicator`
      });
      
      return uniqueKey;
    } catch (error) {
      handleError(error, 'handleAddIndicator');
      toast({
        title: "Error adding indicator",
        description: "Failed to add indicator",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    handleAddIndicator
  };
};
