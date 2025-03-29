import React from 'react';
import { ActionNodeData } from './types';

interface ActionLabelProps {
  data: ActionNodeData;
}

const ActionLabel: React.FC<ActionLabelProps> = ({ data }) => {
  // For backward compatibility, check the first position if positions exist
  const firstPosition = data.positions && data.positions.length > 0 ? data.positions[0] : null;
  
  // If there's a custom label, use it
  if (data.label) {
    return <>{data.label}</>;
  }

  // Otherwise, build a default label based on the action type
  let label;
  
  switch (data.actionType) {
    case 'entry':
      label = firstPosition?.positionType === 'buy' ? 'Buy' : 'Sell';
      break;
    case 'exit':
      label = 'Exit Position';
      break;
    case 'alert':
      label = 'Send Alert';
      break;
    default:
      label = 'Action';
  }

  return <>{label}</>;
};

export default ActionLabel;
