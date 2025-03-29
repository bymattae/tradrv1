'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PageTransition from '../../../components/PageTransition';
import NavBar from '../../../components/NavBar';

export default function EmailSignupPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/auth/signup/onboarding');
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col bg-white">
        <NavBar variant="onboarding" step={2} />
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: 'monospace' }}
            >
              JOIN TRADR
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: 'monospace' }}
            >
              Choose how to sign up
            </motion.p>
          </div>

          <div className="w-full max-w-sm space-y-6">
            {/* Email input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center transition-all duration-200 focus:border-yellow-300"
                placeholder="you@example.com"
                required
              />
            </motion.div>

            {/* Start button */}
            <motion.button
              className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold gap-2 transition-all duration-200 hover:from-green-500 hover:to-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleContinue}
            >
              <span>START NOW</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.span>
            </motion.button>

            {/* Divider */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-lg">OR</span>
              </div>
            </motion.div>

            {/* Social buttons */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="relative py-3 bg-white border-2 border-black rounded-none flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              >
                <span className="text-2xl">🔍</span>
                <span className="text-xs">Google</span>
              </motion.button>
              <motion.button
                className="relative py-3 bg-black border-2 border-black rounded-none flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:bg-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              >
                <span className="text-2xl">🍎</span>
                <span className="text-xs text-white">Apple</span>
              </motion.button>
              <motion.button
                className="relative py-3 bg-[#1877F2] border-2 border-black rounded-none flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:bg-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                whileTap={{ scale: 0.98, shadow: "0px 0px 0px 0px rgba(0,0,0,1)" }}
              >
                <span className="text-2xl">👥</span>
                <span className="text-xs text-white">Facebook</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
} 