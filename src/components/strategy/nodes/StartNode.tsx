import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Calendar, Building, BarChart, TrendingUp } from 'lucide-react';
import { TradingInstrumentData } from '../editors/form-components/trading-instrument/types';

interface StartNodeProps {
  data: {
    label?: string;
    timeframe?: string;
    exchange?: string;
    symbol?: string;
    indicators?: string[];
    indicatorParameters?: Record<string, Record<string, any>>;
    tradingInstrument?: TradingInstrumentData;
  };
}

const StartNode = ({ data }: StartNodeProps) => {
  // Helper to get a readable display name for an indicator
  const getIndicatorDisplayName = (key: string) => {
    if (!data.indicatorParameters) return key;
    
    // Extract base indicator name (before any underscore)
    const baseName = key.split('_')[0];
    
    // If we have parameters for this indicator
    if (data.indicatorParameters[key]) {
      const params = data.indicatorParameters[key];
      
      // Format all parameters into a single, readable string - only values
      const paramList = Object.values(params).join(',');
      
      return `${baseName}(${paramList})`;
    }
    
    return key;
  };

  // Helper to format the display of the trading instrument
  const getTradingInstrumentDisplay = () => {
    if (!data.tradingInstrument || !data.tradingInstrument.tradingType) {
      return data.symbol || 'Not specified';
    }

    const { tradingType, underlying, symbol } = data.tradingInstrument;
    
    if (!symbol) {
      return `${tradingType.charAt(0).toUpperCase() + tradingType.slice(1)} (Not specified)`;
    }
    
    if (tradingType === 'options' && underlying) {
      return `${symbol} ${underlying.charAt(0).toUpperCase() + underlying.slice(1)} Options`;
    }
    
    return `${symbol} ${tradingType.charAt(0).toUpperCase() + tradingType.slice(1)}`;
  };

  return (
    <div className="px-4 py-3 rounded-md border border-primary/20 bg-background shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center">
          <Play className="h-5 w-5 text-success mr-2 shrink-0" />
          <div>
            <div className="font-medium">{data.label || "Start"}</div>
            <div className="text-xs text-foreground/60">Strategy Entry Point</div>
          </div>
        </div>
        
        <div className="border-t border-border pt-2 mt-2 space-y-1.5">
          {data.tradingInstrument?.tradingType && (
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{getTradingInstrumentDisplay()}</span>
            </div>
          )}
          
          {data.timeframe && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{data.timeframe}</span>
            </div>
          )}
          
          {data.exchange && (
            <div className="flex items-center gap-2 text-xs">
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{data.exchange}</span>
            </div>
          )}
        </div>
        
        {data.indicators && data.indicators.length > 0 && (
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex items-center gap-2 text-xs mb-1">
              <BarChart className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">Indicators</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.indicators.map((indicator, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary-foreground"
                >
                  {getIndicatorDisplayName(indicator)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#4CAF50' }}
      />
    </div>
  );
};

export default memo(StartNode);
