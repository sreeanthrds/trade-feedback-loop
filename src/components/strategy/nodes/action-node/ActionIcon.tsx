
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, X, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { ActionNodeData } from './types';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  switch (data.actionType) {
    case 'entry': 
      return data.positionType === 'buy' 
        ? <ArrowUpCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" /> 
        : <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-500 mr-2" />;
    case 'exit': 
      return <X className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2" />;
    case 'alert': 
      return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />;
    default: 
      return <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />;
  }
};

export default ActionIcon;
