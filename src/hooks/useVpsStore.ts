
import { create } from 'zustand';
import { Position } from '@/components/strategy/types/position-types';

interface VpsStoreState {
  isOpen: boolean;
  positions: Position[];
  toggle: () => void;
  setPositions: (positions: Position[]) => void;
  addPosition: (position: Position) => void;
  updatePosition: (position: Position) => void;
  removePosition: (positionId: string) => void;
}

export const useVpsStore = create<VpsStoreState>((set) => ({
  isOpen: false,
  positions: [],
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setPositions: (positions) => set({ positions }),
  addPosition: (position) => set((state) => ({ 
    positions: [...state.positions, position] 
  })),
  updatePosition: (updatedPosition) => set((state) => ({
    positions: state.positions.map((pos) => 
      pos.id === updatedPosition.id ? { ...pos, ...updatedPosition } : pos
    )
  })),
  removePosition: (positionId) => set((state) => ({
    positions: state.positions.filter((pos) => pos.id !== positionId)
  }))
}));
