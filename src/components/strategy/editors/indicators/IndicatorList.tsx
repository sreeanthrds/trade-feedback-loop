
import React from 'react';
import SelectedIndicator from './SelectedIndicator';
import NoIndicatorsMessage from './NoIndicatorsMessage';

interface IndicatorListProps {
  selectedIndicators: Record<string, Record<string, any>>;
  openStates: Record<string, boolean>;
  onToggle: (indicatorName: string) => void;
  onRemove: (indicatorName: string) => void;
  onParameterChange: (indicatorName: string, paramName: string, value: any) => void;
}

const IndicatorList: React.FC<IndicatorListProps> = ({
  selectedIndicators,
  openStates,
  onToggle,
  onRemove,
  onParameterChange
}) => {
  if (Object.keys(selectedIndicators).length === 0) {
    return <NoIndicatorsMessage />;
  }
  
  return (
    <div className="space-y-3">
      {Object.keys(selectedIndicators).map((name) => (
        <SelectedIndicator
          key={name}
          name={name}
          values={selectedIndicators[name]}
          isOpen={openStates[name] || false}
          onToggle={() => onToggle(name)}
          onRemove={() => onRemove(name)}
          onParameterChange={(paramName, value) => 
            onParameterChange(name, paramName, value)
          }
        />
      ))}
    </div>
  );
};

export default IndicatorList;
