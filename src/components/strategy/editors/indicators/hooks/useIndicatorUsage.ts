
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { findIndicatorUsages, UsageReference } from '../../../utils/dependency-tracking/usageFinder';
import { handleError } from '../../../utils/errorHandling';

export const useIndicatorUsage = () => {
  const { getNodes } = useReactFlow();
  
  // Memoize findUsages function to prevent unnecessary rerenders
  const findUsages = useCallback((indicatorName: string): UsageReference[] => {
    try {
      if (!indicatorName) return [];
      
      const allNodes = getNodes();
      return findIndicatorUsages(indicatorName, allNodes);
    } catch (error) {
      handleError(error, 'findUsages');
      return [];
    }
  }, [getNodes]);

  return {
    findUsages
  };
};
