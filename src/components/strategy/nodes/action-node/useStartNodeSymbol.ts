
import { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  
  // Find the start node and get its symbol
  useEffect(() => {
    const nodes = getNodes();
    const startNode = nodes.find(node => node.type === 'startNode');
    
    if (startNode && startNode.data) {
      // Ensure the symbol is a string before setting it
      const symbol = startNode.data.symbol;
      if (typeof symbol === 'string') {
        setStartNodeSymbol(symbol);
      } else {
        setStartNodeSymbol(undefined);
      }
    } else {
      setStartNodeSymbol(undefined);
    }
  }, [getNodes]);
  
  return startNodeSymbol;
}
