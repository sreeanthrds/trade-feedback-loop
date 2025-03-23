
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
import ExpressionIcon from './components/ExpressionIcon';

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
    if (!indicator) return false;
    // Extract base indicator name (before any underscore or numeric suffix)
    const baseIndicator = indicator.split('_')[0];
    
    // Known indicators with multiple outputs
    const multiOutputIndicators = [
      'BollingerBands',
      'MACD',
      'Stochastic',
      'ADX',
      'Ichimoku'
    ];
    
    return multiOutputIndicators.includes(baseIndicator);
  };

  // Get parameter options for the selected indicator
  const getParameterOptions = (indicator: string): string[] => {
    if (!indicator) return [];
    
    // Extract base indicator name
    const baseIndicator = indicator.split('_')[0];
    
    // Output parameters for different indicators
    const outputParameters: Record<string, string[]> = {
      'BollingerBands': ['UpperBand', 'MiddleBand', 'LowerBand'],
      'MACD': ['MACD', 'Signal', 'Histogram'],
      'Stochastic': ['SlowK', 'SlowD'],
      'ADX': ['ADX', 'PlusDI', 'MinusDI'],
      'Ichimoku': ['Tenkan', 'Kijun', 'SenkouA', 'SenkouB', 'Chikou']
    };
    
    return outputParameters[baseIndicator] || [];
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
      
      // Format parameter string by joining all parameters
      const paramList = Object.entries(params)
        .map(([paramName, value]) => `${paramName.includes('period') ? '' : paramName + ':'}${value}`)
        .join(',');
      
      return `${baseName} (${paramList})`;
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
          <SelectValue placeholder="Select indicator">
            {indicatorExpr.name && (
              <div className="flex items-center gap-2">
                <ExpressionIcon type="indicator" subType={indicatorExpr.parameter} />
                <span>{getIndicatorDisplayName(indicatorExpr.name)}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableIndicators.length > 0 ? (
            availableIndicators.map((indicator) => (
              <SelectItem key={indicator} value={indicator}>
                <div className="flex items-center gap-2">
                  <ExpressionIcon type="indicator" />
                  <span>{getIndicatorDisplayName(indicator)}</span>
                </div>
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
            <SelectValue placeholder="Select output">
              {indicatorExpr.parameter && (
                <div className="flex items-center gap-2">
                  <ExpressionIcon type="indicator" subType={indicatorExpr.parameter} />
                  <span>{indicatorExpr.parameter}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {getParameterOptions(indicatorExpr.name).map((param) => (
              <SelectItem key={param} value={param}>
                <div className="flex items-center gap-2">
                  <ExpressionIcon type="indicator" subType={param} />
                  <span>{param}</span>
                </div>
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
