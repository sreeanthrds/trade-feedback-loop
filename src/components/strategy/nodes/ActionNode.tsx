
import React, { memo } from 'react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ActionNodeData } from './action-node/types';

const ActionNode = ({ data, id }: { data: ActionNodeData, id: string }) => {
  const startNodeSymbol = useStartNodeSymbol(data.instrument);
  const isSymbolMissing = data.instrument && !startNodeSymbol;
  
  // Ensure positions array exists
  const safeData = {
    ...data,
    positions: data.positions || []
  };
  
  return (
    <ActionNodeContent 
      data={safeData} 
      startNodeSymbol={startNodeSymbol}
      isSymbolMissing={isSymbolMissing}
      id={id}
    />
  );
};

export default memo(ActionNode);
