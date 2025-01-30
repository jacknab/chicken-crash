import { GameSession, GameHistory, UserBalance } from './types';

class GameAPI {
  private static instance: GameAPI;
  private sessions: Map<string, GameSession>;
  private history: Map<string, GameHistory[]>;
  private balances: Map<string, UserBalance>;

  private constructor() {
    this.sessions = new Map();
    this.history = new Map();
    this.balances = new Map();
  }

  public static getInstance(): GameAPI {
    if (!GameAPI.instance) {
      GameAPI.instance = new GameAPI();
    }
    return GameAPI.instance;
  }

  // Session Management
  public startGame(userId: string, betAmount: number, difficulty: 'Easy' | 'Medium' | 'Hard'): GameSession {
    const session: GameSession = {
      id: crypto.randomUUID(),
      userId,
      betAmount,
      difficulty,
      startTime: Date.now(),
      status: 'active',
      currentLane: 0,
      currentMultiplier: 1.0
    };

    // Deduct bet amount from balance
    this.updateBalance(userId, -betAmount);
    
    this.sessions.set(session.id, session);
    return session;
  }

  public updateGameState(sessionId: string, laneIndex: number, multiplier: number): GameSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.currentLane = laneIndex;
    session.currentMultiplier = multiplier;
    return session;
  }

  public cashOut(sessionId: string): GameSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status !== 'active') throw new Error('Game already ended');

    const winAmount = session.betAmount * session.currentMultiplier;
    
    // Update session
    session.status = 'cashed_out';
    session.endTime = Date.now();
    session.finalMultiplier = session.currentMultiplier;
    session.finalBalance = winAmount;

    // Add to history
    this.addToHistory(session);
    
    // Update user balance
    this.updateBalance(session.userId, winAmount);

    return session;
  }

  public crashGame(sessionId: string): GameSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status !== 'active') throw new Error('Game already ended');

    session.status = 'crashed';
    session.endTime = Date.now();
    session.finalMultiplier = 0;
    session.finalBalance = 0;

    this.addToHistory(session);
    return session;
  }

  // Balance Management
  public getBalance(userId: string): number {
    return this.balances.get(userId)?.balance || 0;
  }

  private updateBalance(userId: string, amount: number): void {
    const currentBalance = this.balances.get(userId);
    const newBalance = {
      userId,
      balance: (currentBalance?.balance || 0) + amount,
      lastUpdated: Date.now()
    };
    this.balances.set(userId, newBalance);
  }

  // History Management
  public getHistory(userId: string): GameHistory[] {
    return this.history.get(userId) || [];
  }

  private addToHistory(session: GameSession): void {
    const history: GameHistory = {
      id: session.id,
      userId: session.userId,
      betAmount: session.betAmount,
      difficulty: session.difficulty,
      finalMultiplier: session.finalMultiplier || 0,
      profit: (session.finalBalance || 0) - session.betAmount,
      timestamp: Date.now()
    };

    const userHistory = this.history.get(session.userId) || [];
    userHistory.unshift(history);
    this.history.set(session.userId, userHistory);
  }
}

export const gameApi = GameAPI.getInstance();
