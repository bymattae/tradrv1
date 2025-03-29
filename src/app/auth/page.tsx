'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Generate a random password that will be changed later
      const tempPassword = Math.random().toString(36).slice(-8);
      await createUserWithEmailAndPassword(auth, email, tempPassword);
      router.push('/auth/signup/onboarding');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setError('');

    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'facebook':
          authProvider = new FacebookAuthProvider();
          break;
        case 'apple':
          authProvider = new OAuthProvider('apple.com');
          break;
        default:
          throw new Error('Invalid provider');
      }

      await signInWithPopup(auth, authProvider);
      router.push('/auth/signup/onboarding');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="pt-24 pb-6 px-4">
        <div className="max-w-md mx-auto text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl">
            JOIN TRADR
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Start your trading journey! 🚀</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Auth Card */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6 pixel-border">
            {/* Email Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none pixel-border"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button flex items-center justify-center gap-2"
              >
                <span className="text-sm">CONTINUE WITH EMAIL</span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full py-2 bg-white text-black rounded-lg pixel-button flex items-center justify-center gap-3"
              >
                <span className="text-xl">🌐</span>
                <span className="text-sm">CONTINUE WITH GOOGLE</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="w-full py-2 bg-white text-black rounded-lg pixel-button flex items-center justify-center gap-3"
              >
                <span className="text-xl">👥</span>
                <span className="text-sm">CONTINUE WITH FACEBOOK</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                className="w-full py-2 bg-white text-black rounded-lg pixel-button flex items-center justify-center gap-3"
              >
                <span className="text-xl">🍎</span>
                <span className="text-sm">CONTINUE WITH APPLE</span>
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-xs text-center">
                {error}
              </div>
            )}

            {/* Terms */}
            <p className="text-[10px] text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 