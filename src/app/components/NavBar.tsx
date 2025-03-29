'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

type NavBarProps = {
  variant: 'home' | 'onboarding';
  step?: number;
};

export default function NavBar({ variant, step }: NavBarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleBack = () => {
    if (step === 1) {
      router.push('/');
    } else if (step === 2) {
      router.push('/auth');
    } else if (step === 3) {
      router.push('/auth/signup/email');
    }
  };

  return (
    <motion.nav 
      className="w-full border-b-2 border-yellow-300 bg-white shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {variant === 'home' ? (
            <>
              {/* XP Amount */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-yellow-500">XP</span>
                <span className="text-2xl font-bold text-yellow-600">1,234</span>
              </div>
              
              {/* Avatar */}
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User avatar'}
                    width={32}
                    height={32}
                    className="border-2 border-yellow-300 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-100 border-2 border-yellow-300 rounded-full flex items-center justify-center">
                    👤
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user?.displayName || 'Anonymous'}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <motion.button
                className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors"
                onClick={handleBack}
                whileHover={{ x: -5 }}
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">Back</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
} 