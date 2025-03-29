'use client';

import { motion } from 'framer-motion';
import { Search, Sun, Globe, Smartphone, User, Trophy, Users, Star, ChevronRight, LogIn, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-[#00C087]">TRADR</h1>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#00C087]/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="nav-link">
              <Sun className="w-5 h-5" />
            </button>
            <button className="nav-link">
              <Globe className="w-5 h-5" />
            </button>
            <button className="nav-link">
              <Smartphone className="w-5 h-5" />
            </button>
            <button className="button-primary">Sign Up</button>
            <button className="nav-link">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-2 space-y-2">
          <button className="nav-link active w-full text-left">
            <Trophy className="w-5 h-5 inline-block mr-3" />
            Tournaments
          </button>
          <button className="nav-link w-full text-left">
            <Users className="w-5 h-5 inline-block mr-3" />
            Community
          </button>
          <button className="nav-link w-full text-left">
            <Star className="w-5 h-5 inline-block mr-3" />
            Missions
          </button>
          <button className="nav-link w-full text-left">
            <Settings className="w-5 h-5 inline-block mr-3" />
            Tools
          </button>
        </div>

        {/* Main Content */}
        <div className="col-span-7 space-y-8">
          {/* Hero Stats */}
          <div className="bg-gradient-to-r from-[#E1FFE8] to-[#E5F4FF] rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Playtrade Tournaments</h2>
              <p className="text-gray-600">Trade Risk-Free, Win Real Cash 💰</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="stats-value">9,536,889</div>
                <div className="stats-label">TRADES EXECUTED</div>
              </div>
              <div className="stats-card">
                <div className="stats-value">$185,000</div>
                <div className="stats-label">CASH PAID</div>
              </div>
              <div className="stats-card">
                <div className="stats-value">58,051</div>
                <div className="stats-label">PLAYTRADERS</div>
              </div>
            </div>
          </div>

          {/* Daily Missions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Daily Missions <span className="text-sm font-normal text-gray-500">5</span></h2>
            </div>
            <div className="space-y-3">
              <div className="mission-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E1FFE8] rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[#00C087]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Make 50 Trades per day</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      Earn <span className="text-yellow-500">⭐ 25 XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">0/50</div>
                  <button className="button-secondary">Claim</button>
                </div>
              </div>

              <div className="mission-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E5F4FF] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Join Day Trading Tournament</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      Earn <span className="text-yellow-500">⭐ 10 XP</span>
                    </div>
                  </div>
                </div>
                <button className="button-primary flex items-center gap-2">
                  Start
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mission-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF5E5] rounded-xl flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Daily Login</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      Earn <span className="text-yellow-500">⭐ 7 XP</span> + <span className="text-[#00C087]">$25</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">0/7</div>
                  <button className="button-secondary">Claim</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Scalable Missions <span className="text-sm font-normal text-gray-500">3</span></h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFF5E5] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Refer a Friend</h4>
                    <div className="text-xs text-gray-500">0/10</div>
                  </div>
                </div>
                <button className="button-primary text-sm">Start</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E5F4FF] rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1-to-1 Battle Streak</h4>
                    <div className="text-xs text-gray-500">0/3</div>
                  </div>
                </div>
                <button className="button-secondary text-sm">Claim</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 