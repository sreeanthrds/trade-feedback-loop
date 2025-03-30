
import { useCallback, useState, useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useViewportUtils() {
  const [instance, setInstance] = useState(null);
  const hasFitViewRef = useRef(false);
  
  // Safely try to get the React Flow instance
  useEffect(() => {
    try {
      const reactFlowInstance = useReactFlow();
      if (reactFlowInstance) {
        setInstance(reactFlowInstance);
      }
    } catch (error) {
      console.warn('ReactFlow not initialized yet');
    }
  }, []);

  // Custom function to fit view with additional zoom out
  const fitViewWithCustomZoom = useCallback(() => {
    if (!instance || hasFitViewRef.current) return;
    
    try {
      // Mark that we've done the fit view to prevent multiple calls
      hasFitViewRef.current = true;
      
      instance.fitView({
        padding: 0.2,
        includeHiddenNodes: false,
        duration: 800,
        maxZoom: 1.0
      });
      
      // After fitting, zoom out by an additional 15%
      setTimeout(() => {
        if (!instance) return;
        
        const { zoom } = instance.getViewport();
        const newZoom = zoom * 0.85; // 15% more zoomed out
        
        instance.setViewport(
          { 
            x: instance.getViewport().x, 
            y: instance.getViewport().y, 
            zoom: newZoom 
          }, 
          { duration: 200 }
        );
      }, 850);
    } catch (error) {
      console.error('Error in fitViewWithCustomZoom', error);
    }
  }, [instance]);

  return {
    fitViewWithCustomZoom,
    reactFlowInstance: instance
  };
}
