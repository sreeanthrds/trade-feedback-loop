
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import IndicatorForm from '../IndicatorForm';
import { getIndicatorDisplayName } from '../../utils/indicatorUtils';

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
  const indicatorParams = { [name]: values };
  const displayName = getIndicatorDisplayName(name, indicatorParams);

  return (
    <div className="border rounded-md w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className="w-full"
      >
        <div className="flex items-center justify-between p-3">
          <div className="font-medium truncate max-w-[calc(100%-80px)]">{displayName}</div>
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
              indicator={values._indicatorConfig || name.split('_')[0]}
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
