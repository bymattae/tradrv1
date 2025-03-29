import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-lg mx-auto pt-20">
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/auth/signup/email')}
            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-xl flex items-center justify-center gap-3"
          >
            <span className="text-xl">I'M NEW HERE</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#333] hover:bg-[#444] text-white py-4 rounded-xl flex items-center justify-center gap-3"
          >
            <span>I HAVE AN ACCOUNT</span>
          </motion.button>
        </div>
      </div>
    </main>
  );
} 