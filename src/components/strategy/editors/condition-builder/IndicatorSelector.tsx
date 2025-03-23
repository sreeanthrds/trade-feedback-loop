
import React, { useEffect, useState } from 'react';
import { 
  Expression, 
  IndicatorExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { indicatorConfig } from '../../utils/indicatorConfig';

interface IndicatorSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  expression,
  updateExpression
}) => {
  const strategyStore = useStrategyStore();
  const [availableIndicators, setAvailableIndicators] = useState<string[]>([]);
  
  if (expression.type !== 'indicator') {
    return null;
  }

  const indicatorExpr = expression as IndicatorExpression;
  
  // Get available indicators from the start node
  useEffect(() => {
    // Find the start node
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (startNode && startNode.data.indicatorParameters) {
      // Get the keys from the indicatorParameters object
      const indicators = Object.keys(startNode.data.indicatorParameters || {});
      setAvailableIndicators(indicators);
    } else {
      setAvailableIndicators([]);
    }
  }, [strategyStore.nodes]);
  
  // Update the indicator name
  const updateIndicatorName = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      name: value,
      parameter: undefined // Clear parameter when changing indicator
    });
  };
  
  // Update indicator parameter (for multi-output indicators)
  const updateParameter = (value: string) => {
    updateExpression({
      ...indicatorExpr,
      parameter: value
    });
  };
  
  // Check if the selected indicator has multiple outputs
  const hasMultipleOutputs = (indicator: string): boolean => {
    // Extract base indicator name (before any underscore or numeric suffix)
    const baseIndicator = indicator.split('_')[0];
    if (baseIndicator === 'BollingerBands') return true;
    if (baseIndicator === 'MACD') return true;
    return false;
  };

  // Get parameter options for the selected indicator
  const getParameterOptions = (indicator: string): string[] => {
    // Extract base indicator name
    const baseIndicator = indicator.split('_')[0];
    if (baseIndicator === 'BollingerBands') {
      return ['UpperBand', 'MiddleBand', 'LowerBand'];
    }
    if (baseIndicator === 'MACD') {
      return ['MACD', 'Signal', 'Histogram'];
    }
    return [];
  };
  
  // Helper to get display name for an indicator
  const getIndicatorDisplayName = (key: string) => {
    // Find the start node
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (!startNode || !startNode.data.indicatorParameters) return key;
    
    // Extract base indicator name (before any underscore)
    const baseName = key.split('_')[0];
    
    // If we have parameters for this indicator
    if (startNode.data.indicatorParameters[key]) {
      const params = startNode.data.indicatorParameters[key];
      
      // Handle different indicator types
      if (params.timeperiod) {
        return `${baseName} (${params.timeperiod})`;
      }
      
      if (baseName === 'MACD' && params.fastperiod && params.slowperiod && params.signalperiod) {
        return `${baseName} (${params.fastperiod},${params.slowperiod},${params.signalperiod})`;
      }
      
      if (baseName === 'BollingerBands' && params.timeperiod && params.nbdevup) {
        return `${baseName} (${params.timeperiod},${params.nbdevup})`;
      }
    }
    
    return key;
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={indicatorExpr.name} 
        onValueChange={updateIndicatorName}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Select indicator" />
        </SelectTrigger>
        <SelectContent>
          {availableIndicators.length > 0 ? (
            availableIndicators.map((indicator) => (
              <SelectItem key={indicator} value={indicator}>
                {getIndicatorDisplayName(indicator)}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              No indicators available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {indicatorExpr.name && hasMultipleOutputs(indicatorExpr.name) && (
        <Select 
          value={indicatorExpr.parameter} 
          onValueChange={updateParameter}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select output" />
          </SelectTrigger>
          <SelectContent>
            {getParameterOptions(indicatorExpr.name).map((param) => (
              <SelectItem key={param} value={param}>
                {param}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {(!indicatorExpr.name || availableIndicators.length === 0) && (
        <div className="text-xs text-muted-foreground mt-1">
          Configure indicators in the Start Node first
        </div>
      )}
    </div>
  );
};

export default IndicatorSelector;
