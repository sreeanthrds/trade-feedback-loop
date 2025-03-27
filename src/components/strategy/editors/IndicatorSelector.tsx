
import React, { useState } from 'react';
import AddIndicatorForm from './indicators/AddIndicatorForm';
import IndicatorList from './indicators/IndicatorList';
import { toast } from "@/hooks/use-toast";
import { useDependencyChecking } from './hooks/useDependencyChecking';
import { indicatorConfig } from '../utils/indicatorConfig';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  
  const {
    isDialogOpen,
    usages,
    pendingIndicatorToRemove,
    checkDependenciesBeforeRemove,
    confirmRemoval,
    cancelRemoval,
    cleanupNodeConditionsAfterRemoval,
    setIsDialogOpen
  } = useDependencyChecking();
  
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
    
    toast({
      title: "Indicator added",
      description: `Added ${baseIndicatorName} indicator`
    });
  };
  
  const handleRemoveIndicator = (indicatorName: string) => {
    checkDependenciesBeforeRemove(indicatorName, () => {
      // Create a new object without the deleted indicator
      const { [indicatorName]: removed, ...rest } = selectedIndicators;
      
      // Update indicator parameters in start node
      onChange(rest);
      
      // Cleanup any nodes that are using this indicator
      cleanupNodeConditionsAfterRemoval(indicatorName);
      
      toast({
        title: "Indicator removed",
        description: `Removed ${indicatorName.split('_')[0]} indicator`
      });
    });
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
      
      <IndicatorList
        selectedIndicators={selectedIndicators}
        openStates={openStates}
        onToggle={toggleOpen}
        onRemove={handleRemoveIndicator}
        onParameterChange={handleParameterChange}
      />
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingIndicatorToRemove && pendingIndicatorToRemove.split('_')[0]}?</AlertDialogTitle>
            <AlertDialogDescription>
              This indicator is currently used in the following places:
              <ul className="mt-2 space-y-1 text-sm">
                {usages.map((usage, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>{usage.nodeName} ({usage.context})</span>
                  </li>
                ))}
              </ul>
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deleting this indicator will break functionality in the nodes listed above.
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoval}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmRemoval(() => {
                // Create a new object without the deleted indicator
                if (pendingIndicatorToRemove) {
                  const { [pendingIndicatorToRemove]: removed, ...rest } = selectedIndicators;
                  
                  // Update indicator parameters in start node
                  onChange(rest);
                  
                  // Cleanup any nodes that are using this indicator
                  cleanupNodeConditionsAfterRemoval(pendingIndicatorToRemove);
                  
                  toast({
                    title: "Indicator removed",
                    description: `Removed ${pendingIndicatorToRemove.split('_')[0]} indicator`
                  });
                }
              })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IndicatorSelector;
