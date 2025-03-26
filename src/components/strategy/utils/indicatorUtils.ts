
import { indicatorConfig } from './indicatorConfig';

/**
 * Formats an indicator name with its parameters for display
 * e.g., "EMA(21)" instead of just "EMA"
 */
export const getIndicatorDisplayName = (key: string, indicatorParameters?: Record<string, Record<string, any>>): string => {
  if (!indicatorParameters || !indicatorParameters[key]) return key;
  
  // Extract base indicator name (before any underscore)
  const baseName = key.split('_')[0];
  
  // If we have parameters for this indicator
  if (indicatorParameters[key]) {
    const params = indicatorParameters[key];
    
    // Skip internal parameters that start with underscore
    const visibleParams = Object.entries(params)
      .filter(([paramName]) => !paramName.startsWith('_'))
      .map(([_, value]) => value);
    
    // Format all parameters into a single, readable string - only values
    const paramList = visibleParams.join(',');
    
    return `${baseName}(${paramList})`;
  }
  
  return key;
};

/**
 * Maps indicator keys to their display names
 */
export const getIndicatorDisplayNames = (
  indicators: string[] = [], 
  indicatorParameters?: Record<string, Record<string, any>>
): Record<string, string> => {
  return indicators.reduce((acc, indicator) => {
    acc[indicator] = getIndicatorDisplayName(indicator, indicatorParameters);
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Extracts indicator display name for use in condition builder and nodes
 * This is consistent with the names shown in the UI
 */
export const getIndicatorNameForDisplay = (
  indicator: string,
  startNodeData?: any
): string => {
  if (!startNodeData || !startNodeData.indicatorParameters) {
    return indicator;
  }
  
  return getIndicatorDisplayName(
    indicator, 
    startNodeData.indicatorParameters
  );
};
