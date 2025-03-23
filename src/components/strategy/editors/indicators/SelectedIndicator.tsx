import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import IndicatorForm from '../IndicatorForm';
import { indicatorConfig } from '../../utils/indicatorConfig';

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
  const getIndicatorDisplayName = () => {
    const baseName = name.split('_')[0];
    
    if (values && baseName in indicatorConfig) {
      // Just join all parameter values with commas, no parameter names
      const paramList = Object.values(values).join(',');
      
      return `${baseName} (${paramList})`;
    }
    
    return name;
  };

  return (
    <div className="border rounded-md">
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
      >
        <div className="flex items-center justify-between p-3">
          <div className="font-medium">{getIndicatorDisplayName()}</div>
          <div className="flex items-center gap-1">
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
              onClick={onRemove}
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
    </div>
  );
};

export default SelectedIndicator;
