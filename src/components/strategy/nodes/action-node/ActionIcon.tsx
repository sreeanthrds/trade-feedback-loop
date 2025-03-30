
import React from 'react';
import { Play, PauseCircle, Bell, ArrowRight } from 'lucide-react';
import { ActionNodeData } from './types';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  // Default to entry if not specified
  const actionType = data.actionType || 'entry';
  
  switch (actionType) {
    case 'exit':
      return <PauseCircle className="h-4 w-4 text-destructive mr-1.5" />;
    case 'alert':
      return <Bell className="h-4 w-4 text-warning mr-1.5" />;
    case 'entry':
    default:
      return <Play className="h-4 w-4 text-success mr-1.5" />;
  }
};

export default ActionIcon;
