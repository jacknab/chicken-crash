import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './config';

class GameSocket {
  private static instance: GameSocket;
  private socket: Socket;

  private constructor() {
    this.socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to game server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    this.socket.on('connect_error', () => {
      console.warn('Failed to connect to game server - running in offline mode');
    });
    
    // Attempt to connect
    this.socket.connect();
  }

  public static getInstance(): GameSocket {
    if (!GameSocket.instance) {
      GameSocket.instance = new GameSocket();
    }
    return GameSocket.instance;
  }

  public startGame(userId: string, betAmount: number, difficulty: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('start_game', { userId, betAmount, difficulty });
      this.socket.once('game_started', resolve);
      this.socket.once('error', reject);
    });
  }

  public updateGame(sessionId: string, laneIndex: number, multiplier: number) {
    return new Promise((resolve) => {
      this.socket.emit('update_game', { sessionId, laneIndex, multiplier });
      this.socket.once('game_updated', resolve);
    });
  }

  public cashOut(sessionId: string) {
    return new Promise((resolve) => {
      this.socket.emit('cash_out', { sessionId });
      this.socket.once('cashed_out', resolve);
    });
  }

  public crash(sessionId: string) {
    return new Promise((resolve) => {
      this.socket.emit('crash', { sessionId });
      this.socket.once('crashed', resolve);
    });
  }
}

export const gameSocket = GameSocket.getInstance();
