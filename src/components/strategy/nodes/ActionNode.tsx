
import React, { memo } from 'react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';

const ActionNode = ({ data, id }: { data: any, id: string }) => {
  const startNodeSymbol = useStartNodeSymbol(data.instrument);
  const isSymbolMissing = data.instrument && !startNodeSymbol;
  
  return (
    <ActionNodeContent 
      data={data} 
      startNodeSymbol={startNodeSymbol}
      isSymbolMissing={isSymbolMissing} 
      id={id}
    />
  );
};

export default memo(ActionNode);
