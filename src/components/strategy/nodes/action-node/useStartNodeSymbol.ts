
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useStartNodeSymbol() {
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(undefined);
  const { getNodes } = useReactFlow();
  const prevSymbolRef = useRef<string | undefined>(undefined);
  const isComponentMountedRef = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Mark component as mounted
    isComponentMountedRef.current = true;
    
    // Function to check for start node symbol
    const checkStartNodeSymbol = () => {
      if (!isComponentMountedRef.current) return;
      
      try {
        const nodes = getNodes();
        const startNode = nodes.find(node => node.type === 'startNode');
        
        if (startNode && startNode.data) {
          // Ensure the symbol is a string before setting it
          const symbol = startNode.data.symbol;
          
          // Only update state if the symbol has actually changed
          if (typeof symbol === 'string' && symbol !== prevSymbolRef.current) {
            prevSymbolRef.current = symbol;
            if (isComponentMountedRef.current) {
              setStartNodeSymbol(symbol);
            }
          } else if (symbol === undefined && prevSymbolRef.current !== undefined) {
            prevSymbolRef.current = undefined;
            if (isComponentMountedRef.current) {
              setStartNodeSymbol(undefined);
            }
          }
        } else if (startNodeSymbol !== undefined && prevSymbolRef.current !== undefined) {
          prevSymbolRef.current = undefined;
          if (isComponentMountedRef.current) {
            setStartNodeSymbol(undefined);
          }
        }
      } catch (error) {
        console.error('Error checking start node symbol:', error);
      }
    };
    
    // Set up polling interval instead of an empty dependency effect
    pollingIntervalRef.current = setInterval(checkStartNodeSymbol, 1000);
    
    // Run initial check
    checkStartNodeSymbol();
    
    // Clean up on unmount
    return () => {
      isComponentMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount
  
  return startNodeSymbol;
}
