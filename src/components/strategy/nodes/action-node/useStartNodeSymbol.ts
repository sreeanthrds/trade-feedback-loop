
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  const prevSymbolRef = useRef<string | undefined>(undefined);
  const isInitialMountRef = useRef(true);
  const isUpdateInProgressRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Find the start node and get its symbol
  useEffect(() => {
    // Clean up function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Separate effect with no dependencies to run only once
  useEffect(() => {
    const checkStartNodeSymbol = () => {
      // Skip if an update is already in progress
      if (isUpdateInProgressRef.current) {
        return;
      }
      
      // Mark update as in progress
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
        // Always clear the in-progress flag after a short delay
        timeoutRef.current = setTimeout(() => {
          isUpdateInProgressRef.current = false;
          
          // Schedule the next check
          timeoutRef.current = setTimeout(checkStartNodeSymbol, 1000);
        }, 100);
      }
    };
    
    // Skip first render to avoid initial cascade of updates
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Schedule the first check after a delay
      timeoutRef.current = setTimeout(checkStartNodeSymbol, 500);
    }
    
    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run on mount
  
  return startNodeSymbol;
}
