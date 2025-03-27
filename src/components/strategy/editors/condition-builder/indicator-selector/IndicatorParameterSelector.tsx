
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExpressionIcon from '../components/ExpressionIcon';

interface IndicatorParameterSelectorProps {
  indicator: string;
  parameter?: string;
  onParameterChange: (value: string) => void;
  hasMultipleOutputs: boolean;
}

const IndicatorParameterSelector: React.FC<IndicatorParameterSelectorProps> = ({
  indicator,
  parameter,
  onParameterChange,
  hasMultipleOutputs
}) => {
  if (!indicator || !hasMultipleOutputs) {
    return null;
  }

  const getParameterOptions = (): string[] => {
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
  
  return (
    <Select 
      value={parameter} 
      onValueChange={onParameterChange}
    >
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Select output">
          {parameter && (
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={parameter} />
              <span>{parameter}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {getParameterOptions().map((param) => (
          <SelectItem key={param} value={param}>
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={param} />
              <span>{param}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IndicatorParameterSelector;
