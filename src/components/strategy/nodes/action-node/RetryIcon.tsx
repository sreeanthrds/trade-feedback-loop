
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RetryIconProps {
  enabled: boolean;
  groupNumber?: number;
  maxReEntries?: number;
}

const RetryIcon: React.FC<RetryIconProps> = ({ enabled, groupNumber = 1, maxReEntries = 1 }) => {
  if (!enabled) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="absolute -left-3 -top-3 bg-purple-500 rounded-full p-1.5 border-2 border-background shadow-sm">
            <div className="relative">
              <RefreshCcw size={14} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {maxReEntries}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-xs">
            <p>Position Re-Entry</p>
            <p className="text-muted-foreground">Group: {groupNumber} • Max: {maxReEntries}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RetryIcon;
