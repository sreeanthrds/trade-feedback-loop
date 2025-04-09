
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { StrategyStore } from './types';
import { 
  createSetNodesFunction,
  createSetEdgesFunction
} from './state-setters';
import {
  createAddHistoryItemFunction,
  createUndoFunction,
  createRedoFunction,
  createResetHistoryFunction
} from './history-management';
import { initialNodes } from '../../components/strategy/utils/flowUtils';

/**
 * Strategy store for managing nodes, edges, and history
 */
export const useStrategyStore = create<StrategyStore>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  
  // State setters with optimization
  setNodes: createSetNodesFunction(set, get),
  setEdges: createSetEdgesFunction(set, get),
  
  // History management
  addHistoryItem: createAddHistoryItemFunction(set),
  undo: createUndoFunction(set),
  redo: createRedoFunction(set),
  resetHistory: createResetHistoryFunction(set),
  
  // Reset nodes to initial state in a controlled sequence
  resetNodes: () => {
    // First clear everything
    set({
      nodes: [],
      edges: []
    });
    
    // Reset history
    get().resetHistory();
    
    // Add initial nodes after a slight delay
    setTimeout(() => {
      set({
        nodes: initialNodes
      });
      
      // Add initial state to history after nodes are set
      setTimeout(() => {
        get().addHistoryItem(initialNodes, []);
      }, 100);
    }, 100);
  }
}));
