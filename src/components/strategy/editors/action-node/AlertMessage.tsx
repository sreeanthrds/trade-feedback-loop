
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertMessage: React.FC = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-md p-4 mt-3">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Alert Settings
        </span>
      </div>
      <p className="text-xs text-amber-700 dark:text-amber-400">
        This node will only generate an alert notification without placing any order.
      </p>
    </div>
  );
};

export default AlertMessage;
