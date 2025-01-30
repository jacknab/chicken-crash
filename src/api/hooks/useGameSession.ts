import { useState, useEffect } from 'react';
import { gameSocket } from '../socket';
import { GameSession } from '../types';
import { API_URL } from '../config';

const OFFLINE_DEFAULT_BALANCE = 1000;

export function useGameSession(userId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const res = await fetch(`${API_URL}/api/balance/${userId}`);
        if (!res.ok) throw new Error('Server error');
        const data = await res.json();
        setBalance(data.balance);
        setIsOffline(false);
      } catch (err) {
        // Fallback to offline mode
        console.info('Running in offline mode with demo balance');
        setBalance(OFFLINE_DEFAULT_BALANCE);
        setIsOffline(true);
      }
    };

    loadBalance();
  }, [userId]);

  const startGame = async (betAmount: number, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    try {
      if (isOffline) {
        // Simulate offline game session
        const offlineSession = {
          id: crypto.randomUUID(),
          userId,
          betAmount,
          difficulty,
          startTime: Date.now(),
          status: 'active',
          currentLane: 0,
          currentMultiplier: 1.0
        };
        setSession(offlineSession);
        setBalance(prev => prev - betAmount);
        return offlineSession;
      }

      const response = await gameSocket.startGame(userId, betAmount, difficulty);
      setSession(response.session);
      setBalance(response.balance);
      return response.session;
    } catch (error) {
      console.info('Starting game in offline mode');
      setIsOffline(true);
      return null;
    }
  };

  const updateGame = async (laneIndex: number, multiplier: number) => {
    if (!session) return null;
    try {
      const response = await gameSocket.updateGame(session.id, laneIndex, multiplier);
      setSession(response);
      return response;
    } catch (error) {
      console.error('Failed to update game:', error);
      return null;
    }
  };

  const cashOut = async () => {
    if (!session) return null;
    try {
      const response = await gameSocket.cashOut(session.id);
      setSession(null);
      setBalance(response.balance);
      return response.session;
    } catch (error) {
      console.error('Failed to cash out:', error);
      return null;
    }
  };

  const crash = async () => {
    if (!session) return null;
    try {
      const response = await gameSocket.crash(session.id);
      setSession(null);
      setBalance(response.balance);
      return response.session;
    } catch (error) {
      console.error('Failed to crash game:', error);
      return null;
    }
  };

  return {
    session,
    balance,
    startGame,
    updateGame,
    cashOut,
    crash
  };
}
