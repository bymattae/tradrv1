import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[380px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium">Join Tradr</h1>
          <p className="text-[#666666]">It's free forever</p>
        </div>

        {/* Email signup */}
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333]"
            />
          </div>
          <Link 
            href="/onboarding/profile"
            className="flex items-center justify-center w-full bg-[#00C853] hover:bg-[#00B84D] text-white rounded-xl py-3.5 font-medium transition-colors"
          >
            Sign up with email
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-[#222222]"></div>
          <span className="text-[#666666] text-sm">OR</span>
          <div className="h-[1px] flex-1 bg-[#222222]"></div>
        </div>

        {/* Social logins */}
        <div className="flex justify-center gap-4">
          <button className="w-[52px] h-[52px] bg-[#141414] hover:bg-[#1A1A1A] rounded-xl flex items-center justify-center transition-colors">
            <Image src="/google.svg" alt="Google" width={24} height={24} />
          </button>
          <button className="w-[52px] h-[52px] bg-[#141414] hover:bg-[#1A1A1A] rounded-xl flex items-center justify-center transition-colors">
            <Image src="/apple.svg" alt="Apple" width={24} height={24} />
          </button>
          <button className="w-[52px] h-[52px] bg-[#141414] hover:bg-[#1A1A1A] rounded-xl flex items-center justify-center transition-colors">
            <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
          </button>
        </div>
      </div>
    </main>
  );
} 