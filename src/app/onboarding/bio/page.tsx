import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function BioEditor() {
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
          <h1 className="text-2xl font-medium">Your Tradr bio</h1>
          <p className="text-[#666666] mt-1">Choose some words for people to see</p>
        </div>

        {/* Bio input */}
        <div className="relative">
          <textarea 
            placeholder="Example: FX scalper based in Thailand."
            className="w-full h-32 bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333] resize-none"
          ></textarea>
          <div className="absolute bottom-3 right-3 text-xs text-[#666666]">
            0/120
          </div>
        </div>

        {/* Tips section */}
        <div className="bg-[#141414] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm font-medium">Tips for a great bio</span>
          </div>
          <ul className="space-y-2 text-sm text-[#666666]">
            <li>• Mention your trading style</li>
            <li>• Share your experience level</li>
            <li>• Add your location (optional)</li>
            <li>• Keep it concise and professional</li>
          </ul>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <Link
            href="/onboarding/profile"
            className="flex items-center justify-center w-full bg-[#7C3AED] hover:bg-[#6D31D9] text-white rounded-xl py-3.5 font-medium transition-colors"
          >
            Save bio
          </Link>
        </div>
      </div>
    </main>
  );
} 