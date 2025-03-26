
import React, { memo } from 'react';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import ActionNodeContent from './action-node/ActionNodeContent';
import { ActionNodeData } from './action-node/types';

interface ActionNodeProps {
  data: ActionNodeData;
  id: string;
}

const ActionNode = ({ data, id }: ActionNodeProps) => {
  // Make a copy of data to prevent potential null reference issues
  const safeData = { ...data };
  
  // Get the start node symbol to display
  const startNodeSymbol = useStartNodeSymbol(safeData?.instrument);
  
  return <ActionNodeContent data={safeData} startNodeSymbol={startNodeSymbol} />;
};

export default memo(ActionNode);
