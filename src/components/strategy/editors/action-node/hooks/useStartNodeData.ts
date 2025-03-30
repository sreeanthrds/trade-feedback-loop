
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
  const pollTimeoutRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Use a single effect for start node data polling with better control flow
  useEffect(() => {
    // One-time fetch function
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
            }, 500);
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
              }, 500);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching start node data:', error);
      } finally {
        // Reset the in-progress flag with a short delay
        setTimeout(() => {
          updateInProgressRef.current = false;
        }, 50);
      }
    };
    
    // Run once immediately
    fetchStartNodeData();
    
    // Use timeout instead of interval for better control
    const schedulePoll = () => {
      pollTimeoutRef.current = window.setTimeout(() => {
        fetchStartNodeData();
        // Only schedule next poll if component is still mounted
        schedulePoll();
      }, 3000); // Reduced polling frequency to 3 seconds
    };
    
    // Start polling
    schedulePoll();
    
    // Clean up
    return () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run setup once
  
  return { startNodeSymbol, hasOptionTrading, isSymbolMissing };
};
