
import { useState, useEffect } from 'react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { IndicatorExpression } from '../../../utils/conditionTypes';

interface UseIndicatorUtilsProps {
  expression: IndicatorExpression;
}

export const useIndicatorUtils = ({ expression }: UseIndicatorUtilsProps) => {
  const strategyStore = useStrategyStore();
  const [availableIndicators, setAvailableIndicators] = useState<string[]>([]);
  const [missingIndicator, setMissingIndicator] = useState(false);
  
  useEffect(() => {
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (startNode && startNode.data && startNode.data.indicators && 
        Array.isArray(startNode.data.indicators) && startNode.data.indicators.length > 0) {
      setAvailableIndicators(startNode.data.indicators);
      
      // Check if the current indicator still exists in the start node
      if (expression.name && !startNode.data.indicators.includes(expression.name)) {
        setMissingIndicator(true);
      } else {
        setMissingIndicator(false);
      }
    } else {
      setAvailableIndicators([]);
      if (expression.name) {
        setMissingIndicator(true);
      }
    }
  }, [strategyStore.nodes, expression.name]);

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
      
      // Format all parameters into a single, readable string - only values
      const paramList = Object.values(displayParams).join(',');
      
      return `${baseName}(${paramList})`;
    }
    
    return key;
  };

  return {
    availableIndicators,
    missingIndicator,
    hasMultipleOutputs,
    getIndicatorDisplayName
  };
};
