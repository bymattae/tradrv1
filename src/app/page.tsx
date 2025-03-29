'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageTransition from './components/PageTransition';
import BattleInviteModal from './components/BattleInviteModal';

export default function Home() {
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-gradient-to-b from-white via-[#f0f0ff] to-[#f5f0ff] px-4 py-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#00FF99]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#AA66FF]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl" />
        </div>

        {/* Game Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative"
        >
          <motion.div 
            className="absolute -inset-4 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-bold mb-3 relative" style={{ fontFamily: 'monospace' }}>
            <motion.span 
              className="text-[#00FF99] drop-shadow-[0_0_15px_rgba(0,255,153,0.3)]"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              BUY
            </motion.span>
            <motion.span 
              className="text-[#1A1A1A]"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              OR
            </motion.span>
            <motion.span 
              className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.3)]"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SELL
            </motion.span>
          </div>
          <motion.p 
            className="text-sm text-[#1A1A1A]/70 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            gm fam ☕
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              📈
            </motion.span>
          </motion.p>
        </motion.div>

        {/* High Score Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm border-2 border-[#1A1A1A] rounded-none p-4 w-full max-w-sm mb-12 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF99]/20 to-[#AA66FF]/20 blur-sm" />
          <div className="relative">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-3 flex items-center justify-center gap-2">
              Your P/L is public 👀
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌟
              </motion.span>
            </h3>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-white border-2 border-[#1A1A1A] rounded-none overflow-hidden shadow-inner">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#1A1A1A] text-xl">👤</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-mono font-semibold">@anonymous</p>
                <p className="text-xl font-mono font-bold text-[#00FF99] flex items-center gap-1">
                  +10,250
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💰
                  </motion.span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-sm relative">
          <motion.button
            onClick={() => router.push('/auth')}
            className="game-btn bg-gradient-to-r from-[#00FF99] to-[#00CC7A] hover:from-[#00CC7A] hover:to-[#00FF99]"
            whileTap={{ scale: 0.95, y: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={false}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <span>Play Game 🎮</span>
            </div>
          </motion.button>

          <motion.button
            className="game-btn bg-gradient-to-r from-[#AA66FF] to-[#8844CC] hover:from-[#8844CC] hover:to-[#AA66FF]"
            whileTap={{ scale: 0.95, y: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setIsInviteModalOpen(true)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={false}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span>1v1 Battle ⚔️</span>
              </div>
              <span className="text-xs opacity-70">Wen lambo? 🚗</span>
            </div>
          </motion.button>
        </div>

        <style>{`
          .game-btn {
            position: relative;
            width: 100%;
            padding: 1.25rem;
            border: 2px solid #1A1A1A;
            color: #1A1A1A;
            font-weight: bold;
            font-size: 1.25rem;
            text-align: center;
            overflow: hidden;
            transition: all 0.2s;
            transform-origin: center bottom;
            box-shadow: 4px 4px 0px 0px rgba(26,26,26,1);
            backdrop-filter: blur(4px);
            font-family: monospace;
          }

          .game-btn:hover {
            transform: translateY(-2px);
            box-shadow: 6px 6px 0px 0px rgba(26,26,26,1);
          }

          .game-btn:active {
            transform: translateY(2px);
            box-shadow: 2px 2px 0px 0px rgba(26,26,26,1);
          }
        `}</style>

        <BattleInviteModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      </div>
    </PageTransition>
  );
}
