
import { useReactFlow } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import { handleError } from '../../../utils/errorHandling';
import { findIndicatorUsages } from '../../../utils/dependency-tracking/usageFinder';

/**
 * Hook to find indicator usages with optimized performance
 */
export const useIndicatorUsage = () => {
  const { getNodes } = useReactFlow();
  
  // Get nodes only once per render
  const nodes = useMemo(() => {
    try {
      return getNodes();
    } catch (error) {
      handleError(error, 'useIndicatorUsage.getNodes');
      return [];
    }
  }, [getNodes]);
  
  // Memoize findUsages function to prevent unnecessary rerenders
  const findUsages = useCallback((indicatorName: string) => {
    try {
      if (!indicatorName) return [];
      return findIndicatorUsages(indicatorName, nodes);
    } catch (error) {
      handleError(error, 'findUsages');
      return [];
    }
  }, [nodes]);

  return {
    findUsages
  };
};
