
import { useState, useEffect } from 'react';
import { Expression, IndicatorExpression } from '../../../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface UseIndicatorSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

export const useIndicatorSelector = ({ expression, updateExpression }: UseIndicatorSelectorProps) => {
  const strategyStore = useStrategyStore();
  const [availableIndicators, setAvailableIndicators] = useState<string[]>([]);
  const [missingIndicator, setMissingIndicator] = useState(false);

  if (expression.type !== 'indicator') {
    throw new Error("useIndicatorSelector can only be used with indicator expressions");
  }

  const indicatorExpr = expression as IndicatorExpression;
  
  useEffect(() => {
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (startNode && startNode.data && startNode.data.indicators && 
        Array.isArray(startNode.data.indicators) && startNode.data.indicators.length > 0) {
      setAvailableIndicators(startNode.data.indicators);
      
      // Check if the current indicator still exists in the start node
      if (indicatorExpr.name && !startNode.data.indicators.includes(indicatorExpr.name)) {
        setMissingIndicator(true);
      } else {
        setMissingIndicator(false);
      }
    } else {
      setAvailableIndicators([]);
      if (indicatorExpr.name) {
        setMissingIndicator(true);
      }
    }
  }, [strategyStore.nodes, indicatorExpr.name]);
  
  const updateIndicatorName = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      name: value,
      parameter: undefined
    });
  };
  
  const updateParameter = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      parameter: value
    });
  };
  
  const hasMultipleOutputs = (indicator: string): boolean => {
    if (!indicator) return false;
    const baseIndicator = indicator.split('_')[0];
    const multiOutputIndicators = [
      'BollingerBands',
      'MACD',
      'Stochastic',
      'ADX',
      'Ichimoku',
      'PivotPoints'
    ];
    return multiOutputIndicators.includes(baseIndicator);
  };

  const getParameterOptions = (indicator: string): string[] => {
    if (!indicator) return [];
    
    const baseIndicator = indicator.split('_')[0];
    
    const outputParameters: Record<string, string[]> = {
      'BollingerBands': ['UpperBand', 'MiddleBand', 'LowerBand'],
      'MACD': ['MACD', 'Signal', 'Histogram'],
      'Stochastic': ['SlowK', 'SlowD'],
      'ADX': ['ADX', 'PlusDI', 'MinusDI'],
      'Ichimoku': ['Tenkan', 'Kijun', 'SenkouA', 'SenkouB', 'Chikou'],
      'PivotPoints': ['Pivot', 'R1', 'R2', 'R3', 'S1', 'S2', 'S3']
    };
    
    return outputParameters[baseIndicator] || [];
  };
  
  // This function is now consistent with the same function in StartNode.tsx
  const getIndicatorDisplayName = (key: string) => {
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (!startNode || !startNode.data || !startNode.data.indicatorParameters) return key;
    
    // Extract base indicator name (before any underscore)
    const baseName = key.split('_')[0];
    
    if (startNode.data.indicatorParameters[key]) {
      const params = startNode.data.indicatorParameters[key];
      
      // Create a copy without indicator_name
      const displayParams = { ...params };
      delete displayParams.indicator_name;
      
      // Only include parentheses with values if there are actual valid parameter values
      const paramValues = Object.values(displayParams);
      if (paramValues.length > 0 && paramValues.some(val => val !== undefined && val !== null && val !== '')) {
        const paramList = paramValues.join(',');
        return `${baseName}(${paramList})`;
      }
      
      // Return just the name if no valid parameters
      return baseName;
    }
    
    return key;
  };

  return {
    indicatorExpr,
    availableIndicators,
    missingIndicator,
    hasMultipleOutputs,
    getParameterOptions,
    getIndicatorDisplayName,
    updateIndicatorName,
    updateParameter
  };
};
