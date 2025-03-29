
import React, { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ActionNodeData } from './action-node/types';

// Properly type the NodeProps with ActionNodeData
const ActionNode: React.FC<NodeProps<ActionNodeData>> = ({ id, data, selected }) => {
  const startNodeSymbol = useStartNodeSymbol();
  const isSymbolMissing = useMemo(() => {
    if (data.positions && data.positions.length > 0) {
      // For positions-based action nodes, we don't show the symbol missing warning
      return false;
    }
    return data.requiresSymbol !== false && !data.symbol && !startNodeSymbol;
  }, [data.requiresSymbol, data.symbol, startNodeSymbol, data.positions]);

  return (
    <ActionNodeContent
      data={data}
      startNodeSymbol={startNodeSymbol}
      isSymbolMissing={isSymbolMissing}
      id={id}
      updateNodeData={data.updateNodeData}
    />
  );
};

export default ActionNode;
