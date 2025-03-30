
import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import IndicatorForm from '../IndicatorForm';
import { indicatorConfig } from '../../utils/indicatorConfig';
import { UsageReference } from '../../utils/dependency-tracking/types';
import RemoveIndicatorDialog from './RemoveIndicatorDialog';

interface SelectedIndicatorProps {
  name: string;
  values: Record<string, any>;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onParameterChange: (paramName: string, value: any) => void;
  findUsages: (indicatorName: string) => UsageReference[];
}

const SelectedIndicator: React.FC<SelectedIndicatorProps> = ({
  name,
  values,
  isOpen,
  onToggle,
  onRemove,
  onParameterChange,
  findUsages
}) => {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  
  // Get indicator config and usages outside of render to optimize
  const baseName = name.split('_')[0];
  const indicator = indicatorConfig.find(ind => ind.id === baseName);
  const usages = findUsages(name);
  const hasUsages = usages.length > 0;
  
  // Format parameter display values
  const getDisplayValue = useCallback((param: any, value: any) => {
    if (param.type === 'select' && param.options) {
      const option = param.options.find((opt: any) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }, []);
  
  if (!indicator) {
    return (
      <div className="border rounded-md p-2 mb-2 bg-muted/20">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{name}</div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
          <AlertTriangle className="h-3 w-3" />
          Indicator config not found
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-2 mb-2 bg-card">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <div className="flex justify-between items-center">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-7 flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-1 text-left">
                <div className="text-sm font-medium">{indicator.name}</div>
                <div className="text-xs text-muted-foreground">
                  {indicator.parameters.map(param => (
                    values[param.name] !== undefined && 
                    <span key={param.name} className="mr-1">
                      {getDisplayValue(param, values[param.name])}
                    </span>
                  ))}
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 opacity-50" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </CollapsibleTrigger>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 ml-1" 
            onClick={() => setShowRemoveDialog(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <CollapsibleContent className="pt-2">
          <IndicatorForm
            indicator={indicator}
            values={values}
            onChange={onParameterChange}
          />
        </CollapsibleContent>
      </Collapsible>
      
      <RemoveIndicatorDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={onRemove}
        indicatorName={name}
        hasUsages={hasUsages}
        usages={usages}
      />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(SelectedIndicator);
