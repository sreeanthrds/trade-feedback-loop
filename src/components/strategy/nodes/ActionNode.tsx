
import React, { memo, useEffect, useState } from 'react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';

const ActionNode = ({ data, id }: { data: any, id: string }) => {
  const startNodeSymbol = useStartNodeSymbol(data.instrument);
  const isSymbolMissing = data.instrument && !startNodeSymbol;
  
  // Force re-render when data changes
  const [lastUpdated, setLastUpdated] = useState(data._lastUpdated || 0);
  
  useEffect(() => {
    if (data._lastUpdated && data._lastUpdated !== lastUpdated) {
      setLastUpdated(data._lastUpdated);
    }
  }, [data, data._lastUpdated, lastUpdated]);
  
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
