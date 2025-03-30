
import { useState, useCallback, useRef } from 'react';
import { Node, useNodesState } from '@xyflow/react';
import { deepEqual } from '../../utils/deepEqual';

/**
 * Hook to manage basic node state (nodes, selected node, drag state)
 */
export function useNodeBasicState(initialNodes: Node[]) {
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const isDraggingRef = useRef(false);
  
  // Update selectedNode when nodes change (if it's among them)
  const updateSelectedNodeRef = useCallback((currentNodes: Node[], currentSelectedNode: Node | null) => {
    if (currentSelectedNode) {
      const updatedSelectedNode = currentNodes.find(node => node.id === currentSelectedNode.id);
      if (updatedSelectedNode && 
          !deepEqual(updatedSelectedNode, currentSelectedNode)) {
        return updatedSelectedNode;
      } else if (!updatedSelectedNode) {
        // Clear selected node if it's been removed
        return null;
      }
    }
    return currentSelectedNode;
  }, []);

  return {
    nodes,
    setLocalNodes,
    onNodesChange,
    selectedNode,
    setSelectedNode,
    updateSelectedNodeRef,
    isDraggingRef
  };
}
