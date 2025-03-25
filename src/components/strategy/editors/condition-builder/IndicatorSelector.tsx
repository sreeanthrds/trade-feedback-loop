
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
  
  useEffect(() => {
    const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
    if (startNode && startNode.data && startNode.data.indicators && 
        Array.isArray(startNode.data.indicators) && startNode.data.indicators.length > 0) {
      setAvailableIndicators(startNode.data.indicators);
    } else {
      setAvailableIndicators([]);
    }
  }, [strategyStore.nodes]);
  
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
      'PivotPoints'  // Added PivotPoints to multi-output indicators
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
      'PivotPoints': ['Pivot', 'R1', 'R2', 'R3', 'S1', 'S2', 'S3'] // Added PivotPoints parameters
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
      
      // Format all parameters into a single, readable string - only values
      const paramList = Object.values(params).join(',');
      
      return `${baseName}(${paramList})`;
    }
    
    return key;
  };
  
  return (
    <div className="space-y-2">
      <Select 
        value={indicatorExpr.name} 
        onValueChange={updateIndicatorName}
        disabled={availableIndicators.length === 0}
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
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No indicators available
            </div>
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
      
      {availableIndicators.length === 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          No indicators selected. Configure indicators in the Start Node first.
        </div>
      )}
    </div>
  );
};

export default IndicatorSelector;
