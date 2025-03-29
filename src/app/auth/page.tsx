'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const handleEmailSignup = () => {
    // Animate out
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      router.push('/auth/signup/email');
    }, 300);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header Section - Fixed at top */}
      <div className="w-full p-8 text-center space-y-4">
        <motion.div 
          className="flex justify-center items-center gap-4 text-sm mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center bg-yellow-300">1</span>
          <div className="w-12 h-0.5 bg-black opacity-30"></div>
          <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center opacity-30">2</span>
          <div className="w-12 h-0.5 bg-black opacity-30"></div>
          <span className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center opacity-30">3</span>
        </motion.div>

        <motion.h2 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          STEP ONE
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Pick an option to get started
        </motion.p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4 gap-4">
        <motion.button
          className="w-full max-w-sm py-4 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleEmailSignup}
        >
          <span>I&apos;M NEW HERE</span>
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮
          </motion.span>
        </motion.button>

        <motion.button
          className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span>I HAVE AN ACCOUNT</span>
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔑
          </motion.span>
        </motion.button>
      </div>
    </main>
  );
} 