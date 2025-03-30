
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  const prevSymbolRef = useRef<string | undefined>(undefined);
  const isInitialMountRef = useRef(true);
  const isUpdateInProgressRef = useRef(false);
  
  // Find the start node and get its symbol
  useEffect(() => {
    // Skip this effect on the very first render and if update is in progress
    if (isInitialMountRef.current || isUpdateInProgressRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    // Prevent re-entry during update
    isUpdateInProgressRef.current = true;
    
    try {
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
      } else if (startNodeSymbol !== undefined && prevSymbolRef.current !== undefined) {
        prevSymbolRef.current = undefined;
        setStartNodeSymbol(undefined);
      }
    } finally {
      // Always clear the in-progress flag
      isUpdateInProgressRef.current = false;
    }
  }, [getNodes]); // Remove startNodeSymbol from the dependency array
  
  return startNodeSymbol;
}
