
import React, { memo } from 'react';
import { Separator } from '@/components/ui/separator';
import InputField from './InputField';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NodeDetailsPanelProps {
  nodeLabel: string;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  additionalContent?: React.ReactNode;
  infoTooltip?: string;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  nodeLabel,
  onLabelChange,
  additionalContent,
  infoTooltip,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <InputField
          label="Node Label"
          id="node-label"
          value={nodeLabel || ''}
          onChange={onLabelChange}
          placeholder="Enter node label"
        />
        
        {infoTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help mt-6">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                <p>{infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {additionalContent && (
        <>
          <Separator />
          {additionalContent}
        </>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(NodeDetailsPanel);
