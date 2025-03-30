
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  const prevSymbolRef = useRef<string | undefined>(undefined);
  
  // Find the start node and get its symbol
  useEffect(() => {
    const nodes = getNodes();
    const startNode = nodes.find(node => node.type === 'startNode');
    
    if (startNode && startNode.data) {
      // Ensure the symbol is a string before setting it
      const symbol = startNode.data.symbol;
      // Only update state if the symbol has actually changed
      if (typeof symbol === 'string' && symbol !== prevSymbolRef.current) {
        prevSymbolRef.current = symbol;
        setStartNodeSymbol(symbol);
      } else if (symbol === undefined && prevSymbolRef.current !== undefined) {
        prevSymbolRef.current = undefined;
        setStartNodeSymbol(undefined);
      }
    } else if (startNodeSymbol !== undefined) {
      prevSymbolRef.current = undefined;
      setStartNodeSymbol(undefined);
    }
  }, [getNodes]); // Keep only getNodes in the dependency array
  
  return startNodeSymbol;
}
