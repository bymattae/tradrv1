import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-lg mx-auto pt-20">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">CREATE YOUR PROFILE</h1>
            <p className="text-gray-400">Let's get to know you better</p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-[#333] flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Upload Photo
              </button>
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full bg-[#333] text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Tradr.co Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Your Tradr.co Link
              </label>
              <div className="flex items-center gap-2 bg-[#333] rounded-xl px-4 py-3">
                <span className="text-gray-400">tradr.co/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-1"
                />
              </div>
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full bg-[#333] text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white resize-none"
              ></textarea>
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3"
            >
              <span>COMPLETE PROFILE</span>
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
} 