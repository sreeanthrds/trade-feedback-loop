
import React, { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ActionNodeData } from './action-node/types';

// Properly type the NodeProps with ActionNodeData
const ExitNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const startNodeSymbol = useStartNodeSymbol();
  
  // Create a safe version of nodeData with default values for required fields
  const nodeData = useMemo(() => {
    const rawData = data as Record<string, unknown>;
    return {
      positions: Array.isArray(rawData.positions) ? rawData.positions : [],
      requiresSymbol: rawData.requiresSymbol as boolean | undefined,
      symbol: rawData.symbol as string | undefined,
      updateNodeData: rawData.updateNodeData as ((id: string, data: Partial<ActionNodeData>) => void) | undefined,
      // Include actionType explicitly set to 'exit'
      actionType: 'exit' as const,
      label: (rawData.label as string) || 'Exit Position',
      instrument: rawData.instrument as string | undefined,
      _lastUpdated: rawData._lastUpdated as number | undefined,
      exitOrderConfig: rawData.exitOrderConfig as Record<string, unknown> | undefined
    } as ActionNodeData;
  }, [data]);
  
  const isSymbolMissing = useMemo(() => {
    if (nodeData.positions && nodeData.positions.length > 0) {
      // For positions-based nodes, we don't show the symbol missing warning
      return false;
    }
    return nodeData.requiresSymbol !== false && !nodeData.symbol && !startNodeSymbol;
  }, [nodeData.requiresSymbol, nodeData.symbol, startNodeSymbol, nodeData.positions]);

  return (
    <ActionNodeContent
      data={nodeData}
      startNodeSymbol={startNodeSymbol}
      isSymbolMissing={isSymbolMissing}
      id={id}
      updateNodeData={nodeData.updateNodeData}
    />
  );
};

export default ExitNode;
