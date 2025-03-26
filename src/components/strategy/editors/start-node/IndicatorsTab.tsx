
import React from 'react';
import IndicatorSelector from '../IndicatorSelector';

interface IndicatorsTabProps {
  indicatorParameters: Record<string, Record<string, any>>;
  onIndicatorsChange: (indicatorParams: Record<string, Record<string, any>>) => void;
}

const IndicatorsTab: React.FC<IndicatorsTabProps> = ({
  indicatorParameters,
  onIndicatorsChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-sm font-medium text-foreground">Technical Indicators</h3>
      </div>
      
      <div className="pt-1">
        <IndicatorSelector
          selectedIndicators={indicatorParameters || {}}
          onChange={onIndicatorsChange}
        />
      </div>
    </div>
  );
};

export default IndicatorsTab;
