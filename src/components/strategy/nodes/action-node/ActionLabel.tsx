
import React from 'react';
import { ActionNodeData } from './types';

interface ActionLabelProps {
  data: ActionNodeData;
}

const ActionLabel: React.FC<ActionLabelProps> = ({ data }) => {
  if (!data.actionType) return <span>Action</span>;
  
  if (data.actionType === 'entry') {
    return <span>{data.positionType === 'buy' ? 'Buy' : 'Sell'} Entry</span>;
  } else if (data.actionType === 'exit') {
    return <span>Exit Position</span>;
  } else if (data.actionType === 'alert') {
    return <span>Alert</span>;
  }
  
  return <span>{data.label || "Action"}</span>;
};

export default ActionLabel;
