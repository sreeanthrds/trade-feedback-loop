
import { Node, Edge } from '@xyflow/react';

export interface StrategyStore {
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

export type SetState = (partial: Partial<StrategyStore> | ((state: StrategyStore) => Partial<StrategyStore>)) => void;
export type GetState = () => StrategyStore;
