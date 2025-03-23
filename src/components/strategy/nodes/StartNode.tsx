
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Calendar, Building, BarChart, LineChart } from 'lucide-react';

interface StartNodeProps {
  data: {
    label?: string;
    timeframe?: string;
    exchange?: string;
    symbol?: string;
    tradingInstrument?: {
      type: 'stock' | 'futures' | 'options';
      underlyingType?: 'index' | 'indexFuture' | 'stock';
    };
    indicators?: string[];
    indicatorParameters?: Record<string, Record<string, any>>;
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

  // Helper to generate instrument display text
  const getInstrumentDisplay = () => {
    if (!data.tradingInstrument) return null;
    
    const { type, underlyingType } = data.tradingInstrument;
    
    if (type === 'options' && underlyingType) {
      return `${underlyingType.charAt(0).toUpperCase() + underlyingType.slice(1)} Options`;
    }
    
    return type.charAt(0).toUpperCase() + type.slice(1);
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
        
        {(data.timeframe || data.exchange || data.symbol || data.tradingInstrument) && (
          <div className="border-t border-border pt-2 mt-2 space-y-1.5">
            {data.tradingInstrument && (
              <div className="flex items-center gap-2 text-xs">
                <LineChart className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{getInstrumentDisplay()}</span>
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
            
            {data.symbol && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <span>{data.symbol}</span>
              </div>
            )}
          </div>
        )}
        
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
