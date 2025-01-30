export interface GameSession {
  id: string;
  userId: string;
  betAmount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startTime: number;
  endTime?: number;
  finalMultiplier?: number;
  finalBalance?: number;
  status: 'active' | 'crashed' | 'cashed_out';
  crashPoint?: number;
  currentLane: number;
  currentMultiplier: number;
}

export interface GameHistory {
  id: string;
  userId: string;
  betAmount: number;
  difficulty: string;
  finalMultiplier: number;
  profit: number;
  timestamp: number;
}

export interface UserBalance {
  userId: string;
  balance: number;
  lastUpdated: number;
}
