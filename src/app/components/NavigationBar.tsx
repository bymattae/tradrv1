'use client';

import { useRouter } from 'next/navigation';

export default function NavigationBar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-black border-b border-[#333] px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          ←
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm">0 XP</span>
      </div>
    </nav>
  );
} 