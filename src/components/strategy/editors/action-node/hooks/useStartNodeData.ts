
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { StartNodeData } from '../types';

interface UseStartNodeDataProps {
  nodeId: string;
  updateNodeData: (id: string, data: any) => void;
  initialInstrument?: string;
}

export const useStartNodeData = ({ 
  nodeId, 
  updateNodeData, 
  initialInstrument 
}: UseStartNodeDataProps) => {
  const { getNodes } = useReactFlow();
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(initialInstrument);
  const [hasOptionTrading, setHasOptionTrading] = useState(false);
  const [isSymbolMissing, setIsSymbolMissing] = useState(false);
  
  // Use refs to prevent these values from causing re-renders when they change
  const previousSymbolRef = useRef<string | undefined>(startNodeSymbol);
  const previousInstrumentTypeRef = useRef<string | undefined>(undefined);
  const nodeUpdateMadeRef = useRef(false);
  const updateInProgressRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);
  
  // Set mounted flag on mount
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // Clean up on unmount
    return () => {
      isComponentMountedRef.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Separate effect to create the polling mechanism that only runs once on mount
  useEffect(() => {
    const fetchStartNodeData = () => {
      // Skip if already in progress or component unmounted
      if (updateInProgressRef.current || !isComponentMountedRef.current) return;
      
      updateInProgressRef.current = true;
      
      try {
        const nodes = getNodes();
        const startNode = nodes.find(node => node.type === 'startNode');
        
        if (startNode && startNode.data && isComponentMountedRef.current) {
          const data = startNode.data as StartNodeData;
          
          // Check for options trading
          const optionsEnabled = data.tradingInstrument?.type === 'options';
          
          // If instrument type changed from options to something else, clear option details
          if (previousInstrumentTypeRef.current === 'options' && 
              data.tradingInstrument?.type !== 'options' && 
              !nodeUpdateMadeRef.current) {
            updateNodeData(nodeId, { optionDetails: undefined });
            nodeUpdateMadeRef.current = true;
            setTimeout(() => {
              if (isComponentMountedRef.current) {
                nodeUpdateMadeRef.current = false;
              }
            }, 300);
          }
          
          // Update the previous instrument type reference
          previousInstrumentTypeRef.current = data.tradingInstrument?.type;
          
          // Update options trading state - only update state if it actually changed
          if (hasOptionTrading !== optionsEnabled && isComponentMountedRef.current) {
            setHasOptionTrading(optionsEnabled || false);
          }
          
          // Check if the action node has an instrument, but start node doesn't
          const newSymbolMissingState = Boolean(initialInstrument && !data.symbol);
          if (isSymbolMissing !== newSymbolMissingState && isComponentMountedRef.current) {
            setIsSymbolMissing(newSymbolMissingState);
          }
          
          // Get and set the instrument from the start node only if it changed
          if (data.symbol !== previousSymbolRef.current && isComponentMountedRef.current) {
            previousSymbolRef.current = data.symbol;
            setStartNodeSymbol(data.symbol);
            
            // Also update the node data if the symbol changed
            if (data.symbol && !nodeUpdateMadeRef.current) {
              updateNodeData(nodeId, { instrument: data.symbol });
              nodeUpdateMadeRef.current = true;
              setTimeout(() => {
                if (isComponentMountedRef.current) {
                  nodeUpdateMadeRef.current = false;
                }
              }, 300);
            }
          }
        }
      } finally {
        // Always reset the in-progress flag after a delay
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            updateInProgressRef.current = false;
          }
        }, 200);
      }
    };
    
    // Run once immediately with a small delay to let everything initialize
    const initialTimeoutId = setTimeout(fetchStartNodeData, 100);
    
    // Then set up interval, but only if it doesn't already exist
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(fetchStartNodeData, 2000);
    }
    
    // Clean up function
    return () => {
      clearTimeout(initialTimeoutId);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once on mount
  
  return { startNodeSymbol, hasOptionTrading, isSymbolMissing };
};
