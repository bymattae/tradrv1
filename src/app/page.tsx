'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import PageTransition from './components/PageTransition';
import NavBar from './components/NavBar';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNewGame = () => {
    router.push('/auth');
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white">
        <NavBar variant="home" />
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-4 gap-6">
          {/* Header */}
          <div className="text-center">
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: 'monospace' }}
              >
                <span className="text-yellow-500">BUY</span>{' '}
                <span className="text-black">OR</span>{' '}
                <span className="text-green-500">SELL</span>
              </motion.h2>
            </motion.div>
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.p 
                className="text-sm mt-2 text-gray-600"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ fontFamily: 'monospace' }}
              >
                The game for traders.
              </motion.p>
            </motion.div>
          </div>

          {/* Menu Buttons */}
          <div className="w-full max-w-sm space-y-6">
            <motion.button
              className="w-full py-6 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-xl font-bold gap-2 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleNewGame}
            >
              <span>NEW GAME</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
            </motion.button>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-black text-black rounded-none flex flex-col items-center justify-center text-lg font-bold gap-1 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span>1-1 BATTLE</span>
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚔️
                </motion.span>
              </div>
              <motion.span 
                className="text-xs opacity-70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Coming soon. Battle your friends!
              </motion.span>
            </motion.button>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-purple-500 hover:to-purple-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span>LEADERBOARD</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🏆
              </motion.span>
            </motion.button>
          </div>

          {/* High Score */}
          <motion.div 
            className="w-full max-w-sm bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-black rounded-none p-4 text-center space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-bold">HIGHEST SCORE</h3>
            <p className="text-3xl font-bold text-green-500">+10,250</p>
            <div className="flex items-center justify-center gap-2">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User avatar'}
                  width={32}
                  height={32}
                  className="border-2 border-black"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center">
                  👤
                </div>
              )}
              <span className="text-sm font-bold">
                @{user?.displayName || 'anonymous'}
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
