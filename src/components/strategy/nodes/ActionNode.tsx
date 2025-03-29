
import React, { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ActionNodeData } from './action-node/types';

// Properly type the NodeProps with ActionNodeData
const ActionNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const startNodeSymbol = useStartNodeSymbol();
  const nodeData = data as ActionNodeData;
  
  const isSymbolMissing = useMemo(() => {
    if (nodeData.positions && nodeData.positions.length > 0) {
      // For positions-based action nodes, we don't show the symbol missing warning
      return false;
    }
    return nodeData.requiresSymbol !== false && !nodeData.symbol && !startNodeSymbol;
  }, [nodeData.requiresSymbol, nodeData.symbol, startNodeSymbol, nodeData.positions]);

  return (
    <ActionNodeContent
      data={{
        ...nodeData,
        positions: nodeData.positions || []  // Ensure positions is always defined
      }}
      startNodeSymbol={startNodeSymbol}
      isSymbolMissing={isSymbolMissing}
      id={id}
      updateNodeData={nodeData.updateNodeData}
    />
  );
};

export default ActionNode;
