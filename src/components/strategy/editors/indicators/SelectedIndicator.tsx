
import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usages, setUsages] = useState<UsageReference[]>([]);
  
  // Memoize display name calculation to prevent unnecessary recalculations
  const getIndicatorDisplayName = useCallback(() => {
    const baseName = name.split('_')[0];
    
    if (values && baseName in indicatorConfig) {
      // Create a copy of parameters without indicator_name
      const displayParams = { ...values };
      delete displayParams.indicator_name;
      
      // Just join all parameter values with commas, no parameter names
      const paramList = Object.values(displayParams).join(',');
      
      return `${baseName} (${paramList})`;
    }
    
    return name;
  }, [name, values]);

  // Memoize remove handler to prevent recreation on each render
  const handleRemoveClick = useCallback(() => {
    // Find usages before showing dialog
    const foundUsages = findUsages(name);
    
    if (foundUsages.length > 0) {
      setUsages(foundUsages);
      setIsDialogOpen(true);
    } else {
      // No usages, safe to remove
      onRemove();
    }
  }, [findUsages, name, onRemove]);

  const confirmRemove = useCallback(() => {
    onRemove();
    setIsDialogOpen(false);
  }, [onRemove]);
  
  // Memoize parameter change handler
  const handleParameterChange = useCallback((paramName: string, value: any) => {
    onParameterChange(paramName, value);
  }, [onParameterChange]);

  return (
    <div className="border rounded-md w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className="w-full"
      >
        <div className="flex items-center justify-between p-3">
          <div className="font-medium truncate max-w-[calc(100%-80px)]">{getIndicatorDisplayName()}</div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveClick}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <RemoveIndicatorDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              indicatorDisplayName={getIndicatorDisplayName()}
              usages={usages}
              onConfirm={confirmRemove}
            />
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-3 pb-3">
            <IndicatorForm
              indicator={indicatorConfig[name.split('_')[0]]}
              values={values}
              onChange={handleParameterChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(SelectedIndicator);
