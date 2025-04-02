
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';

interface UseExitNodeInitializationProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  initializedRef: React.MutableRefObject<boolean>;
  defaultExitNodeData: ExitNodeData;
}

export const useExitNodeInitialization = ({
  node,
  updateNodeData,
  initializedRef,
  defaultExitNodeData
}: UseExitNodeInitializationProps) => {
  // Initialize the exit node data structure if it doesn't exist yet
  useEffect(() => {
    if (initializedRef.current) return;
    
    const nodeData = node.data || {};
    
    // Check if exitNodeData exists and has required structure
    if (!nodeData.exitNodeData) {
      console.log('Initializing exit node data for:', node.id);
      
      // Create default structure for the exit node
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: {
          ...defaultExitNodeData,
          // Add additional initialization if needed
          _initialized: true
        },
        _lastUpdated: Date.now()
      });
      
      initializedRef.current = true;
    } else {
      // Ensure re-entry config exists
      if (!nodeData.exitNodeData.reEntryConfig) {
        updateNodeData(node.id, {
          ...nodeData,
          exitNodeData: {
            ...nodeData.exitNodeData,
            reEntryConfig: defaultExitNodeData.reEntryConfig
          },
          _lastUpdated: Date.now()
        });
      }
      
      initializedRef.current = true;
    }
  }, [node, updateNodeData, initializedRef, defaultExitNodeData]);
  
  return null;
};
