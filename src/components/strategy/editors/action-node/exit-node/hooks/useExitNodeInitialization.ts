
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
  // Initialize node data only once if needed
  useEffect(() => {
    const nodeData = node.data || {};
    if (!initializedRef.current && !nodeData.exitNodeData) {
      initializedRef.current = true;
      
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: defaultExitNodeData
      });
    }
  }, [node.id, initializedRef, updateNodeData]);
};
