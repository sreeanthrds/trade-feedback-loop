
import React from 'react';
import { ActionNodeData } from './types';
import { ShoppingCart, LogOut, Bell } from 'lucide-react';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  // Set color based on action type
  let iconColor = '';
  
  if (data.actionType === 'entry') {
    iconColor = 'text-emerald-500';
  } else if (data.actionType === 'exit') {
    iconColor = 'text-amber-500';
  } else if (data.actionType === 'alert') {
    iconColor = 'text-blue-500';
  }

  // Determine which icon to show based on action type
  let Icon;
  
  if (data.actionType === 'entry') {
    Icon = ShoppingCart; // Better icon for entry (buying)
  } else if (data.actionType === 'exit') {
    Icon = LogOut; // Better icon for exit (leaving position)
  } else if (data.actionType === 'alert') {
    Icon = Bell; // Bell for alert notifications
  } else {
    Icon = ShoppingCart; // Default fallback
  }

  return (
    <div className={`p-1 mr-2 rounded ${iconColor}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
};

export default ActionIcon;
