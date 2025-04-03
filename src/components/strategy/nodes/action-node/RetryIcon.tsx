
import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface RetryIconProps {
  enabled: boolean;
  groupNumber: number;
  maxReEntries: number;
}

const RetryIcon: React.FC<RetryIconProps> = ({ enabled, groupNumber, maxReEntries }) => {
  if (!enabled) return null;
  
  return (
    <div 
      className="absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-sm border border-primary/30"
      title={`Re-Entry Group ${groupNumber}: Max ${maxReEntries} re-entries`}
    >
      <RefreshCcw size={12} className="stroke-[2.5px]" />
      <div className="absolute -right-1.5 -bottom-1.5 bg-white dark:bg-gray-800 text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center border border-primary shadow-sm">
        {maxReEntries}
      </div>
    </div>
  );
};

export default RetryIcon;
