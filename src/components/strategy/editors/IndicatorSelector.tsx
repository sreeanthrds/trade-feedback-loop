import React, { useState } from 'react';
import { indicatorConfig, Indicator } from '../utils/indicatorConfig';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import IndicatorForm from './IndicatorForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  
  const allIndicatorOptions = Object.keys(indicatorConfig);
  
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
  
  const getIndicatorDisplayName = (key: string) => {
    const baseName = key.split('_')[0];
    
    if (selectedIndicators[key] && baseName in indicatorConfig) {
      const timeperiod = selectedIndicators[key]['timeperiod'];
      if (timeperiod) {
        return `${baseName} (${timeperiod})`;
      }
      
      if (baseName === 'MACD') {
        const fast = selectedIndicators[key]['fastperiod'];
        const slow = selectedIndicators[key]['slowperiod'];
        const signal = selectedIndicators[key]['signalperiod'];
        if (fast && slow && signal) {
          return `${baseName} (${fast},${slow},${signal})`;
        }
      }
      
      if (baseName === 'BollingerBands') {
        const period = selectedIndicators[key]['timeperiod'];
        const devUp = selectedIndicators[key]['nbdevup'];
        if (period && devUp) {
          return `${baseName} (${period},${devUp})`;
        }
      }
    }
    
    return key;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="indicator-select" className="mb-2 block">
            Add Indicator
          </Label>
          <Select
            value={selectedIndicator}
            onValueChange={setSelectedIndicator}
          >
            <SelectTrigger id="indicator-select">
              <SelectValue placeholder="Select indicator" />
            </SelectTrigger>
            <SelectContent>
              {allIndicatorOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          size="sm" 
          onClick={handleAddIndicator} 
          disabled={!selectedIndicator}
          className="mb-0.5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
      
      {Object.keys(selectedIndicators).length > 0 ? (
        <div className="space-y-3">
          {Object.keys(selectedIndicators).map((name) => (
            <div key={name} className="border rounded-md">
              <Collapsible
                open={openStates[name] || false}
                onOpenChange={() => toggleOpen(name)}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="font-medium">{getIndicatorDisplayName(name)}</div>
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {openStates[name] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIndicator(name)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="px-3 pb-3">
                    <IndicatorForm
                      indicator={indicatorConfig[name.split('_')[0]]}
                      values={selectedIndicators[name]}
                      onChange={(paramName, value) => 
                        handleParameterChange(name, paramName, value)
                      }
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
          No indicators selected. Add indicators to configure your strategy.
        </div>
      )}
    </div>
  );
};

export default IndicatorSelector;
