
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useViewportUtils() {
  const reactFlowInstance = useReactFlow();

  // Custom function to fit view with additional zoom out
  const fitViewWithCustomZoom = useCallback(() => {
    if (!reactFlowInstance) return;
    
    reactFlowInstance.fitView({
      padding: 0.2,
      includeHiddenNodes: false,
      duration: 800,
      maxZoom: 1.0
    });
    
    // After fitting, zoom out by an additional 15%
    setTimeout(() => {
      const { zoom } = reactFlowInstance.getViewport();
      const newZoom = zoom * 0.85; // 15% more zoomed out
      
      reactFlowInstance.setViewport(
        { 
          x: reactFlowInstance.getViewport().x, 
          y: reactFlowInstance.getViewport().y, 
          zoom: newZoom 
        }, 
        { duration: 200 }
      );
    }, 850);
  }, [reactFlowInstance]);

  return {
    fitViewWithCustomZoom
  };
}
