import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface StrategyStore {
  nodes: Node[];
  edges: Edge[];
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addHistoryItem: (nodes: Node[], edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

export const useStrategyStore = create<StrategyStore>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  setNodes: (nodes) => {
    // Skip invalid nodes
    if (!nodes || !Array.isArray(nodes)) {
      console.warn('Invalid nodes provided to setNodes:', nodes);
      return;
    }
    
    // For stability, only update if there's a meaningful change
    const currentNodes = get().nodes;
    
    // Simple length check as first line of defense
    if (currentNodes.length !== nodes.length) {
      set({ nodes });
      return;
    }
    
    // Quick map for node lookup by id
    const currentNodesMap = new Map(currentNodes.map(node => [node.id, node]));
    const incomingNodesMap = new Map(nodes.map(node => [node.id, node]));
    
    // Check if node IDs have changed
    if (!haveSameNodeIds(currentNodes, nodes)) {
      set({ nodes });
      return;
    }
    
    // Check for meaningful position or selection changes
    for (const node of nodes) {
      const currentNode = currentNodesMap.get(node.id);
      if (!currentNode) continue;
      
      // Check selection state
      if (node.selected !== currentNode.selected) {
        set({ nodes });
        return;
      }
      
      // Check position for nodes that have positions
      if (hasPositionChangedSignificantly(currentNode, node)) {
        set({ nodes });
        return;
      }
      
      // Check data changes (simplified deep comparison)
      if (hasNodeDataChanged(currentNode, node)) {
        set({ nodes });
        return;
      }
    }
    
    // If we get here, no meaningful changes were detected
    // console.log('Skipping node update - no meaningful changes');
  },
  
  setEdges: (edges) => {
    // Skip invalid edges
    if (!edges || !Array.isArray(edges)) {
      console.warn('Invalid edges provided to setEdges:', edges);
      return;
    }
    
    // Only update if there's a meaningful change
    const currentEdges = get().edges;
    
    // Length check first
    if (currentEdges.length !== edges.length) {
      set({ edges });
      return;
    }
    
    // Check if edge IDs have changed
    if (!haveSameEdgeIds(currentEdges, edges)) {
      set({ edges });
      return;
    }
    
    // Check for meaningful changes in edge properties
    if (hasEdgeChanged(currentEdges, edges)) {
      set({ edges });
    }
  },
  
  addHistoryItem: (nodes, edges) => set((state) => {
    // Skip if the history is empty and we're adding empty content
    if (state.history.length === 0 && nodes.length === 0 && edges.length === 0) {
      return state;
    }
    
    // Skip if this item is identical to the current history item
    if (state.historyIndex >= 0 && state.history.length > 0) {
      const currentItem = state.history[state.historyIndex];
      
      // Compare node and edge counts first
      if (currentItem.nodes.length === nodes.length && 
          currentItem.edges.length === edges.length) {
        
        // Do a simpler comparison to avoid excessive computation
        const currentNodeIds = currentItem.nodes.map(n => n.id).sort().join('|');
        const newNodeIds = nodes.map(n => n.id).sort().join('|');
        
        const currentEdgeIds = currentItem.edges.map(e => e.id).sort().join('|');
        const newEdgeIds = edges.map(e => e.id).sort().join('|');
        
        if (currentNodeIds === newNodeIds && currentEdgeIds === newEdgeIds) {
          return state; // Skip adding identical history item
        }
      }
    }
    
    // Create new history by truncating at current index
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    
    // Create deep copies to avoid reference issues
    newHistory.push({ 
      nodes: JSON.parse(JSON.stringify(nodes)), 
      edges: JSON.parse(JSON.stringify(edges)) 
    });
    
    // Limit history size to prevent memory issues (keep 30 items max)
    const limitedHistory = newHistory.length > 30 
      ? newHistory.slice(newHistory.length - 30) 
      : newHistory;
    
    return {
      history: limitedHistory,
      historyIndex: limitedHistory.length - 1,
    };
  }),
  
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1];
      return {
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: state.historyIndex - 1,
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      return {
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: state.historyIndex + 1,
      };
    }
    return state;
  }),
  
  resetHistory: () => set({
    history: [],
    historyIndex: -1,
  }),
}));

// Helper functions for change detection
function haveSameNodeIds(oldNodes: Node[], newNodes: Node[]): boolean {
  if (oldNodes.length !== newNodes.length) return false;
  
  const oldIds = new Set(oldNodes.map(n => n.id));
  const newIds = new Set(newNodes.map(n => n.id));
  
  if (oldIds.size !== newIds.size) return false;
  
  for (const id of oldIds) {
    if (!newIds.has(id)) return false;
  }
  
  return true;
}

function haveSameEdgeIds(oldEdges: Edge[], newEdges: Edge[]): boolean {
  if (oldEdges.length !== newEdges.length) return false;
  
  const oldIds = new Set(oldEdges.map(e => e.id));
  const newIds = new Set(newEdges.map(e => e.id));
  
  if (oldIds.size !== newIds.size) return false;
  
  for (const id of oldIds) {
    if (!newIds.has(id)) return false;
  }
  
  return true;
}

function hasPositionChangedSignificantly(oldNode: Node, newNode: Node): boolean {
  // Skip nodes without position data
  if (!oldNode.position || !newNode.position) return false;
  
  // Check if position changed by more than 1px (to avoid floating point issues)
  const xDiff = Math.abs((oldNode.position.x || 0) - (newNode.position.x || 0));
  const yDiff = Math.abs((oldNode.position.y || 0) - (newNode.position.y || 0));
  
  return xDiff > 1 || yDiff > 1 || 
         oldNode.dragging !== newNode.dragging;
}

function hasNodeDataChanged(oldNode: Node, newNode: Node): boolean {
  // Skip if no data on either node
  if (!oldNode.data && !newNode.data) return false;
  
  // If one has data and the other doesn't
  if ((!oldNode.data && newNode.data) || (oldNode.data && !newNode.data)) return true;
  
  // Quick _lastUpdated timestamp check (used by our system to mark explicit updates)
  if (oldNode.data._lastUpdated !== newNode.data._lastUpdated) return true;
  
  // Check only critical data fields that affect rendering
  // This is intentionally simplified to avoid deep comparison performance issues
  const criticalFields = ['label', 'actionType', 'positions', 'symbol'];
  
  for (const field of criticalFields) {
    if (JSON.stringify(oldNode.data[field]) !== JSON.stringify(newNode.data[field])) {
      return true;
    }
  }
  
  return false;
}

function hasEdgeChanged(oldEdges: Edge[], newEdges: Edge[]): boolean {
  // Map for quick lookups by id
  const oldEdgesMap = new Map(oldEdges.map(edge => [edge.id, edge]));
  
  // Check for any edge changes
  return newEdges.some(newEdge => {
    const oldEdge = oldEdgesMap.get(newEdge.id);
    if (!oldEdge) return true; // Edge didn't exist before
    
    return oldEdge.source !== newEdge.source || 
           oldEdge.target !== newEdge.target ||
           oldEdge.selected !== newEdge.selected;
  });
}
