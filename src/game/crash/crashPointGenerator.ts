import { GameState } from '../types';

export function generateCrashPoint(): number | null {
  // Generate random number between 2 and 20
  const laneNumber = Math.floor(Math.random() * 19) + 2;
  
  // Return null for odd numbers (no crash point)
  // Return the lane number for even numbers (crash point)
  return laneNumber % 2 === 0 ? laneNumber : null;
}

export function isCrashLane(state: GameState, laneIndex: number): boolean {
  // Check if the target lane is the crash point
  return laneIndex === state.crashPoint;
}
