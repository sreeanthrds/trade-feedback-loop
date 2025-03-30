
import { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  
  // Find the start node and get its symbol
  useEffect(() => {
    const nodes = getNodes();
    const startNode = nodes.find(node => node.type === 'startNode');
    if (startNode && startNode.data && startNode.data.symbol) {
      setStartNodeSymbol(startNode.data.symbol);
    } else {
      setStartNodeSymbol(undefined);
    }
  }, [getNodes]);
  
  return startNodeSymbol;
}
