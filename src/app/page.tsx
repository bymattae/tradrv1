'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../lib/hooks/useAuth';
import PageTransition from './components/PageTransition';
import NavBar from './components/NavBar';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNewGame = () => {
    router.push('/auth');
  };

  // Animation variants for the title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const buyVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const orVariants = {
    hidden: { opacity: 0, scale: 1.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const sellVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-green-50 opacity-50" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.05
        }} />
        
        <NavBar variant="home" />
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-4 pt-12 pb-4 gap-8 relative">
          {/* Header */}
          <div className="text-center">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="mb-4 relative"
            >
              <div className="flex items-center justify-center gap-4 text-5xl sm:text-6xl font-bold relative" style={{ fontFamily: 'monospace' }}>
                <motion.span 
                  variants={buyVariants}
                  className="text-yellow-500 hover:text-yellow-600 transition-colors cursor-default inline-block"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  BUY
                </motion.span>

                <motion.span 
                  variants={orVariants}
                  className="text-black hover:text-gray-700 transition-colors cursor-default"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  OR
                </motion.span>

                <motion.span 
                  variants={sellVariants}
                  className="text-green-500 hover:text-green-600 transition-colors cursor-default inline-block"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  SELL
                </motion.span>
              </div>
            </motion.div>

            <motion.p 
              className="text-base text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontFamily: 'monospace' }}
            >
              The game for traders.
            </motion.p>
          </div>

          {/* Menu Buttons */}
          <div className="w-full max-w-sm space-y-6">
            <motion.button
              className="w-full py-6 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-xl font-bold gap-3 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleNewGame}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ scale: [1, 1.5], rotate: [0, 90] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative">NEW GAME</span>
              <motion.span
                className="relative"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.span>
            </motion.button>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-black text-black rounded-none flex flex-col items-center justify-center text-lg font-bold gap-1 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ scale: [1, 1.5], rotate: [0, 90] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="relative flex items-center gap-2">
                <span>1-1 BATTLE</span>
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚔️
                </motion.span>
              </div>
              <motion.span 
                className="text-xs opacity-70 relative"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Coming soon. Battle your friends!
              </motion.span>
            </motion.button>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-purple-500 hover:to-purple-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ scale: [1, 1.5], rotate: [0, 90] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative">LEADERBOARD</span>
              <motion.span
                className="relative"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🏆
              </motion.span>
            </motion.button>
          </div>

          {/* High Score */}
          <motion.div 
            className="w-full max-w-sm bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-black rounded-none p-4 text-center space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-50 to-yellow-100"
              initial={false}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <h3 className="font-bold relative">HIGHEST SCORE</h3>
            <p className="text-3xl font-bold text-green-500 relative">+10,250</p>
            <div className="flex items-center justify-center gap-2 relative">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User avatar'}
                  width={32}
                  height={32}
                  className="border-2 border-black"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-100 border-2 border-black flex items-center justify-center">
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
