'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEmailLogin = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    // Store email in localStorage for verification page
    localStorage.setItem('userEmail', email);
    router.push('/auth/verify');
  };

  const handleGoogleLogin = () => {
    // For now, just navigate to verify page
    router.push('/auth/verify');
  };

  const handleAppleLogin = () => {
    // For now, just navigate to verify page
    router.push('/auth/verify');
  };

  const handleSkip = () => {
    router.push('/onboarding/profile');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt="TRADR"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-display text-sm font-medium text-gray-600">Welcome to TRADR</span>
        </motion.div>
        <div className="w-6" />
      </nav>

      <main className="max-w-md mx-auto p-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Image
            src="/logo.png"
            alt="TRADR"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-3">
            Sign in to TRADR
          </h1>
          <p className="text-gray-600">
            Join a community of verified traders and share your success
          </p>
        </motion.div>

        {/* Sign In Options */}
        <div className="space-y-4">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#A259FF]/20 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A259FF]/10 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                  <Mail className="w-5 h-5 text-[#A259FF]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Continue with email</div>
                  <div className="text-sm text-gray-500">Use your email address</div>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Google */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#A259FF]/20 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A259FF]/10 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#A259FF"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#A259FF"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#A259FF"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#A259FF"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Continue with Google</div>
                  <div className="text-sm text-gray-500">Use your Google account</div>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Apple */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-[#A259FF]/20 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A259FF]/10 flex items-center justify-center group-hover:bg-[#A259FF]/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#A259FF"
                      d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.55-2.09-.56-3.24 0-1.44.71-2.23.51-3.08-.35-4.28-4.71-3.7-11.56 1.36-11.91 1.13.07 1.94.63 2.85.65.93-.15 1.81-.73 2.85-.66 1.19.1 2.09.56 2.69 1.4-2.45 1.55-2.03 4.68.78 5.64-.69 1.99-1.67 3.96-3.13 4.88M13 7.5c-.09-2.47 1.95-4.54 4.32-4.5.31 2.75-2.27 4.81-4.32 4.5Z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Continue with Apple</div>
                  <div className="text-sm text-gray-500">Use your Apple ID</div>
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Terms */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#A259FF] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#A259FF] hover:underline">Privacy Policy</a>
        </motion.p>
      </main>
    </div>
  );
} 