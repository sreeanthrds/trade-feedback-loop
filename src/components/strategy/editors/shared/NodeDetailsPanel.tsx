
import React from 'react';
import { 
  Info, 
  XCircle,
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

interface NodeDetailsPanelProps {
  nodeLabel: string;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  infoTooltip?: string;
  additionalContent?: React.ReactNode;
}

const NodeDetailsPanel = ({ 
  nodeLabel, 
  onLabelChange, 
  infoTooltip, 
  additionalContent 
}: NodeDetailsPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nodeLabel" className="text-sm font-medium flex items-center">
            Node Label
            {infoTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 text-muted-foreground hover:text-foreground">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{infoTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
        </div>
        <Input
          id="nodeLabel"
          value={nodeLabel}
          onChange={onLabelChange}
          className="h-8"
        />
      </div>
      
      {additionalContent}
    </div>
  );
};

export default NodeDetailsPanel;
