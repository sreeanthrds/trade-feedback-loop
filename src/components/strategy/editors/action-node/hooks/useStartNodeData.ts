
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
  
  // Get the start node to access its instrument - with reduced polling frequency
  useEffect(() => {
    const fetchStartNodeData = () => {
      const nodes = getNodes();
      const startNode = nodes.find(node => node.type === 'startNode');
      if (startNode && startNode.data) {
        const data = startNode.data as StartNodeData;
        
        // Check for options trading
        const optionsEnabled = data.tradingInstrument?.type === 'options';
        
        // If instrument type changed from options to something else, we need to clear option details
        if (previousInstrumentTypeRef.current === 'options' && data.tradingInstrument?.type !== 'options') {
          if (!nodeUpdateMadeRef.current) {
            updateNodeData(nodeId, { optionDetails: undefined });
            nodeUpdateMadeRef.current = true;
            setTimeout(() => {
              nodeUpdateMadeRef.current = false;
            }, 100);
          }
        }
        
        // Update the previous instrument type reference
        previousInstrumentTypeRef.current = data.tradingInstrument?.type;
        
        // Update options trading state
        if (hasOptionTrading !== optionsEnabled) {
          setHasOptionTrading(optionsEnabled || false);
        }
        
        // Get and set the instrument from the start node
        if (data.symbol !== previousSymbolRef.current) {
          setStartNodeSymbol(data.symbol);
          previousSymbolRef.current = data.symbol;
          
          // Also update the node data if the symbol changed
          if (data.symbol && !nodeUpdateMadeRef.current) {
            updateNodeData(nodeId, { instrument: data.symbol });
            nodeUpdateMadeRef.current = true;
            setTimeout(() => {
              nodeUpdateMadeRef.current = false;
            }, 100);
          }
        }
      }
    };

    // Initial fetch
    fetchStartNodeData();

    // Set up an interval with reduced frequency (from 100ms to 1000ms for better performance)
    const intervalId = setInterval(fetchStartNodeData, 1000);

    return () => clearInterval(intervalId);
  }, [getNodes, nodeId, updateNodeData, hasOptionTrading]);
  
  return { startNodeSymbol, hasOptionTrading };
};
