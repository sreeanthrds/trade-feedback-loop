
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { deepEqual } from '../../utils/deepEqual';

/**
 * Hook to update the selected node when nodes change
 */
export function useSelectedNodeUpdate(nodes: Node[], selectedNode: Node | null, setSelectedNode: (node: Node | null) => void) {
  // Update selectedNode when nodes change (if it's among them)
  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode && 
          !deepEqual(updatedSelectedNode, selectedNode)) {
        setSelectedNode(updatedSelectedNode);
      } else if (!updatedSelectedNode) {
        // Clear selected node if it's been removed
        setSelectedNode(null);
      }
    }
  }, [nodes, selectedNode, setSelectedNode]);
}
