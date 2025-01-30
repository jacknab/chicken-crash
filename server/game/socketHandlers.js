import { GameState } from './gameState.js';
import { balances, history } from '../routes/api.js';
import { VehicleManager } from './vehicleManager.js';
import { CrashPointManager } from './crashPointManager.js';

const vehicleManager = new VehicleManager();
const crashPointManager = new CrashPointManager();

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Start game
    socket.on('start_game', ({ userId, betAmount, difficulty }) => {
      const session = {
        id: Math.random().toString(36).substring(7),
        userId,
        betAmount,
        difficulty,
        startTime: Date.now(),
        status: 'active',
        currentLane: 0,
        currentMultiplier: 1.0
      };

      // Initialize vehicles and crash point
      vehicleManager.initializeVehicles(session.id);
      const crashPoint = crashPointManager.generateCrashPoint(session.id);
      if (crashPoint) {
        session.crashPoint = crashPoint;
      }

      // Deduct bet amount
      const userBalance = balances.get(userId) || { balance: 1000 };
      if (userBalance.balance >= betAmount) {
        userBalance.balance -= betAmount;
        balances.set(userId, userBalance);
        GameState.createSession(session);
        
        socket.emit('game_started', { session, balance: userBalance.balance });
      } else {
        socket.emit('error', { message: 'Insufficient balance' });
      }
    });

    // Update game state
    socket.on('update_game', ({ sessionId, laneIndex, multiplier }) => {
      const session = GameState.getSession(sessionId);
      if (session && session.status === 'active') {
        session.currentLane = laneIndex;
        session.currentMultiplier = multiplier;
        
        // Update vehicles
        const vehicles = vehicleManager.updateVehicles(session.id, session.difficulty);
        
        socket.emit('game_updated', {
          ...session,
          vehicles
        });
      }
    });

    // Cash out
    socket.on('cash_out', ({ sessionId }) => {
      const session = GameState.getSession(sessionId);
      if (session && session.status === 'active') {
        const winAmount = session.betAmount * session.currentMultiplier;
        
        // Update session
        session.status = 'cashed_out';
        session.endTime = Date.now();
        session.finalMultiplier = session.currentMultiplier;
        session.finalBalance = winAmount;
        
        // Clean up game resources
        vehicleManager.clearSession(session.id);
        crashPointManager.clearSession(session.id);

        // Update balance
        const userBalance = balances.get(session.userId) || { balance: 1000 };
        userBalance.balance += winAmount;
        balances.set(session.userId, userBalance);

        // Add to history
        const userHistory = history.get(session.userId) || [];
        userHistory.unshift({
          id: session.id,
          betAmount: session.betAmount,
          multiplier: session.finalMultiplier,
          winAmount,
          timestamp: Date.now()
        });
        history.set(session.userId, userHistory);

        socket.emit('cashed_out', {
          session,
          balance: userBalance.balance,
          history: userHistory
        });
      }
    });

    // Game crash
    socket.on('crash', ({ sessionId }) => {
      const session = GameState.getSession(sessionId);
      if (session && session.status === 'active') {
        session.status = 'crashed';
        session.endTime = Date.now();
        session.finalMultiplier = 0;
        session.finalBalance = 0;
        
        // Clean up game resources
        vehicleManager.clearSession(session.id);
        crashPointManager.clearSession(session.id);

        // Add to history
        const userHistory = history.get(session.userId) || [];
        userHistory.unshift({
          id: session.id,
          betAmount: session.betAmount,
          multiplier: 0,
          winAmount: 0,
          timestamp: Date.now()
        });
        history.set(session.userId, userHistory);

        socket.emit('crashed', {
          session,
          balance: balances.get(session.userId).balance,
          history: userHistory
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
