'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Nav Bar */}
      <div className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold text-center">TRADR</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">BUILD YOUR PROFILE</h2>
            <div className="flex items-center justify-end gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm">LIVE PREVIEW</span>
            </div>
          </div>

          <div className="space-y-6 border-2 border-black p-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <label className="relative cursor-pointer">
                <div className="w-24 h-24 border-2 border-black flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-sm">Add Photo</span>
                      <br />
                      <span className="text-xs text-gray-500">Click to upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-black rounded-none text-lg text-center"
                placeholder="@Username"
              />
              <p className="text-sm text-center">tradr.co/@username</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <textarea
                className="w-full p-4 border-2 border-black rounded-none text-lg resize-none"
                placeholder="Write your bio"
                rows={2}
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">0/160</span>
              </div>
            </div>

            {/* Complete Button */}
            <motion.button
              className="w-full py-4 bg-yellow-300 border-2 border-black text-black rounded-none flex items-center justify-center text-lg font-bold"
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
            >
              COMPLETE
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
} 