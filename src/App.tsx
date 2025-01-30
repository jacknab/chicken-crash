import React, { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';
import { GameState, Controls } from './game/types';
import { initializeGame, updatePlayerPosition, updateVehicles, checkCollisions } from './game/gameLogic';
import { drawGame } from './game/renderer';
import { loadAssets } from './game/assets';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './game/constants';
import { GameControls } from './components/GameControls';
import { useGameSession } from './api/hooks/useGameSession';
import { useGameState } from './game/controllers/gameStateController';
import { WinNotification } from './components/WinNotification';

// For demo purposes, we'll use a fixed user ID
const DEMO_USER_ID = 'demo-user';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { session, balance, startGame, updateGame, cashOut, crash } = useGameSession(DEMO_USER_ID);
  const [gameState, setGameState] = useState<GameState>(() => {
    return initializeGame();
  });
  const [showFloatingWin, setShowFloatingWin] = useState(false);
  const [devBalance, setDevBalance] = useState<string>('');
  const [multiplier, setMultiplier] = useState(1);
  const [showWinNotification, setShowWinNotification] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const { setIsPlaying } = useGameState();
  const [isGameOverDelayed, setIsGameOverDelayed] = useState(false);
  const gameOverTimeout = useRef<number | null>(null);
  const oopsTimeout = useRef<number | null>(null);
  const [showOops, setShowOops] = useState(false);
  
  const handleDevBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDevBalance(value);
  };

  const controls = useRef<Controls>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const handleBetAmountChange = (amount: number) => {
    setGameState(prev => ({ ...prev, betAmount: amount }));
  };

  const handleDifficultyChange = (difficulty: GameState['difficulty']) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const handleStartGame = useCallback(() => {
    if (!balance || balance < gameState.betAmount) return;
    
    // Reset multiplier but keep existing vehicles
    const existingVehicles = gameState.vehicles;
    setMultiplier(1);
    setGameState(prev => ({
      ...initializeGame(),
      betAmount: prev.betAmount,
      difficulty: prev.difficulty,
      vehicles: existingVehicles, // Preserve existing vehicles
      controlState: 'playing' // Set control state to playing
    }));
    
    // Start new game session
    startGame(gameState.betAmount, gameState.difficulty);
    
    // Update game state
    setIsPlaying(true);
    setIsGameOverDelayed(false);
    setShowOops(false);
  }, [balance, gameState.betAmount, gameState.difficulty, startGame]);
  
  const handleCashout = () => {
    const { isPlaying } = useGameState.getState();
    if (!isPlaying) return;
    
    // Calculate win amount before resetting
    const currentWin = gameState.balance;

    // Reset game state and multiplier
    useGameState.getState().reset();
    setMultiplier(1);

    // Reset game state completely
    setGameState(prev => ({
      ...initializeGame(),
      betAmount: prev.betAmount,
      difficulty: prev.difficulty,
      balance: currentWin,
      multiplier: prev.multiplier,
      controlState: 'betting' // Set control state to betting
    }));

    setWinAmount(currentWin);

    // Show win notification
    setShowFloatingWin(true);

    // Hide win notification after 5 seconds
    setTimeout(() => {
      setShowFloatingWin(false);
      setGameState(prev => ({
        ...prev,
        multiplier: 1
      }));
    }, 3000);

    cashOut();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { isPlaying } = useGameState.getState();
    if (!isPlaying || gameState.gameOver || gameState.isMoving) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Adjust for camera offset
    const adjustedX = x - (gameState.cameraOffset || 0);

    // Find the next manhole
    const nextManhole = gameState.manholes.find(manhole =>
      manhole.lane === gameState.lanes[gameState.currentLaneIndex + 1]?.startX &&
      !manhole.isCollected
    );

    if (nextManhole && isClickInsideManhole(adjustedX, y, nextManhole)) {
      // Start automated movement
      setGameState(prev => ({
        ...prev,
        autoMoving: true,
        isMoving: true,
        targetLane: prev.currentLaneIndex + 1,
        // Don't mark manhole as collected until chicken reaches it
        manholes: prev.manholes.map(m => ({
          ...m,
          isCollected: m === nextManhole ? false : m.isCollected
        }))
      }));
    }
  };

  const isClickInsideManhole = (x: number, y: number, manhole: Manhole) => {
    const clickRadius = 30; // Larger click detection area
    const manholeX = manhole.position.x + manhole.width / 2;
    const manholeY = manhole.position.y + manhole.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - manholeX, 2) + 
      Math.pow(y - manholeY, 2)
    );
    
    return distance <= clickRadius;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Load game assets
    loadAssets();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Always update vehicles for constant traffic
      updateVehicles(gameState);

      if (!gameState.gameOver && !isGameOverDelayed) {
        updatePlayerPosition(gameState, controls.current);
        if (checkCollisions(gameState)) {
          setIsGameOverDelayed(true);
          if (gameOverTimeout.current) {
            clearTimeout(gameOverTimeout.current);
          }
          if (oopsTimeout.current) {
            clearTimeout(oopsTimeout.current);
          }
          
          gameOverTimeout.current = setTimeout(() => {
            setShowOops(true);
            oopsTimeout.current = setTimeout(() => {
              setGameState(prev => ({
                ...initializeGame(),
                betAmount: prev.betAmount,
                difficulty: prev.difficulty,
                controlState: 'betting'
              }));
              setIsGameOverDelayed(false);
              setShowOops(false);
            }, 6000) as unknown as number;
          }, 6000) as unknown as number;
        }
      }

      drawGame(ctx, gameState);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState.gameOver) {
        setGameState({
          ...initializeGame(),
          betAmount: gameState.betAmount,
          difficulty: gameState.difficulty,
          controlState: 'betting' // Reset control state to betting
        });
        return;
      }

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          controls.current.up = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controls.current.down = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controls.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controls.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          controls.current.up = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controls.current.down = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controls.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controls.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      if (gameOverTimeout.current) {
        clearTimeout(gameOverTimeout.current);
      }
      if (oopsTimeout.current) {
        clearTimeout(oopsTimeout.current);
      }
    };
  }, [gameState, isGameOverDelayed]);

  return (
    <div className="h-screen flex flex-col items-center justify-center py-4 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,128,255,0.1)_0%,transparent_70%)] bg-[size:50px_50px] bg-repeat opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.4)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <input
          type="number"
          value={devBalance}
          onChange={handleDevBalanceChange}
          placeholder="Set Balance"
          className="bg-black/30 text-white px-2 py-1 rounded-lg w-24 text-sm backdrop-blur-sm border border-white/10"
        />
      </div>
      <div 
        className="relative mb-2 z-10"
        onClick={handleCanvasClick}
        style={{ 
          boxShadow: '0 0 50px rgba(0, 255, 255, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-cyan-500/30 rounded-lg"
        />
      </div>
      {showFloatingWin && (
        <WinNotification 
          amount={winAmount} 
          onComplete={() => setShowFloatingWin(false)}
        />
      )}
      <div className="w-[785px] z-10">
        <GameControls
          gameState={gameState}
          onBetAmountChange={handleBetAmountChange}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={useGameState.getState().isPlaying ? handleCashout : handleStartGame}
          userBalance={balance}
        />
      </div>
    </div>
  );
}

export default App;
