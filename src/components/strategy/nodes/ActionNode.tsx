
import React, { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeContent from './action-node/ActionNodeContent';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';
import { ActionNodeData } from './action-node/types';

// Properly type the NodeProps with ActionNodeData
const ActionNode: React.FC<NodeProps> = ({ id, data, selected, type }) => {
  const startNodeSymbol = useStartNodeSymbol();
  
  // Create a safe version of nodeData with default values for required fields
  const nodeData = useMemo(() => {
    const rawData = data as Record<string, unknown>;
    
    // Determine the action type based on node type or explicit setting
    let actionType = rawData.actionType as 'entry' | 'exit' | 'alert' | undefined;
    
    // If actionType is not set, try to infer it from the id prefix
    if (!actionType) {
      if (id.startsWith('entry-')) {
        actionType = 'entry';
      } else if (id.startsWith('exit-')) {
        actionType = 'exit';
      } else if (id.startsWith('alert-')) {
        actionType = 'alert';
      }
    }
    
    // Make sure positions is always an array for entry nodes
    let positions = Array.isArray(rawData.positions) ? rawData.positions : [];
    
    // For entry nodes, create a default position if none exists
    if (actionType === 'entry' && positions.length === 0) {
      const positionId = `pos-${Date.now().toString().slice(-6)}`;
      const defaultPosition = {
        id: positionId,
        vpi: `${id}-pos1`,
        vpt: '',
        priority: 1,
        positionType: 'buy',
        orderType: 'market',
        lots: 1,
        productType: 'intraday'
      };
      positions = [defaultPosition];
    }
    
    return {
      positions: positions,
      requiresSymbol: rawData.requiresSymbol as boolean | undefined,
      symbol: rawData.symbol as string | undefined,
      updateNodeData: rawData.updateNodeData as ((id: string, data: Partial<ActionNodeData>) => void) | undefined,
      actionType: actionType,
      label: rawData.label as string | undefined,
      instrument: rawData.instrument as string | undefined,
      _lastUpdated: rawData._lastUpdated as number | undefined
    } as ActionNodeData;
  }, [data, id]);
  
  const isSymbolMissing = useMemo(() => {
    // For exit and alert nodes, we don't need a symbol
    if (nodeData.actionType === 'exit' || nodeData.actionType === 'alert') {
      return false;
    }
    
    if (nodeData.positions && nodeData.positions.length > 0) {
      // For positions-based action nodes, we don't show the symbol missing warning
      return false;
    }
    return nodeData.requiresSymbol !== false && !nodeData.symbol && !startNodeSymbol;
  }, [nodeData.requiresSymbol, nodeData.symbol, startNodeSymbol, nodeData.positions, nodeData.actionType]);

  return (
    <div className="nodrag nowheel">
      <div className="drag-handle">
        <ActionNodeContent
          data={nodeData}
          startNodeSymbol={startNodeSymbol}
          isSymbolMissing={isSymbolMissing}
          id={id}
          updateNodeData={nodeData.updateNodeData}
        />
      </div>
    </div>
  );
};

export default ActionNode;
