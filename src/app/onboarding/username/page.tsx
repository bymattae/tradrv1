import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function UsernameSelection() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-[#222222]">
        <Link href="/onboarding/profile" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-medium">Choose your @handle</h1>
          <p className="text-[#666666] mt-1">This will be your public Tradr link</p>
        </div>

        {/* Username input */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#666666]">
              @
            </div>
            <input 
              type="text" 
              placeholder="username"
              className="w-full bg-[#141414] border border-[#222222] rounded-xl pl-8 pr-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333]"
            />
          </div>
          
          {/* Availability status */}
          <div className="flex items-center gap-2 text-[#10B981]">
            <Check className="w-4 h-4" />
            <span className="text-sm">Username is available</span>
          </div>

          {/* Preview URL */}
          <div className="text-sm">
            <span className="text-[#666666]">Your profile will be available at</span>{' '}
            <span className="text-[#7C3AED]">tradr.co/@username</span>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <Link
            href="/onboarding/profile"
            className="flex items-center justify-center w-full bg-[#7C3AED] hover:bg-[#6D31D9] text-white rounded-xl py-3.5 font-medium transition-colors"
          >
            Save
          </Link>
        </div>
      </div>
    </main>
  );
} 