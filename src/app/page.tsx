'use client';

import { motion } from 'framer-motion';
import { Search, Sun, Globe, Smartphone, User, Trophy, Users, Star, ChevronRight, LogIn, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#D3D3D3] nav-top">
        <div className="max-w-7xl mx-auto h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <h1 className="text-lg md:text-xl font-bold text-[#0079D3] float-animation">TRADR 📈</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search to the moon 🚀"
                className="pl-10 pr-4 py-2 bg-[#F8F8F8] rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0079D3]/20 border border-[#D3D3D3]"
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
            <motion.button 
              className="nav-link active"
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-6 h-6" />
              <span className="sidebar-text">Tournaments</span>
            </motion.button>
            <motion.button 
              className="nav-link"
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-6 h-6" />
              <span className="sidebar-text">Community</span>
            </motion.button>
            <motion.button 
              className="nav-link"
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-6 h-6" />
              <span className="sidebar-text">Missions</span>
            </motion.button>
            <motion.button 
              className="nav-link"
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-6 h-6" />
              <span className="sidebar-text">Tools</span>
            </motion.button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-2 space-y-2">
          <motion.button 
            className="nav-link active w-full text-left"
            whileHover={{ x: 2 }}
          >
            <Trophy className="w-5 h-5 inline-block mr-3" />
            Tournaments 🏆
          </motion.button>
          <motion.button 
            className="nav-link w-full text-left"
            whileHover={{ x: 2 }}
          >
            <Users className="w-5 h-5 inline-block mr-3" />
            Community 🤝
          </motion.button>
          <motion.button 
            className="nav-link w-full text-left"
            whileHover={{ x: 2 }}
          >
            <Star className="w-5 h-5 inline-block mr-3" />
            Missions 🎯
          </motion.button>
          <motion.button 
            className="nav-link w-full text-left"
            whileHover={{ x: 2 }}
          >
            <Settings className="w-5 h-5 inline-block mr-3" />
            Tools 🛠️
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="main-content md:col-span-7 space-y-6 md:space-y-8">
          {/* Hero Stats */}
          <div className="bg-white rounded-lg p-4 md:p-8 border border-[#D3D3D3]">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Playtrade Tournaments 🎮</h2>
              <p className="text-gray-600 text-sm md:text-base">Trade Risk-Free, Win Real Cash 💸</p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <motion.div 
                className="stats-card pulse-animation"
                whileHover={{ scale: 1.02 }}
              >
                <Image 
                  src="/memes/stonks.gif" 
                  alt="Stonks" 
                  width={40} 
                  height={40} 
                  className="meme-icon mb-2"
                />
                <div className="stats-value">9.5M</div>
                <div className="stats-label">TRADES 📊</div>
              </motion.div>
              <motion.div 
                className="stats-card pulse-animation"
                whileHover={{ scale: 1.02 }}
              >
                <Image 
                  src="/memes/money-printer.gif" 
                  alt="Money Printer" 
                  width={40} 
                  height={40} 
                  className="meme-icon mb-2"
                />
                <div className="stats-value">$185K</div>
                <div className="stats-label">PAID 💰</div>
              </motion.div>
              <motion.div 
                className="stats-card pulse-animation"
                whileHover={{ scale: 1.02 }}
              >
                <Image 
                  src="/memes/doge-army.gif" 
                  alt="Doge Army" 
                  width={40} 
                  height={40} 
                  className="meme-icon mb-2"
                />
                <div className="stats-value">58K</div>
                <div className="stats-label">USERS 👥</div>
              </motion.div>
            </div>
          </div>

          {/* Daily Missions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold">Daily Missions <span className="text-sm font-normal text-gray-500">5</span></h2>
              <div className="text-sm text-[#0079D3]">LFG! 🚀</div>
            </div>
            <div className="space-y-3">
              <motion.div 
                className="mission-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-[#90EE90]">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#006400]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Make 50 Trades 💪</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      Earn <span className="badge badge-xp">⭐ 25 XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-xs md:text-sm text-gray-500">0/50</div>
                  <button className="button-claim" disabled>Incomplete</button>
                </div>
              </motion.div>

              <motion.div 
                className="mission-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-blue-50">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-[#0079D3]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Join Tournament 🏆</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      Earn <span className="badge badge-xp">⭐ 10 XP</span>
                    </div>
                  </div>
                </div>
                <button className="button-primary flex items-center gap-2">
                  Start
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div 
                className="mission-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="icon-box w-10 h-10 md:w-12 md:h-12 bg-[#F08080]/10">
                    <LogIn className="w-5 h-5 md:w-6 md:h-6 text-[#F08080]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Daily Login 📅</h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      Earn <span className="badge badge-xp">⭐ 7 XP</span> + <span className="text-[#28a745]">$25</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-xs md:text-sm text-gray-500">7/7</div>
                  <button className="button-claim">Claim 🎁</button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block md:col-span-3 space-y-6">
          <div className="bg-white rounded-lg p-4 md:p-6 border border-[#D3D3D3]">
            <h3 className="text-base md:text-lg font-bold mb-4">Scalable Missions 🚀 <span className="text-sm font-normal text-gray-500">3</span></h3>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className="icon-box w-10 h-10 bg-[#F08080]/10">
                    <Users className="w-5 h-5 text-[#F08080]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Refer Friends 🤝</h4>
                    <div className="text-xs text-gray-500">0/10</div>
                  </div>
                </div>
                <button className="button-primary text-sm">Start 🎯</button>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className="icon-box w-10 h-10 bg-blue-50">
                    <Trophy className="w-5 h-5 text-[#0079D3]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1-to-1 Battle ⚔️</h4>
                    <div className="text-xs text-gray-500">3/3</div>
                  </div>
                </div>
                <button className="button-claim text-sm">Claim 🎁</button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 