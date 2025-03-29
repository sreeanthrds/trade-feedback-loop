
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
  const intervalRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Get the start node to access its instrument with reduced polling frequency
  useEffect(() => {
    const fetchStartNodeData = () => {
      // Skip if already in progress
      if (updateInProgressRef.current) return;
      
      updateInProgressRef.current = true;
      
      try {
        const nodes = getNodes();
        const startNode = nodes.find(node => node.type === 'startNode');
        
        if (startNode && startNode.data) {
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
              nodeUpdateMadeRef.current = false;
            }, 300);
          }
          
          // Update the previous instrument type reference
          previousInstrumentTypeRef.current = data.tradingInstrument?.type;
          
          // Update options trading state - only update state if it actually changed
          if (hasOptionTrading !== optionsEnabled) {
            setHasOptionTrading(optionsEnabled || false);
          }
          
          // Check if the action node has an instrument, but start node doesn't
          const newSymbolMissingState = Boolean(initialInstrument && !data.symbol);
          if (isSymbolMissing !== newSymbolMissingState) {
            setIsSymbolMissing(newSymbolMissingState);
          }
          
          // Get and set the instrument from the start node only if it changed
          if (data.symbol !== previousSymbolRef.current) {
            previousSymbolRef.current = data.symbol;
            setStartNodeSymbol(data.symbol);
            
            // Also update the node data if the symbol changed
            if (data.symbol && !nodeUpdateMadeRef.current) {
              updateNodeData(nodeId, { instrument: data.symbol });
              nodeUpdateMadeRef.current = true;
              setTimeout(() => {
                nodeUpdateMadeRef.current = false;
              }, 300);
            }
          }
        }
      } finally {
        // Always reset the in-progress flag
        updateInProgressRef.current = false;
      }
    };
    
    // Run once immediately
    fetchStartNodeData();
    
    // Then set up interval, but only if it doesn't already exist
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(fetchStartNodeData, 2000);
    }
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array because we want to run this setup only once
  
  return { startNodeSymbol, hasOptionTrading, isSymbolMissing };
};
