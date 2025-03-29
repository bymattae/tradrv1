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
      className="w-full border-b-2 border-black bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-4 py-2">
        <div className="flex justify-between items-center h-12">
          {variant === 'home' ? (
            <>
              {/* XP Amount */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-yellow-500" style={{ fontFamily: 'monospace' }}>XP</span>
                <span className="font-bold text-yellow-500" style={{ fontFamily: 'monospace' }}>1,234</span>
              </div>
              
              {/* Avatar */}
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User avatar'}
                    width={24}
                    height={24}
                    className="border-2 border-black"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-100 border-2 border-black flex items-center justify-center text-sm">
                    👤
                  </div>
                )}
                <span className="text-sm font-medium" style={{ fontFamily: 'monospace' }}>
                  {user?.displayName || 'Anonymo'}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <motion.button
                className="flex items-center gap-1 text-black hover:text-yellow-500 transition-colors"
                onClick={handleBack}
                whileHover={{ x: -3 }}
              >
                <span className="text-lg">←</span>
                <span className="text-sm font-medium" style={{ fontFamily: 'monospace' }}>Back</span>
              </motion.button>
              <div /> {/* Empty div for spacing */}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
} 