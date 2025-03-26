
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
          
          // Update options trading state
          if (hasOptionTrading !== optionsEnabled) {
            setHasOptionTrading(optionsEnabled || false);
          }
          
          // Get and set the instrument from the start node only if it changed
          if (data.symbol !== previousSymbolRef.current) {
            setStartNodeSymbol(data.symbol);
            previousSymbolRef.current = data.symbol;
            
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

    // Initial fetch
    fetchStartNodeData();

    // Set up a less frequent polling interval (once every 2 seconds)
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(fetchStartNodeData, 2000);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);  // Empty dependency array to run only once on mount
  
  return { startNodeSymbol, hasOptionTrading };
};
