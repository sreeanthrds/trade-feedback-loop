
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

export const useStrategyStore = create<StrategyStore>((set) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addHistoryItem: (nodes, edges) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
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
