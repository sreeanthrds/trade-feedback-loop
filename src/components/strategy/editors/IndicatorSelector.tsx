
import React, { useState } from 'react';
import { indicatorConfig } from '../utils/indicatorConfig';
import AddIndicatorForm from './indicators/AddIndicatorForm';
import SelectedIndicator from './indicators/SelectedIndicator';
import NoIndicatorsMessage from './indicators/NoIndicatorsMessage';

interface IndicatorSelectorProps {
  selectedIndicators: Record<string, Record<string, any>>;
  onChange: (indicators: Record<string, Record<string, any>>) => void;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  selectedIndicators,
  onChange,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  
  const handleAddIndicator = () => {
    if (!selectedIndicator) return;
    
    const newIndicator = indicatorConfig[selectedIndicator];
    
    const defaultValues = newIndicator.parameters.reduce((acc, param) => {
      acc[param.name] = param.default;
      return acc;
    }, {} as Record<string, any>);
    
    const baseIndicatorName = selectedIndicator;
    let uniqueKey = baseIndicatorName;
    let counter = 1;
    
    while (selectedIndicators[uniqueKey]) {
      uniqueKey = `${baseIndicatorName}_${counter}`;
      counter++;
    }
    
    const updatedIndicators = {
      ...selectedIndicators,
      [uniqueKey]: defaultValues
    };
    
    onChange(updatedIndicators);
    
    setOpenStates({
      ...openStates,
      [uniqueKey]: true
    });
    
    setSelectedIndicator("");
  };
  
  const handleRemoveIndicator = (indicatorName: string) => {
    const { [indicatorName]: removed, ...rest } = selectedIndicators;
    onChange(rest);
  };
  
  const handleParameterChange = (indicatorName: string, paramName: string, value: any) => {
    const updatedIndicators = {
      ...selectedIndicators,
      [indicatorName]: {
        ...selectedIndicators[indicatorName],
        [paramName]: value
      }
    };
    
    onChange(updatedIndicators);
  };
  
  const toggleOpen = (indicatorName: string) => {
    setOpenStates({
      ...openStates,
      [indicatorName]: !openStates[indicatorName]
    });
  };
  
  return (
    <div className="space-y-4">
      <AddIndicatorForm
        selectedIndicator={selectedIndicator}
        onSelectIndicator={setSelectedIndicator}
        onAddIndicator={handleAddIndicator}
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
