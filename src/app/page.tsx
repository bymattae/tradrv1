'use client';

import { motion } from 'framer-motion';
import { Search, Sun, Globe, Smartphone, User, Trophy, Users, Star, ChevronRight, LogIn, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 nav-top">
        <div className="max-w-7xl mx-auto h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <h1 className="text-lg md:text-xl font-bold text-[#00C087] float-animation">TRADR 📈</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search to the moon 🚀"
                className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#00C087]/20 border-2 border-black"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="nav-link md:block">
              <Sun className="w-5 h-5" />
            </button>
            <button className="nav-link md:block">
              <Globe className="w-5 h-5" />
            </button>
            <button className="nav-link md:block">
              <Smartphone className="w-5 h-5" />
            </button>
            <button className="button-primary">Sign Up 🎯</button>
            <button className="nav-link user-button">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 md:grid md:grid-cols-12 md:gap-8">
        {/* Mobile Bottom Navigation */}
        <div className="sidebar md:hidden">
          <div className="sidebar-nav">
            <button className="nav-link active">
              <Trophy className="w-6 h-6" />
              <span className="sidebar-text">Tournaments</span>
            </button>
            <button className="nav-link">
              <Users className="w-6 h-6" />
              <span className="sidebar-text">Community</span>
            </button>
            <button className="nav-link">
              <Star className="w-6 h-6" />
              <span className="sidebar-text">Missions</span>
            </button>
            <button className="nav-link">
              <Settings className="w-6 h-6" />
              <span className="sidebar-text">Tools</span>
            </button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-2 space-y-2">
          <button className="nav-link active w-full text-left">
            <Trophy className="w-5 h-5 inline-block mr-3" />
            Tournaments 🏆
          </button>
          <button className="nav-link w-full text-left">
            <Users className="w-5 h-5 inline-block mr-3" />
            Community 🤝
          </button>
          <button className="nav-link w-full text-left">
            <Star className="w-5 h-5 inline-block mr-3" />
            Missions 🎯
          </button>
          <button className="nav-link w-full text-left">
            <Settings className="w-5 h-5 inline-block mr-3" />
            Tools 🛠️
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content md:col-span-7 space-y-6 md:space-y-8">
          {/* Hero Stats */}
          <div className="bg-gradient-to-r from-[#E1FFE8] to-[#E5F4FF] rounded-xl md:rounded-2xl p-4 md:p-8 border-2 border-black">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Playtrade Tournaments 🎮</h2>
              <p className="text-gray-600 text-sm md:text-base">Trade Risk-Free, Win Real Cash 💸</p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="stats-card pulse-animation">
                <div className="stats-value">9.5M</div>
                <div className="stats-label">TRADES 📊</div>
              </div>
              <div className="stats-card pulse-animation">
                <div className="stats-value">$185K</div>
                <div className="stats-label">PAID 💰</div>
              </div>
              <div className="stats-card pulse-animation">
                <div className="stats-value">58K</div>
                <div className="stats-label">USERS 👥</div>
              </div>
            </div>
          </div>

          {/* Daily Missions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold">Daily Missions <span className="text-sm font-normal text-gray-500">5</span></h2>
              <div className="text-sm text-gray-500">LFG! 🚀</div>
            </div>
            <div className="space-y-3">
              <div className="mission-card">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-[#E1FFE8]">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#00C087]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Make 50 Trades 💪</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      Earn <span className="text-yellow-500">⭐ 25 XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-xs md:text-sm text-gray-500">0/50</div>
                  <button className="button-secondary">Claim 🎁</button>
                </div>
              </div>

              <div className="mission-card">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-[#E5F4FF]">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Join Tournament 🏆</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
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
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-[#FFF5E5]">
                    <LogIn className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Daily Login 📅</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      Earn <span className="text-yellow-500">⭐ 7 XP</span> + <span className="text-[#00C087]">$25</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-xs md:text-sm text-gray-500">0/7</div>
                  <button className="button-secondary">Claim 🎁</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block md:col-span-3 space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-black">
            <h3 className="text-base md:text-lg font-bold mb-4">Scalable Missions 🚀 <span className="text-sm font-normal text-gray-500">3</span></h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-box w-10 h-10 bg-[#FFF5E5]">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Refer Friends 🤝</h4>
                    <div className="text-xs text-gray-500">0/10</div>
                  </div>
                </div>
                <button className="button-primary text-sm">Start 🎯</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-box w-10 h-10 bg-[#E5F4FF]">
                    <Trophy className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1-to-1 Battle ⚔️</h4>
                    <div className="text-xs text-gray-500">0/3</div>
                  </div>
                </div>
                <button className="button-secondary text-sm">Claim 🎁</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 