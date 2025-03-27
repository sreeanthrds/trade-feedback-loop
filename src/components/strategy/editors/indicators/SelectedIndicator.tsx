
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import IndicatorForm from '../IndicatorForm';
import { indicatorConfig } from '../../utils/indicatorConfig';
import { useReactFlow } from '@xyflow/react';
import { findIndicatorUsages, UsageReference } from '../../utils/dependency-tracking/usageFinder';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SelectedIndicatorProps {
  name: string;
  values: Record<string, any>;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onParameterChange: (paramName: string, value: any) => void;
}

const SelectedIndicator: React.FC<SelectedIndicatorProps> = ({
  name,
  values,
  isOpen,
  onToggle,
  onRemove,
  onParameterChange
}) => {
  const { getNodes } = useReactFlow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usages, setUsages] = useState<UsageReference[]>([]);
  
  const getIndicatorDisplayName = () => {
    const baseName = name.split('_')[0];
    
    if (values && baseName in indicatorConfig) {
      // Create a copy of parameters without indicator_name
      const displayParams = { ...values };
      delete displayParams.indicator_name;
      
      // Just join all parameter values with commas, no parameter names
      const paramList = Object.values(displayParams).join(',');
      
      return `${baseName}(${paramList})`;
    }
    
    return name;
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the collapsible toggle
    
    // Find usages before showing dialog
    const allNodes = getNodes();
    const foundUsages = findIndicatorUsages(name, allNodes);
    
    if (foundUsages.length > 0) {
      setUsages(foundUsages);
      setIsDialogOpen(true);
    } else {
      // No usages, safe to remove
      onRemove();
    }
  };

  const confirmRemove = () => {
    onRemove();
    setIsDialogOpen(false);
  };

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
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-3 pb-3">
            <IndicatorForm
              indicator={indicatorConfig[name.split('_')[0]]}
              values={values}
              onChange={onParameterChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {getIndicatorDisplayName()}?</AlertDialogTitle>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemove}
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

export default SelectedIndicator;
