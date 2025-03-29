'use client';
import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">
          Buy or Sell
        </h1>
        <div className="space-y-4">
          <button className="w-64 py-3 px-6 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg transition-all">
            NEW GAME
          </button>
          <div className="flex flex-col gap-2">
            <button className="w-64 py-3 px-6 bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all">
              LEADERBOARD
            </button>
            <button className="w-64 py-3 px-6 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all">
              1-1 BATTLE
            </button>
          </div>
        </div>
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="font-semibold text-gray-700">HIGHEST SCORE</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-mono">ALEX_SS</span>
            <span className="font-mono text-green-500">$487K</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">CAN YOU BEAT IT?</p>
        </div>
        <p className="text-sm text-gray-500 mt-8">INSERT COIN TO CONTINUE</p>
        <p className="text-xs text-gray-400">A PRODUCTION BY MATT JAMES</p>
      </div>
    </main>
  );
}
