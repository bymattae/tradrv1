'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavigationBarProps {
  showBack?: boolean;
  xp?: number;
  userAvatar?: string | null;
}

export default function NavigationBar({ showBack = false, xp = 0, userAvatar }: NavigationBarProps) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left Side - Back Button */}
        <div className="w-24 flex items-center">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <span>←</span>
              <span>BACK</span>
            </button>
          )}
        </div>

        {/* Right Side - XP and Avatar */}
        <div className="flex items-center justify-end gap-3">
          {/* XP Counter */}
          <div className="text-xs sm:text-sm font-medium flex items-center gap-1">
            <span className="text-green-500">●</span>
            {xp.toLocaleString()} XP
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 pixel-border relative">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-lg">
                👤
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 