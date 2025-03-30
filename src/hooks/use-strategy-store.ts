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
    
    // For stability, don't do deep comparison here, just set the state
    set({ nodes });
  },
  setEdges: (edges) => {
    // Skip invalid edges
    if (!edges || !Array.isArray(edges)) {
      console.warn('Invalid edges provided to setEdges:', edges);
      return;
    }
    
    // For stability, don't do deep comparison here, just set the state
    set({ edges });
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
