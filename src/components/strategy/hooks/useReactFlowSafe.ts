
import { useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * Hook to safely get the React Flow instance
 * Handles the case where useReactFlow might be called outside of provider
 */
export function useReactFlowSafe() {
  const isReactFlowInitializedRef = useRef(false);
  const [isReactFlowReady, setIsReactFlowReady] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Get React Flow instance safely
  useEffect(() => {
    // Only attempt to get the React Flow instance if not already initialized
    if (isReactFlowInitializedRef.current) return;
    
    try {
      const instance = useReactFlow();
      if (instance) {
        setReactFlowInstance(instance);
        isReactFlowInitializedRef.current = true;
        
        // Use setTimeout to break the render cycle
        setTimeout(() => {
          setIsReactFlowReady(true);
        }, 0);
      }
    } catch (error) {
      // Handle the case where useReactFlow is called outside of provider
      console.warn('ReactFlow provider not ready yet');
    }
  }, []);

  return {
    reactFlowInstance,
    isReactFlowReady,
    isReactFlowInitializedRef
  };
}
