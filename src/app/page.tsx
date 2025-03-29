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

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white relative overflow-hidden">
        {/* Floating Game Elements */}
        <motion.div 
          className="absolute w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-black/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        <NavBar variant="home" />
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
          {/* Game Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 text-6xl sm:text-7xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
              <motion.span 
                className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                BUY
              </motion.span>
              <motion.span 
                className="text-black"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                OR
              </motion.span>
              <motion.span 
                className="text-green-500 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                SELL
              </motion.span>
            </div>
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The game for traders
            </motion.p>
          </motion.div>

          {/* Game Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            <motion.button
              onClick={() => router.push('/auth')}
              className="game-button bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-2xl">🎮 NEW GAME</span>
            </motion.button>

            <motion.button
              className="game-button bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-2xl">⚔️ 1-1 BATTLE</span>
              <span className="absolute bottom-1 text-sm opacity-75">Coming soon</span>
            </motion.button>

            <motion.button
              onClick={() => router.push('/leaderboard')}
              className="game-button bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-2xl">🏆 LEADERBOARD</span>
            </motion.button>
          </div>

          {/* High Score Card */}
          <motion.div
            className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-6 w-full max-w-md shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">HIGHEST SCORE</h3>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="Profile" width={48} height={48} />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-2xl">?</span>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-gray-600">{user?.displayName || '@anonymous'}</p>
                  <p className="text-2xl font-bold text-green-500">+10,250</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        .game-button {
          padding: 1rem;
          border-radius: 1rem;
          color: white;
          font-weight: bold;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .game-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: 0.5s;
        }

        .game-button:hover::before {
          left: 100%;
        }
      `}</style>
    </PageTransition>
  );
}
