
import React from 'react';
import { ActionNodeData } from './types';
import { CircleDollarSign, Bell, Activity } from 'lucide-react';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  // Set color based on action type
  let iconColor = '';
  
  if (data.actionType === 'entry') {
    iconColor = 'text-green-500';
  } else if (data.actionType === 'exit') {
    iconColor = 'text-blue-500';
  } else if (data.actionType === 'alert') {
    iconColor = 'text-amber-500';
  }

  // Determine which icon to show based only on action type
  let Icon;
  
  if (data.actionType === 'entry' || data.actionType === 'exit') {
    Icon = CircleDollarSign;
  } else if (data.actionType === 'alert') {
    Icon = Bell;
  } else {
    Icon = Activity; // Default fallback
  }

  return (
    <div className={`p-1 mr-2 rounded ${iconColor}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
};

export default ActionIcon;
