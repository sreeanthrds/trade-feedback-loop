
import React from 'react';
import { ActionNodeData } from './types';
import { ArrowDown, ArrowUp, Bell, Activity } from 'lucide-react';

interface ActionIconProps {
  data: ActionNodeData;
}

const ActionIcon: React.FC<ActionIconProps> = ({ data }) => {
  // Check if there are multiple positions
  const hasMultiplePositions = data.positions && data.positions.length > 1;
  
  // For backward compatibility or single position, check the first position
  const firstPosition = data.positions && data.positions.length > 0 ? data.positions[0] : null;
  
  // Set color based on action type
  let iconColor = '';
  
  if (data.actionType === 'entry') {
    iconColor = 'text-green-500';
  } else if (data.actionType === 'exit') {
    iconColor = 'text-blue-500';
  } else if (data.actionType === 'alert') {
    iconColor = 'text-amber-500';
  }

  // Determine which icon to show
  let Icon;
  
  if (hasMultiplePositions) {
    // Use a generic Activity icon for multiple positions
    Icon = Activity;
  } else if (data.actionType === 'entry' && firstPosition?.positionType === 'buy') {
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
