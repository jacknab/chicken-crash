import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DIFFICULTY_MULTIPLIERS, MIN_BET_AMOUNT, MAX_BET_AMOUNT } from '../game/constants';

type HowToPlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [
    {
      title: 'Welcome to Chicken Run!',
      content: (
        <div className="space-y-4">
          <p>
            Welcome to an exciting game of skill and timing! Guide your chicken across 
            multiple lanes of traffic to reach the finish line. The further you progress, 
            the higher your multiplier grows!
          </p>
          <p>
            Click and hold the MOVE button to guide your chicken forward.
            Time your movements carefully to avoid vehicles and keep your winnings!
          </p>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Progressive multipliers in each lane</li>
              <li>Three difficulty levels</li>
              <li>Real-time cashout system</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Easy Mode',
      content: (
        <div className="space-y-4">
          <p>Perfect for beginners or those who prefer a more relaxed gameplay.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Settings:</h3>
            <ul className="space-y-2">
              <li>Base Multiplier: {DIFFICULTY_MULTIPLIERS.Easy.base}x</li>
              <li>Multiplier Increment: +{DIFFICULTY_MULTIPLIERS.Easy.increment} per lane</li>
              <li>Vehicle Speed: Slower</li>
              <li>Traffic Density: Lower</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Medium Mode',
      content: (
        <div className="space-y-4">
          <p>Balanced difficulty for experienced players.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Settings:</h3>
            <ul className="space-y-2">
              <li>Base Multiplier: {DIFFICULTY_MULTIPLIERS.Medium.base}x</li>
              <li>Multiplier Increment: +{DIFFICULTY_MULTIPLIERS.Medium.increment} per lane</li>
              <li>Vehicle Speed: Moderate</li>
              <li>Traffic Density: Medium</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Hard Mode',
      content: (
        <div className="space-y-4">
          <p>For players seeking the ultimate challenge!</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Settings:</h3>
            <ul className="space-y-2">
              <li>Base Multiplier: {DIFFICULTY_MULTIPLIERS.Hard.base}x</li>
              <li>Multiplier Increment: +{DIFFICULTY_MULTIPLIERS.Hard.increment} per lane</li>
              <li>Vehicle Speed: Fast</li>
              <li>Traffic Density: High</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Game Rules',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <ul className="space-y-3">
              <li>All wins are multiplied by base bet.</li>
              <li>All values are expressed as actual wins in coins.</li>
              <li>Minimum Bet: ${MIN_BET_AMOUNT.toFixed(2)}</li>
              <li>Maximum Bet: ${MAX_BET_AMOUNT.toFixed(2)}</li>
            </ul>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Malfunctions void all pays and plays.
          </p>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{pages[currentPage].title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto text-white">
          {pages[currentPage].content}
        </div>
        
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 0}
            className={`p-2 rounded-full ${
              currentPage === 0 ? 'text-gray-600' : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-gray-400">
            Page {currentPage + 1} of {pages.length}
          </div>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === pages.length - 1}
            className={`p-2 rounded-full ${
              currentPage === pages.length - 1 ? 'text-gray-600' : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
