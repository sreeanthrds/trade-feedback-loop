
import { useReactFlow } from '@xyflow/react';
import { findIndicatorUsages, UsageReference } from '../../../utils/dependency-tracking/usageFinder';
import { handleError } from '../../../utils/errorHandling';

export const useIndicatorUsage = () => {
  const { getNodes } = useReactFlow();
  
  const findUsages = (indicatorName: string): UsageReference[] => {
    try {
      const allNodes = getNodes();
      return findIndicatorUsages(indicatorName, allNodes);
    } catch (error) {
      handleError(error, 'findUsages');
      return [];
    }
  };

  return {
    findUsages
  };
};
