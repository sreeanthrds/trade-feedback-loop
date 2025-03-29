
import React from 'react';
import { ActionNodeData } from './types';
import { ArrowDown, ArrowUp, Bell } from 'lucide-react';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  // For backward compatibility, check the first position if positions exist
  const firstPosition = data.positions && data.positions.length > 0 ? data.positions[0] : null;
  
  // Set color based on action type or position type
  let iconColor = '';
  
  if (data.actionType === 'entry' && firstPosition?.positionType === 'buy') {
    iconColor = 'text-green-500';
  } else if (data.actionType === 'entry' && firstPosition?.positionType === 'sell') {
    iconColor = 'text-red-500';
  } else if (data.actionType === 'exit') {
    iconColor = 'text-blue-500';
  } else if (data.actionType === 'alert') {
    iconColor = 'text-amber-500';
  }

  // Determine which icon to show
  let Icon;
  
  if (data.actionType === 'entry' && firstPosition?.positionType === 'buy') {
    Icon = ArrowUp;
  } else if (data.actionType === 'entry' && firstPosition?.positionType === 'sell') {
    Icon = ArrowDown;
  } else if (data.actionType === 'exit') {
    Icon = firstPosition?.positionType === 'buy' ? ArrowDown : ArrowUp;
  } else if (data.actionType === 'alert') {
    Icon = Bell;
  } else {
    Icon = Bell; // Default fallback
  }

  return (
    <div className={`p-1 mr-2 rounded ${iconColor}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
};

export default ActionIcon;
