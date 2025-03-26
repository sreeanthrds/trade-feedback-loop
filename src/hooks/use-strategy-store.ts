
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { persist } from 'zustand/middleware';

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

// Use persist middleware for better performance with localStorage
export const useStrategyStore = create<StrategyStore>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      history: [],
      historyIndex: -1,
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addHistoryItem: (nodes, edges) => set((state) => {
        // Optimize by only adding history if it's different from the last item
        const lastItem = state.history[state.historyIndex];
        const nodesJson = JSON.stringify(nodes);
        const edgesJson = JSON.stringify(edges);
        
        if (
          lastItem && 
          JSON.stringify(lastItem.nodes) === nodesJson && 
          JSON.stringify(lastItem.edges) === edgesJson
        ) {
          return state; // No change, don't add to history
        }
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        // Store deep copies to avoid reference issues
        newHistory.push({ 
          nodes: JSON.parse(nodesJson), 
          edges: JSON.parse(edgesJson) 
        });
        
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
    }),
    {
      name: 'strategy-store', // name for the localStorage key
      partialize: (state) => ({ 
        nodes: state.nodes, 
        edges: state.edges 
      }), // only persist these fields
    }
  )
);
