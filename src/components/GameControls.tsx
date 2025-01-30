import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { GameState } from '../game/types';
import { useGameState } from '../game/controllers/gameStateController';
import { MIN_BET_AMOUNT, MAX_BET_AMOUNT } from '../game/constants';
import { HowToPlay } from './HowToPlay';

interface GameControlsProps {
  gameState: GameState;
  userBalance: number | null;
  onBetAmountChange: (amount: number) => void;
  onDifficultyChange: (difficulty: GameState['difficulty']) => void;
  onStartGame: () => void;
}

export function GameControls({
  gameState,
  userBalance,
  onBetAmountChange,
  onDifficultyChange,
  onStartGame,
}: GameControlsProps) {
  const difficulties: GameState['difficulty'][] = ['Easy', 'Medium', 'Hard'];
  const { isPlaying } = useGameState();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleBetChange = (newAmount: number) => {
    const formattedAmount = Number(Math.max(MIN_BET_AMOUNT, Math.min(MAX_BET_AMOUNT, newAmount)).toFixed(2));
    onBetAmountChange(formattedAmount);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl mx-auto border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-[8px] uppercase tracking-wider font-medium">Bet Amount</span>
            <Info 
              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-white transition-colors"
              onClick={() => setShowHowToPlay(true)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-lg font-bold ${
                gameState.controlState === 'betting'
                  ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/50'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              onClick={() => gameState.controlState === 'betting' && handleBetChange(gameState.betAmount - MIN_BET_AMOUNT)}
              disabled={gameState.controlState !== 'betting'}
            >
              -
            </button>
            <input
              type="number"
              min={MIN_BET_AMOUNT}
              max={MAX_BET_AMOUNT}
              value={gameState.betAmount.toFixed(2)}
              readOnly
              className="bg-slate-800/50 text-white px-4 py-2 rounded-lg w-28 text-center font-bold text-xl border border-cyan-500/30 shadow-inner"
            />
            <button
              className={`px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-lg font-bold ${
                gameState.controlState === 'betting'
                  ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/50'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              onClick={() => gameState.controlState === 'betting' && handleBetChange(gameState.betAmount + MIN_BET_AMOUNT)}
              disabled={gameState.controlState !== 'betting'}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 ml-auto">
          <span className="text-gray-400 text-[8px] uppercase tracking-wider font-medium">Difficulty</span>
          <div className="flex gap-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                className={`px-3 py-1 rounded ${
                  gameState.difficulty === diff
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 scale-105 font-bold'
                    : 'bg-slate-800/50 text-white hover:bg-slate-700/70 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200'
                }`}
                onClick={() => gameState.controlState === 'betting' && onDifficultyChange(diff)}
                disabled={gameState.controlState !== 'betting'}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`px-6 py-2 ml-4 text-white font-bold rounded-lg flex flex-col items-center min-w-[140px] ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg hover:shadow-amber-500/50'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-green-500/50'
          }`}
          onClick={onStartGame}
        >
          <span>{isPlaying ? 'CASH OUT' : 'START'}</span>
          {isPlaying && gameState.balance > 0 && (
            <span className="text-sm font-medium mt-1">${gameState.balance.toFixed(2)}</span>
          )}
        </button>
      </div>
      {showHowToPlay && <HowToPlay isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}
