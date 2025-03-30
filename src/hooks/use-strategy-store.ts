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
    
    // Only update if the nodes actually changed
    const currentNodes = get().nodes;
    
    // First do a simple length comparison
    if (currentNodes.length !== nodes.length) {
      set({ nodes });
      return;
    }
    
    // Then do a more efficient comparison checking IDs and types first
    const currentNodeIds = currentNodes.map(n => `${n.id}-${n.type}`).sort().join('|');
    const newNodeIds = nodes.map(n => `${n.id}-${n.type}`).sort().join('|');
    
    if (currentNodeIds !== newNodeIds) {
      set({ nodes });
      return;
    }
    
    // Finally, for more intensive changes, check data and positions
    let hasChange = false;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const currentNode = currentNodes.find(n => n.id === node.id);
      
      if (!currentNode || 
          JSON.stringify(node.data) !== JSON.stringify(currentNode.data) ||
          node.position.x !== currentNode.position.x ||
          node.position.y !== currentNode.position.y) {
        hasChange = true;
        break;
      }
    }
    
    if (hasChange) {
      set({ nodes });
    }
  },
  setEdges: (edges) => {
    // Skip invalid edges
    if (!edges || !Array.isArray(edges)) {
      console.warn('Invalid edges provided to setEdges:', edges);
      return;
    }
    
    // Only update if the edges actually changed
    const currentEdges = get().edges;
    
    // First check length for quick comparison
    if (currentEdges.length !== edges.length) {
      set({ edges });
      return;
    }
    
    // Then do a more efficient comparison of edge properties
    const currentEdgeIds = currentEdges.map(e => `${e.id}-${e.source}-${e.target}`).sort().join('|');
    const newEdgeIds = edges.map(e => `${e.id}-${e.source}-${e.target}`).sort().join('|');
    
    if (currentEdgeIds !== newEdgeIds) {
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
        
        // Do a deeper comparison of IDs
        const currentNodeIds = currentItem.nodes.map(n => n.id).sort().join('|');
        const newNodeIds = nodes.map(n => n.id).sort().join('|');
        
        const currentEdgeIds = currentItem.edges.map(e => e.id).sort().join('|');
        const newEdgeIds = edges.map(e => e.id).sort().join('|');
        
        if (currentNodeIds === newNodeIds && currentEdgeIds === newEdgeIds) {
          // Very similar, do one final check on positions
          let positionChanged = false;
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const currentNode = currentItem.nodes.find(n => n.id === node.id);
            
            if (!currentNode || 
                node.position.x !== currentNode.position.x ||
                node.position.y !== currentNode.position.y) {
              positionChanged = true;
              break;
            }
          }
          
          if (!positionChanged) {
            return state; // Skip adding identical history item
          }
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
    
    // Limit history size to prevent memory issues (keep 50 items max)
    const limitedHistory = newHistory.length > 50 
      ? newHistory.slice(newHistory.length - 50) 
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
