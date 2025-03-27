
import React from 'react';
import { indicatorConfig } from '../utils/indicatorConfig';
import AddIndicatorForm from './indicators/AddIndicatorForm';
import SelectedIndicator from './indicators/SelectedIndicator';
import NoIndicatorsMessage from './indicators/NoIndicatorsMessage';
import { useIndicatorManagement } from './indicators/hooks/useIndicatorManagement';

interface IndicatorSelectorProps {
  selectedIndicators: Record<string, Record<string, any>>;
  onChange: (indicators: Record<string, Record<string, any>>) => void;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  selectedIndicators,
  onChange,
}) => {
  const {
    selectedIndicator,
    openStates,
    setSelectedIndicator,
    handleAddIndicator,
    handleRemoveIndicator,
    handleParameterChange,
    toggleOpen,
    findUsages
  } = useIndicatorManagement({
    selectedIndicators,
    onChange
  });
  
  const onAddIndicator = () => {
    if (selectedIndicator) {
      const newIndicator = indicatorConfig[selectedIndicator];
      handleAddIndicator(newIndicator);
    }
  };
  
  return (
    <div className="space-y-4">
      <AddIndicatorForm
        selectedIndicator={selectedIndicator}
        onSelectIndicator={setSelectedIndicator}
        onAddIndicator={onAddIndicator}
      />
      
      {Object.keys(selectedIndicators).length > 0 ? (
        <div className="space-y-3">
          {Object.keys(selectedIndicators).map((name) => (
            <SelectedIndicator
              key={name}
              name={name}
              values={selectedIndicators[name]}
              isOpen={openStates[name] || false}
              onToggle={() => toggleOpen(name)}
              onRemove={() => handleRemoveIndicator(name)}
              onParameterChange={(paramName, value) => 
                handleParameterChange(name, paramName, value)
              }
              findUsages={findUsages}
            />
          ))}
        </div>
      ) : (
        <NoIndicatorsMessage />
      )}
    </div>
  );
};

export default IndicatorSelector;
