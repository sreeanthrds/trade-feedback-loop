
import React, { useMemo, memo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeTemplate from './templates/ActionNodeTemplate';
import { getNodeIcon } from '../utils/nodes/nodeIcons';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ExitNodeData } from '../editors/action-node/exit-node/types';

const EntryNode: React.FC<NodeProps> = ({ id, data, selected, isConnectable, type, zIndex, dragging, draggable, selectable, deletable, positionAbsoluteX, positionAbsoluteY }) => {
  const startNodeSymbol = useStartNodeSymbol();
  
  // Create a safe version of nodeData with default values for required fields
  const nodeData = useMemo(() => {
    const rawData = data as Record<string, unknown>;
    return {
      label: (rawData.label as string) || 'Entry Order',
      actionType: 'entry' as const,
      positions: Array.isArray(rawData.positions) ? rawData.positions : [],
      requiresSymbol: rawData.requiresSymbol as boolean | undefined,
      symbol: rawData.symbol as string | undefined,
      icon: getNodeIcon('entry'),
      description: 'Enter new positions',
      // Add exit node data to support post-execution features
      exitNodeData: rawData.exitNodeData as ExitNodeData | undefined
    };
  }, [data]);
  
  const isSymbolMissing = useMemo(() => {
    if (nodeData.positions && nodeData.positions.length > 0) {
      // For positions-based nodes, we don't show the symbol missing warning
      return false;
    }
    return nodeData.requiresSymbol !== false && !nodeData.symbol && !startNodeSymbol;
  }, [nodeData.requiresSymbol, nodeData.symbol, startNodeSymbol, nodeData.positions]);

  return (
    <ActionNodeTemplate
      id={id}
      data={nodeData}
      selected={selected}
      isConnectable={isConnectable}
      type={type || 'entryNode'}
      zIndex={zIndex || 0}
      dragging={dragging || false}
      draggable={draggable !== undefined ? draggable : true}
      selectable={selectable !== undefined ? selectable : true}
      deletable={deletable !== undefined ? deletable : true}
      positionAbsoluteX={positionAbsoluteX || 0}
      positionAbsoluteY={positionAbsoluteY || 0}
    />
  );
};

export default memo(EntryNode);
