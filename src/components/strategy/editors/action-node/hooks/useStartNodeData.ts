
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
  
  // Use refs to track state without causing re-renders
  const previousSymbolRef = useRef<string | undefined>(startNodeSymbol);
  const previousInstrumentTypeRef = useRef<string | undefined>(undefined);
  const nodeUpdateMadeRef = useRef(false);
  const isComponentMountedRef = useRef(true);
  
  // Clean up on unmount
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);
  
  // Use a single effect for start node data with proper cleanup
  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | null = null;
    
    // One-time fetch function with optimized logic
    const fetchStartNodeData = () => {
      if (!isMounted) return;
      
      try {
        const nodes = getNodes();
        const startNode = nodes.find(node => node.type === 'startNode');
        
        if (startNode?.data) {
          const data = startNode.data as StartNodeData;
          
          // Check for options trading
          const optionsEnabled = data.tradingInstrument?.type === 'options';
          
          // Only make updates when the state actually changes
          if (hasOptionTrading !== optionsEnabled) {
            setHasOptionTrading(optionsEnabled || false);
          }
          
          // Check symbol missing state
          const newSymbolMissingState = Boolean(initialInstrument && !data.symbol);
          if (isSymbolMissing !== newSymbolMissingState) {
            setIsSymbolMissing(newSymbolMissingState);
          }
          
          // Only update symbol if it changed
          if (data.symbol !== previousSymbolRef.current) {
            previousSymbolRef.current = data.symbol;
            
            if (isMounted) {
              setStartNodeSymbol(data.symbol);
              
              // Update node data only when there's a meaningful change
              if (data.symbol && !nodeUpdateMadeRef.current) {
                updateNodeData(nodeId, { instrument: data.symbol });
                nodeUpdateMadeRef.current = true;
                
                // Reset update flag after a short delay
                setTimeout(() => {
                  nodeUpdateMadeRef.current = false;
                }, 500);
              }
            }
          }
          
          // Handle instrument type change
          if (previousInstrumentTypeRef.current === 'options' && 
              data.tradingInstrument?.type !== 'options' && 
              !nodeUpdateMadeRef.current) {
            
            updateNodeData(nodeId, { optionDetails: undefined });
            nodeUpdateMadeRef.current = true;
            
            setTimeout(() => {
              nodeUpdateMadeRef.current = false;
            }, 500);
          }
          
          // Update instrument type reference
          previousInstrumentTypeRef.current = data.tradingInstrument?.type;
        }
      } catch (error) {
        console.error('Error fetching start node data:', error);
      }
    };
    
    // Run once immediately
    fetchStartNodeData();
    
    // Set up polling with longer interval (5 seconds)
    const pollInterval = 5000;
    
    // Use recursive timeout instead of interval for better cleanup
    const schedulePoll = () => {
      if (!isMounted) return;
      
      timeoutId = window.setTimeout(() => {
        fetchStartNodeData();
        schedulePoll();
      }, pollInterval);
    };
    
    schedulePoll();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [nodeId, updateNodeData, getNodes, initialInstrument, hasOptionTrading, isSymbolMissing]);
  
  return { startNodeSymbol, hasOptionTrading, isSymbolMissing };
};
