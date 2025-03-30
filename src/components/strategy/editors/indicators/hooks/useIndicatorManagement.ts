
import { useIndicatorParameters } from './useIndicatorParameters';
import { useIndicatorAddition } from './useIndicatorAddition';
import { useIndicatorRemoval } from './useIndicatorRemoval';
import { useIndicatorUsage } from './useIndicatorUsage';
import { UseIndicatorManagementProps, IndicatorManagementReturn } from './types';
import { handleError } from '../../../utils/errorHandling';

export { UseIndicatorManagementProps };

/**
 * Hook to manage indicator state and operations
 */
export const useIndicatorManagement = (props: UseIndicatorManagementProps): IndicatorManagementReturn => {
  try {
    // Use smaller, focused hooks
    const {
      selectedIndicator,
      setSelectedIndicator,
      openStates,
      handleParameterChange,
      toggleOpen
    } = useIndicatorParameters(props);
    
    const { handleAddIndicator: addIndicator } = useIndicatorAddition(props);
    const { handleRemoveIndicator } = useIndicatorRemoval(props);
    const { findUsages } = useIndicatorUsage();
    
    // Wrapper for handleAddIndicator to handle the selected indicator from state
    const handleAddIndicator = (newIndicator: any) => {
      if (!selectedIndicator) return;
      
      const newKey = addIndicator(selectedIndicator, newIndicator);
      
      if (newKey) {
        // Update UI state after adding indicator
        setSelectedIndicator("");
        toggleOpen(newKey);
      }
    };
    
    return {
      selectedIndicator,
      openStates,
      setSelectedIndicator,
      handleAddIndicator,
      handleRemoveIndicator,
      handleParameterChange,
      toggleOpen,
      findUsages
    };
  } catch (error) {
    handleError(error, 'useIndicatorManagement');
    
    // Provide fallback implementation to prevent UI crashes
    return {
      selectedIndicator: "",
      openStates: {},
      setSelectedIndicator: () => {},
      handleAddIndicator: () => {},
      handleRemoveIndicator: () => {},
      handleParameterChange: () => {},
      toggleOpen: () => {},
      findUsages: () => []
    };
  }
};
