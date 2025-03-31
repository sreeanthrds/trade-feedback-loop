
import { useState, useMemo } from 'react';
import { Expression, PositionDataExpression } from '../../../../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';

export function usePositionData(expression: Expression, updateExpression: (expr: Expression) => void) {
  if (expression.type !== 'position_data') {
    throw new Error('Expression is not of type position_data');
  }

  const positionExpr = expression as PositionDataExpression;
  const nodes = useStrategyStore(state => state.nodes);
  
  // State for identifier type selection
  const [useVpiFilter, setUseVpiFilter] = useState<boolean>(
    positionExpr.vpi && positionExpr.vpi !== '_any'
  );
  
  // Extract VPI and VPT values from all nodes
  const positionIdentifiers = useMemo(() => {
    const vpiValues = new Set<string>();
    const vptValues = new Set<string>();
    const vpiToVptMap = new Map<string, string>();
    
    nodes.forEach(node => {
      if (node.data?.positions && Array.isArray(node.data.positions)) {
        node.data.positions.forEach((position: any) => {
          if (position.vpi) {
            vpiValues.add(position.vpi);
            if (position.vpt) {
              vpiToVptMap.set(position.vpi, position.vpt);
            }
          }
          if (position.vpt) vptValues.add(position.vpt);
        });
      }
    });
    
    return {
      vpiOptions: Array.from(vpiValues),
      vptOptions: Array.from(vptValues),
      vpiToVptMap
    };
  }, [nodes]);
  
  // Handle identifier type change
  const handleIdentifierTypeChange = (checked: boolean) => {
    setUseVpiFilter(checked);
    
    // Reset the indicators based on the filter type
    if (checked) {
      // Switching to VPI, reset VPT to _any
      updateExpression({
        ...positionExpr,
        vpt: '_any'
      });
    } else {
      // Switching to VPT, reset VPI to _any
      updateExpression({
        ...positionExpr,
        vpi: '_any'
      });
    }
  };
  
  // Update the VPI
  const updateVPI = (value: string) => {
    if (value === '_any') {
      // If "All Positions" is selected
      updateExpression({
        ...positionExpr,
        vpi: value
      });
    } else {
      // If a specific position is selected, also update its associated VPT
      const associatedVpt = positionIdentifiers.vpiToVptMap.get(value) || '_any';
      updateExpression({
        ...positionExpr,
        vpi: value,
        vpt: associatedVpt
      });
    }
  };

  // Update the VPT
  const updateVPT = (value: string) => {
    updateExpression({
      ...positionExpr,
      vpt: value
    });
  };
  
  // Update the field
  const updateField = (value: string) => {
    updateExpression({
      ...positionExpr,
      field: value
    });
  };

  return {
    positionExpr,
    positionIdentifiers,
    useVpiFilter,
    handleIdentifierTypeChange,
    updateVPI,
    updateVPT,
    updateField
  };
}
