
import { useReactFlow } from '@xyflow/react';
import { useCallback, useMemo, useRef } from 'react';
import { handleError } from '../../../utils/errorHandling';
import { findIndicatorUsages } from '../../../utils/dependency-tracking/usageFinder';
import { UsageReference } from '../../../utils/dependency-tracking/types';

/**
 * Hook to find indicator usages with optimized performance
 */
export const useIndicatorUsage = () => {
  const { getNodes } = useReactFlow();
  const cacheRef = useRef<Map<string, UsageReference[]>>(new Map());
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const nodesRef = useRef<any[]>([]);
  const updateIntervalMs = 2000; // Only update cache every 2 seconds
  
  // Get nodes only once per render and cache them
  const nodes = useMemo(() => {
    try {
      const now = Date.now();
      // Only fetch new nodes if enough time has elapsed
      if (now - lastUpdateTimeRef.current > updateIntervalMs) {
        const freshNodes = getNodes();
        nodesRef.current = freshNodes;
        lastUpdateTimeRef.current = now;
        // Clear cache when nodes change
        cacheRef.current.clear();
        return freshNodes;
      }
      
      return nodesRef.current;
    } catch (error) {
      handleError(error, 'useIndicatorUsage.getNodes');
      return [];
    }
  }, [getNodes]);
  
  // Highly optimized version with caching
  const findUsages = useCallback((indicatorName: string): UsageReference[] => {
    try {
      if (!indicatorName) return [];
      
      // Return cached result if available
      if (cacheRef.current.has(indicatorName)) {
        return cacheRef.current.get(indicatorName) || [];
      }
      
      // Compute new result and cache it
      const usages = findIndicatorUsages(indicatorName, nodes);
      cacheRef.current.set(indicatorName, usages);
      
      return usages;
    } catch (error) {
      handleError(error, 'findUsages');
      return [];
    }
  }, [nodes]);

  return {
    findUsages
  };
};
