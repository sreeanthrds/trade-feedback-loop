import React from 'react';
import { Play, PauseCircle, Bell, ArrowRight } from 'lucide-react';

interface ActionIconProps {
  icon?: React.ReactNode;
  actionType: 'entry' | 'exit' | 'alert' | 'modify';
}

const ActionIcon: React.FC<ActionIconProps> = ({ icon, actionType }) => {
  // If a custom icon is provided, use it
  if (icon) {
    return <>{icon}</>;
  }
  
  // Otherwise, show an icon based on the action type
  switch (actionType) {
    case 'exit':
      return <PauseCircle className="h-4 w-4 text-destructive mr-1.5" />;
    case 'alert':
      return <Bell className="h-4 w-4 text-warning mr-1.5" />;
    case 'modify':
      return <ArrowRight className="h-4 w-4 text-amber-500 mr-1.5" />;
    case 'entry':
    default:
      return <Play className="h-4 w-4 text-success mr-1.5" />;
  }
};

export default ActionIcon;
