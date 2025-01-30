import { create } from 'zustand';

interface GameStateStore {
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;
  reset: () => void;
}

export const useGameState = create<GameStateStore>((set) => ({
  isPlaying: false,
  setIsPlaying: (state) => set({ isPlaying: state }),
  reset: () => set({ isPlaying: false }),
}));
